'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { CategoryCardSkeleton } from '@/components/common/Skeletons';
import type { Category } from '@/types/category';

interface CategoriesProps {
  initialCategories?: Category[];
}

export function Categories({ initialCategories = [] }: CategoriesProps) {
  const dispatch = useAppDispatch();
  const { items: rawItems, error } = useAppSelector((s) => s.categories);
  // Use live Redux data when available; fall back to server-prefetched data
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : initialCategories;
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (rawItems.length === 0) dispatch(fetchCategories());
  }, [dispatch, rawItems.length]);

  const perPage = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const visible = items.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="bg-[#111] px-4 sm:px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-semibold uppercase text-white leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Categories
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous"
              className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-25 transition-all duration-200 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next"
              className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-25 transition-all duration-200 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        {error && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-white/60 text-sm">Failed to load categories. Please try again.</p>
            <button
              onClick={() => dispatch(fetchCategories())}
              className="bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visible.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer block min-h-90"
              >
                {/* Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain p-12 transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                  <h3 className="font-semibold uppercase text-[#111] text-xl sm:text-2xl leading-tight">
                    {cat.name
                      .split(' ')
                      .reduce<string[][]>((acc, word) => {
                        if (acc.length === 0) return [[word]];
                        const last = acc[acc.length - 1];
                        if (last.join(' ').length + word.length < 10) {
                          last.push(word);
                        } else {
                          acc.push([word]);
                        }
                        return acc;
                      }, [])
                      .map((line, i) => (
                        <span key={i} className="block">
                          {line.join(' ')}
                        </span>
                      ))}
                  </h3>

                  {/* Arrow button */}
                  <div className="w-11 h-11 rounded-xl bg-[#111] flex items-center justify-center shrink-0 ml-3 group-hover:bg-[#4B5BFF] transition-colors duration-200">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M3 13L13 3M13 3H5M13 3V11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
