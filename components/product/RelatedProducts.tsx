'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsByCategory } from '@/store/slices/productsSlice';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import { ProductCard } from '@/components/common/ProductCard';


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
    <section className="bg-[#e7e7e3] px-4 sm:px-6 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-semibold uppercase text-[#111] leading-none"
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
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
