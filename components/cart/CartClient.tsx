'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartSubtotal,
} from '@/store/slices/cartSlice';
import { productsAPI } from '@/lib/api/products';
import type { Product } from '@/types/product';

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 6.99;

// Promo codes map: code → discount description + calculator
const PROMO_CODES: Record<string, { label: string; apply: (sub: number, ship: number) => { discount: number; freeShip: boolean } }> = {
  KICKS10: {
    label: '10% off your order',
    apply: (sub) => ({ discount: sub * 0.1, freeShip: false }),
  },
  WELCOME20: {
    label: '20% off your order',
    apply: (sub) => ({ discount: sub * 0.2, freeShip: false }),
  },
  FREESHIP: {
    label: 'Free shipping',
    apply: (_sub, ship) => ({ discount: ship, freeShip: true }),
  },
};

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-6 text-center px-4">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <div>
        <h2 className="font-black uppercase text-[#111] text-2xl mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
        </p>
      </div>
      <Link
        href="/"
        className="inline-block bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-7 py-3.5 rounded-xl hover:bg-[#3a47e0] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

// ── Quantity stepper ───────────────────────────────────────────────────────
interface StepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function Stepper({ value, onDecrement, onIncrement }: StepperProps) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onDecrement}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-medium"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold text-[#111] select-none">
        {value}
      </span>
      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-base font-medium"
      >
        +
      </button>
    </div>
  );
}

// ── Cart item row ──────────────────────────────────────────────────────────
interface CartItemRowProps {
  title: string;
  imageUrl: string | null;
  productId: number;
  color: string;
  size: string;
  price: number;
  quantity: number;
  onRemove: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
}

function CartItemRow({
  title,
  imageUrl,
  productId,
  color,
  size,
  price,
  quantity,
  onRemove,
  onDecrement,
  onIncrement,
}: CartItemRowProps) {
  const lineTotal = price * quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <Link href={`/products/${productId}`} className="shrink-0">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#e7e7e3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="112px"
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9l6 6M15 9l-6 6"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Link href={`/products/${productId}`} className="hover:underline underline-offset-2">
          <p className="font-bold text-sm uppercase tracking-wide text-[#111] line-clamp-2 leading-tight">
            {title}
          </p>
        </Link>

        {/* Color + Size badges */}
        {(color || size) && (
          <div className="flex items-center gap-2 flex-wrap">
            {color && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"
                  style={{ backgroundColor: color }}
                />
                {color}
              </span>
            )}
            {color && size && <span className="text-gray-300">·</span>}
            {size && (
              <span className="text-xs text-gray-500">
                {/^\d+$/.test(size) ? `EU ${size}` : size}
              </span>
            )}
          </div>
        )}

        {/* Price per unit */}
        <p className="text-xs text-gray-400">{fmt(price)} each</p>

        {/* Bottom row: stepper + subtotal + remove */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-1">
          <Stepper value={quantity} onDecrement={onDecrement} onIncrement={onIncrement} />
          <span className="font-black text-[#111] text-sm tabular-nums">{fmt(lineTotal)}</span>
          <button
            onClick={onRemove}
            aria-label="Remove item"
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order summary ──────────────────────────────────────────────────────────
interface OrderSummaryProps {
  subtotal: number;
  itemCount: number;
  onConfirmOrder: () => void;
}

// ── Checkout "Coming Soon" modal ───────────────────────────────────────────
interface CheckoutModalProps {
  total: number;
  itemCount: number;
  shipping: number;
  discount: number;
  appliedCode: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

function CheckoutModal({ total, itemCount, shipping, discount, appliedCode, onClose, onConfirm }: CheckoutModalProps) {
  const [visible, setVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 900));
    onConfirm();
  }

  // Trigger entrance animation after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  const TRUST_BADGES = [
    { icon: '🔒', label: 'SSL Secured' },
    { icon: '↩️', label: 'Free Returns' },
    { icon: '🚚', label: 'Fast Delivery' },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto max-h-[92dvh] sm:max-h-[88dvh] transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.97)',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Header */}
        <div className="bg-[#111] px-6 pt-6 pb-5 relative">
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white/70 hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4B5BFF] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-tight text-lg leading-none">Secure Checkout</h2>
              <p className="text-white/50 text-xs mt-0.5">256-bit SSL encryption</p>
            </div>
          </div>

          {/* Order recap pill */}
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-white/70 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <div className="text-right">
              {discount > 0 && (
                <p className="text-green-400 text-[11px] font-semibold">
                  −{fmt(discount)} {appliedCode && `(${appliedCode})`}
                </p>
              )}
              <p className="text-white font-black text-xl leading-none">{fmt(total)}</p>
              {shipping === 0 && (
                <p className="text-green-400 text-[11px] font-medium">Free shipping included</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Trust badges */}
          <div className="flex items-center justify-around py-1">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <span className="text-lg leading-none">{b.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Confirm Order CTA */}
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className={`w-full rounded-xl text-sm font-bold uppercase tracking-widest py-4 transition-all duration-200 flex items-center justify-center gap-2.5
              ${confirming
                ? 'bg-[#3a47e0] text-white cursor-wait'
                : 'bg-[#4B5BFF] text-white hover:bg-[#3a47e0] active:scale-[0.98]'
              }`}
          >
            {confirming ? (
              <>
                <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Processing your order…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Confirm Order · {fmt(total)}
              </>
            )}
          </button>

          {/* Payment method logos */}
          <div className="space-y-2">
            <p className="text-[11px] text-center text-gray-400 font-medium uppercase tracking-widest">
              Accepted payments
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { label: 'Visa',    bg: '#1a1f71', color: 'white' },
                { label: 'MC',      bg: '#eb001b', color: 'white' },
                { label: 'Amex',    bg: '#016fcf', color: 'white' },
                { label: 'PayPal',  bg: '#003087', color: 'white' },
                { label: 'Apple Pay', bg: '#000',  color: 'white' },
                { label: 'GPay',    bg: '#4285f4', color: 'white' },
              ].map((m) => (
                <span
                  key={m.label}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-md"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, itemCount, onConfirmOrder }: OrderSummaryProps) {
  const baseShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Promo code state
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const promoData = appliedCode ? PROMO_CODES[appliedCode] : null;
  const promoResult = promoData ? promoData.apply(subtotal, baseShipping) : null;
  const discount = promoResult?.discount ?? 0;
  const shipping = promoResult?.freeShip ? 0 : baseShipping;
  const total = subtotal + shipping - (promoResult?.freeShip ? 0 : discount);

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedCode(code);
      setPromoError('');
      setPromoInput('');
      setPromoOpen(false);
    } else {
      setPromoError('Invalid promo code. Try KICKS10, WELCOME20 or FREESHIP.');
    }
  }

  // Apply a promo code programmatically (used by suggestion chips)
  function applyCode(code: string) {
    const c = code.trim().toUpperCase();
    if (PROMO_CODES[c]) {
      setAppliedCode(c);
      setPromoError('');
      setPromoInput('');
      setPromoOpen(false);
    } else {
      setPromoError('Invalid promo code.');
    }
  }

  function removePromo() {
    setAppliedCode(null);
    setPromoError('');
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 lg:sticky lg:top-28">
      <h2 className="font-bold uppercase text-[#111] text-lg tracking-tight">Order Summary</h2>

      {/* Free shipping progress */}
      {shipping > 0 && !promoResult?.freeShip && (
        <div className="bg-[#e7e7e3] rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-2">
            Add <span className="font-bold text-[#4B5BFF]">{fmt(toFreeShipping)}</span> more for free shipping!
          </p>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4B5BFF] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>
      )}
      {(shipping === 0 || promoResult?.freeShip) && (
        <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p className="text-xs text-green-700 font-semibold">You qualify for free shipping!</p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-[#111]">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-[#111]'}`}>
            {shipping === 0 ? 'Free' : fmt(shipping)}
          </span>
        </div>
        {discount > 0 && !promoResult?.freeShip && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Promo ({appliedCode})
            </span>
            <span className="font-semibold">−{fmt(discount)}</span>
          </div>
        )}
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between text-base font-semibold text-[#111]">
          <span>Total</span>
          <span className="text-[#4B5BFF]">{fmt(total)}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => setCheckoutOpen(true)}
        className="w-full h-13 rounded-xl bg-[#111] text-white text-sm font-bold uppercase tracking-widest mt-2 py-3 hover:bg-[#4B5BFF] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Proceed to Checkout
      </button>

      {checkoutOpen && (
        <CheckoutModal
          total={total}
          itemCount={itemCount}
          shipping={shipping}
          discount={discount}
          appliedCode={appliedCode}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={onConfirmOrder}
        />
      )}

      {/* Promo code section */}
      <div>

        {appliedCode ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide">{appliedCode}</p>
                <p className="text-[11px] text-green-600">{PROMO_CODES[appliedCode].label}</p>
              </div>
            </div>
            <button
              onClick={removePromo}
              aria-label="Remove promo code"
              className="w-6 h-6 rounded-full flex items-center justify-center text-green-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ) : (
          <div>
            {!promoOpen ? (
              <button
                onClick={() => { setPromoOpen(true); setPromoError(''); }}
                className="w-full text-sm text-gray-500 hover:text-[#4B5BFF] font-medium transition-colors text-center underline underline-offset-2"
              >
                Use a promo code
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="Enter promo code"
                    autoFocus
                    className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium text-[#111] placeholder:text-gray-400 focus:outline-none focus:border-[#4B5BFF] focus:ring-2 focus:ring-[#4B5BFF]/20 transition"
                  />
                  <button
                    onClick={applyPromo}
                    className="h-10 px-4 rounded-xl bg-[#111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-gray-500">Quick suggestions:</p>
                  <button onClick={() => applyCode('KICKS10')} className="text-[11px] text-[#4B5BFF] font-medium">KICKS10</button>
                  <button onClick={() => applyCode('WELCOME20')} className="text-[11px] text-[#4B5BFF] font-medium">WELCOME20</button>
                  <button onClick={() => applyCode('FREESHIP')} className="text-[11px] text-[#4B5BFF] font-medium">FREESHIP</button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-500 font-medium px-1">{promoError}</p>
                )}
                <button
                  onClick={() => { setPromoOpen(false); setPromoInput(''); setPromoError(''); }}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        Free shipping &amp; returns on all orders.
      </p>

    </div>
  );
}

// ── Recommendation card ────────────────────────────────────────────────────
interface RecommendationCardProps {
  product: Product;
}

function RecommendationCard({ product }: RecommendationCardProps) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const imageUrl = product.images?.[0]
    ? product.images[0].replace(/[\[\]"]/g, '').split(',')[0].trim()
    : null;

  function handleQuickAdd() {
    dispatch(addItem({ product, color: 'Default', size: 'One Size' }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="shrink-0 w-44 sm:w-52 bg-white rounded-2xl border border-gray-100 overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full aspect-square bg-[#e7e7e3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="208px"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="m9 9 6 6M15 9l-6 6"/>
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 space-y-2">
        <Link href={`/products/${product.id}`}>
          <p className="text-xs font-bold uppercase tracking-wide text-[#111] line-clamp-2 leading-tight hover:underline underline-offset-2">
            {product.title}
          </p>
        </Link>
        <p className="text-xs font-semibold text-[#4B5BFF]">{fmt(product.price)}</p>
        <button
          onClick={handleQuickAdd}
          className={`w-full h-8 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all duration-200
            ${added
              ? 'bg-green-500 text-white'
              : 'bg-[#111] text-white hover:bg-[#333]'
            }`}
        >
          {added ? '✓ Added!' : 'Quick Add'}
        </button>
      </div>
    </div>
  );
}

// ── Recommendations strip ──────────────────────────────────────────────────
function CartRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cartItems = useAppSelector(selectCartItems);
  const cartIds = new Set(cartItems.map((i) => i.product.id));

  useEffect(() => {
    productsAPI.getAll(20, 0).then(({ data }) => {
      const filtered = data.filter((p) => !cartIds.has(p.id)).slice(0, 12);
      setProducts(filtered);
      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="font-black uppercase text-[#111] text-xl tracking-tight mb-5">You may also like</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 sm:w-52 h-64 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black uppercase text-[#111] text-xl tracking-tight">You may also like</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <RecommendationCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// ── Cart skeleton (shown before localStorage hydration) ───────────────────
function CartPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-36 bg-gray-200 rounded-lg" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
              <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/4 bg-gray-200 rounded" />
                <div className="h-8 w-28 bg-gray-200 rounded-lg mt-2" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
}

// ── Main CartClient ────────────────────────────────────────────────────────
export function CartClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  // Defer rendering until after mount so the server HTML (empty cart)
  // always matches the initial client render — prevents hydration mismatch
  // caused by CartHydrator loading localStorage after the first paint.
  const [hasMounted, setHasMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  if (!hasMounted) {
    return <CartPageSkeleton />;
  }

  // While navigating to /order-confirmation, render nothing so the
  // "Your cart is empty" flash never appears between clearCart() and navigation.
  if (redirecting) {
    return null;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <h1 className="font-black uppercase text-[#111] leading-none"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
            Your Cart
          </h1>
          <p className="text-sm text-gray-500 mt-2">Use <span className="font-bold text-[#4B5BFF]">KICKS10</span> for 10% off your first order.</p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-gray-400 hover:text-red-500 font-semibold uppercase tracking-wider transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Body: items + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left — cart items */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 divide-y-0">
          {items.map((item) => {
            const imageUrl = item.product.images?.[0]
              ? cleanImageUrl(item.product.images[0])
              : null;
            return (
              <CartItemRow
                key={item.key}
                title={item.product.title}
                imageUrl={imageUrl}
                productId={item.product.id}
                color={item.color}
                size={item.size}
                price={item.product.price}
                quantity={item.quantity}
                onRemove={() => dispatch(removeItem(item.key))}
                onDecrement={() =>
                  dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))
                }
                onIncrement={() =>
                  dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))
                }
              />
            );
          })}
        </div>

        {/* Right — order summary */}
        <OrderSummary
            subtotal={subtotal}
            itemCount={itemCount}
            onConfirmOrder={() => {
              setRedirecting(true);
              dispatch(clearCart());
              router.push('/order-confirmation');
            }}
          />
      </div>

      {/* Recommendations */}
      <CartRecommendations />

      {/* Continue browsing */}
      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111] font-medium transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
