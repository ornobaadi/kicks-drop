'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types/product';

interface ProductActionsProps {
  product: Product;
  selectedColor: string | null;
  selectedSize: string | null;
  needsColor?: boolean;
  needsSize?: boolean;
}

export function ProductActions({ product, selectedColor, selectedSize, needsColor = true, needsSize = true }: ProductActionsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const ready = (!needsColor || !!selectedColor) && (!needsSize || !!selectedSize);

  async function handleAddToCart() {
    if (!ready) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 400));
    dispatch(addItem({ product, color: selectedColor ?? '', size: selectedSize ?? '' }));
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const notReadyHint = needsColor && !selectedColor
    ? 'Select a color'
    : needsSize && !selectedSize
    ? 'Select a size'
    : '';

  return (
    <div className="space-y-3">
      {/* Validation hint */}
      {!ready && (
        <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1zm0 7.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm.75-3a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 1.5 0v1z"/>
          </svg>
          {notReadyHint}
        </p>
      )}

      <div className="flex gap-2">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!ready || adding}
          className={`flex-1 h-12 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200
            ${added
              ? 'bg-green-600 text-white'
              : ready
              ? 'bg-[#111] text-white hover:bg-gray-800 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {adding ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Adding…
            </span>
          ) : added ? (
            '✓ Added to Cart'
          ) : (
            'Add to Cart'
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setWishlist((w) => !w)}
          aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-red-400 transition-all duration-150"
        >
          <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill={wishlist ? '#EF4444' : 'none'}
            stroke={wishlist ? '#EF4444' : '#6B7280'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="transition-all duration-150"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Buy it Now */}
      <button
        disabled={!ready}
        onClick={() => {
          if (!ready) return;
          dispatch(addItem({ product, color: selectedColor ?? '', size: selectedSize ?? '' }));
          router.push('/cart');
        }}
        className={`w-full h-12 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 border-2
          ${ready
            ? 'border-[#4B5BFF] text-[#4B5BFF] hover:bg-[#4B5BFF] hover:text-white active:scale-[0.98]'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        Buy it Now
      </button>
    </div>
  );
}
