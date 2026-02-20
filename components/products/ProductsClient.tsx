'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCatalogProducts,
  fetchCatalogByCategory,
  clearCatalog,
} from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

const PAGE_SIZE = 12;

export function ProductsClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category');
  const selectedCategoryId = categoryParam ? Number(categoryParam) : null;

  const {
    catalogItems,
    catalogLoading: loading,
    catalogError: error,
  } = useAppSelector((s) => s.products);

  const { items: categories } = useAppSelector((s) => s.categories);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Reset page when category or search changes (during render — avoids setState in effect)
  const [prevCategoryId, setPrevCategoryId] = useState(selectedCategoryId);
  const [prevSearch, setPrevSearch] = useState(search);
  if (prevCategoryId !== selectedCategoryId) {
    setPrevCategoryId(selectedCategoryId);
    setPage(1);
  }
  if (prevSearch !== search) {
    setPrevSearch(search);
    setPage(1);
  }

  // Fetch categories once
  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  // Fetch products whenever category filter changes
  useEffect(() => {
    dispatch(clearCatalog());
    if (selectedCategoryId) {
      dispatch(fetchCatalogByCategory(selectedCategoryId));
    } else {
      dispatch(fetchCatalogProducts());
    }
  }, [dispatch, selectedCategoryId]);

  // Client-side search filter on top of API results
  const filtered = useMemo(() => {
    if (!search.trim()) return catalogItems;
    const q = search.toLowerCase();
    return catalogItems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
    );
  }, [catalogItems, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function selectCategory(id: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) {
      params.delete('category');
    } else {
      params.set('category', String(id));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* ── Page header ── */}
      <div className="bg-[#111] px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1
            className="font-black uppercase text-white leading-none mb-2"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            All Products
          </h1>
          <p className="text-white/50 text-sm">
            {loading
              ? 'Loading…'
              : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}${selectedCategoryId ? ' in this category' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Filters bar ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5BFF]/40 focus:border-[#4B5BFF] transition"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => selectCategory(null)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                selectedCategoryId === null
                  ? 'bg-[#111] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                  selectedCategoryId === cat.id
                    ? 'bg-[#4B5BFF] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#4B5BFF] hover:text-[#4B5BFF]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Products grid ── */}
        {error && catalogItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-gray-500 text-sm">Failed to load products. Please try again.</p>
            <button
              onClick={() =>
                selectedCategoryId
                  ? dispatch(fetchCatalogByCategory(selectedCategoryId))
                  : dispatch(fetchCatalogProducts())
              }
              className="bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-[#3a47e0] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <ProductGridSkeleton count={PAGE_SIZE} />
        ) : paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-gray-400 text-sm">No products found.</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-[#4B5BFF] text-xs font-bold underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paged.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 disabled:opacity-30 transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                if (idx > 0 && (n as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                      page === n
                        ? 'bg-[#111] text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 disabled:opacity-30 transition"
            >
              Next →
            </button>
          </div>
        )}

        {/* ── Result count hint ── */}
        {!loading && filtered.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
          </p>
        )}
      </div>
    </main>
  );
}
