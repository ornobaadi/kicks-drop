'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import type { Product } from '@/types/product';

interface NewDropsProps {
  initialProducts?: Product[];
}

export function NewDrops({ initialProducts = [] }: NewDropsProps) {
  const dispatch = useAppDispatch();
  const { items: rawItems, error } = useAppSelector((s) => s.products);
  // Use live Redux data when available; fall back to server-prefetched data
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : initialProducts;

  useEffect(() => {
    if (rawItems.length === 0) dispatch(fetchProducts(20));
  }, [dispatch, rawItems.length]);

  const allProducts = items.filter((p) => p.images?.length > 0 && p.images[0]);
  // Prefer 4 items but replace the 4th if it has a very short title
  const products = allProducts.slice(0, 4);
  if (products.length === 4) {
    const fourth = products[3];
    if ((fourth.title || '').length < 20) {
      const replacement = allProducts.slice(4).find((p) => (p.title || '').length >= 20);
      if (replacement) products[3] = replacement;
    }
  }

  return (
    <section id="new-drops" className="bg-[#e7e7e3] px-4 sm:px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <h2
            className="font-semibold uppercase text-[#111] leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Don&apos;t Miss Out
            <br />
            New Drops
          </h2>
          <div className="shrink-0 mt-1">
            <Link
              href="/products"
              className="inline-block bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-[#3a47e0] transition-colors duration-200 whitespace-nowrap"
            >
              Shop New Drops
            </Link>
          </div>
        </div>

        {/* Product grid */}
        {error && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Failed to load products. Please try again.</p>
            <button
              onClick={() => dispatch(fetchProducts(20))}
              className="bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-[#3a47e0] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} showNewBadge />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
