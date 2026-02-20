'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsByCategory } from '@/store/slices/productsSlice';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

interface RelatedProductsProps {
  categoryId: number;
  excludeId: number;
}

export function RelatedProducts({ categoryId, excludeId }: RelatedProductsProps) {
  const dispatch = useAppDispatch();
  const { relatedProducts, relatedLoading: loading } = useAppSelector((s) => s.products);
  const [offset, setOffset] = useState(0);
  const perPage = 4;

  // Reset offset during render when categoryId changes (avoids setState-in-effect)
  const [prevCategoryId, setPrevCategoryId] = useState(categoryId);
  if (prevCategoryId !== categoryId) {
    setPrevCategoryId(categoryId);
    setOffset(0);
  }

  useEffect(() => {
    dispatch(fetchProductsByCategory({ categoryId, limit: 12 }));
  }, [categoryId, dispatch]);

  const filtered = relatedProducts.filter((p) => p.id !== excludeId);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice(offset, offset + perPage);

  if (!loading && filtered.length === 0) return null;

  return (
    <section className="bg-white px-4 sm:px-6 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-black uppercase text-[#111] leading-none"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
          >
            You May Also Like
          </h2>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setOffset((o) => Math.max(0, o - perPage))}
                disabled={offset === 0}
                aria-label="Previous"
                className="w-10 h-10 rounded-lg border border-gray-200 text-gray-400 hover:text-[#111] hover:border-gray-400 disabled:opacity-30 transition-all flex items-center justify-center text-lg font-medium"
              >
                ‹
              </button>
              <button
                onClick={() => setOffset((o) => Math.min((totalPages - 1) * perPage, o + perPage))}
                disabled={offset + perPage >= filtered.length}
                aria-label="Next"
                className="w-10 h-10 rounded-lg border border-gray-200 text-gray-400 hover:text-[#111] hover:border-gray-400 disabled:opacity-30 transition-all flex items-center justify-center text-lg font-medium"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {loading && filtered.length === 0 ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {visible.map((p) => {
              const img = p.images?.[0] ? cleanImageUrl(p.images[0]) : null;
              const price = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(p.price);
              return (
                <Link key={p.id} href={`/products/${p.id}`} className="group block">
                  <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow duration-200 hover:shadow-md">
                    <span className="absolute top-3 left-3 z-10 bg-[#4B5BFF] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      New
                    </span>
                    <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M9 9l6 6M15 9l-6 6"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="px-3 pt-3 pb-1">
                      <p className="font-bold text-xs uppercase tracking-wide text-gray-900 line-clamp-2 leading-tight">
                        {p.title}
                      </p>
                    </div>
                    <div className="px-3 pb-3 pt-2">
                      <div className="flex items-center justify-between bg-black text-white rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider group-hover:bg-gray-800 transition-colors">
                        <span>View Product</span>
                        <span className="text-blue-400">{price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
