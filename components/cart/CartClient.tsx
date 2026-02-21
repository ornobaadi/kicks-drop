'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeItem,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartSubtotal,
} from '@/store/slices/cartSlice';

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
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
}

function OrderSummary({ subtotal, itemCount }: OrderSummaryProps) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 lg:sticky lg:top-28">
      <h2 className="font-black uppercase text-[#111] text-lg tracking-tight">Order Summary</h2>

      {/* Free shipping progress */}
      {shipping > 0 && (
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
      {shipping === 0 && (
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
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between text-base font-black text-[#111]">
          <span>Total</span>
          <span className="text-[#4B5BFF]">{fmt(total)}</span>
        </div>
      </div>

      {/* CTA — visual only / disabled per spec */}
      <button
        disabled
        className="w-full h-13 rounded-xl bg-[#111] text-white text-sm font-bold uppercase tracking-widest opacity-40 cursor-not-allowed mt-2 py-3"
        title="Checkout not yet available"
      >
        Proceed to Checkout
      </button>

      <p className="text-center text-xs text-gray-400">
        Checkout coming soon. Your cart is saved.
      </p>

      {/* Payment icons */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
          <span
            key={method}
            className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main CartClient ────────────────────────────────────────────────────────
export function CartClient() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="font-black uppercase text-[#111] leading-none"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
          Your Cart
        </h1>
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
        <OrderSummary subtotal={subtotal} itemCount={itemCount} />
      </div>

      {/* Continue browsing */}
      <div className="mt-8 text-center">
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
