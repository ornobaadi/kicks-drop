'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCatalogFiltered, clearCatalog } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

// ── PriceRangeSlider ─────────────────────────────────────────────────────────
interface PriceRangeSliderProps {
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
}

function PriceRangeSlider({ min, max, low, high, onChange }: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'low' | 'high' | null>(null);

  function pct(v: number) {
    return ((v - min) / (max - min)) * 100;
  }

  function valFromClientX(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    const raw = Math.round(((clientX - rect.left) / rect.width) * (max - min) + min);
    return Math.max(min, Math.min(max, raw));
  }

  function onThumbPointerDown(thumb: 'low' | 'high') {
    return (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragging.current = thumb;
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    };
  }

  function onThumbPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const v = valFromClientX(e.clientX);
    if (dragging.current === 'low') {
      onChange(Math.min(v, high - 1), high);
    } else {
      onChange(low, Math.max(v, low + 1));
    }
  }

  function onThumbPointerUp() {
    dragging.current = null;
  }

  return (
    <div ref={trackRef} className="relative h-6 flex items-center mb-3 select-none">
      {/* track base */}
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200" />
      {/* active fill */}
      <div
        className="absolute h-1.5 rounded-full bg-[#4B5BFF] pointer-events-none"
        style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
      />
      {/* low thumb */}
      <div
        className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#4B5BFF] shadow-md
          cursor-grab active:cursor-grabbing touch-none -translate-x-1/2"
        style={{ left: `${pct(low)}%`, zIndex: low > max - 50 ? 5 : 3 }}
        onPointerDown={onThumbPointerDown('low')}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
      />
      {/* high thumb */}
      <div
        className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#4B5BFF] shadow-md
          cursor-grab active:cursor-grabbing touch-none -translate-x-1/2"
        style={{ left: `${pct(high)}%`, zIndex: 4 }}
        onPointerDown={onThumbPointerDown('high')}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
      />
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function num(v: string | null) {
  const n = Number(v);
  return v && !isNaN(n) ? n : null;
}

function buildParams(current: URLSearchParams, patch: Record<string, string | null>) {
  const next = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === '') next.delete(k);
    else next.set(k, v);
  }
  return next;
}

const PAGE_SIZE = 12;

export function ProductsClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── read active filters from URL ──────────────────────────────────────────
  const urlTitle    = searchParams.get('title') ?? '';
  const urlCategory = num(searchParams.get('category'));
  const urlPriceMin = num(searchParams.get('price_min'));
  const urlPriceMax = num(searchParams.get('price_max'));

  // ── redux ─────────────────────────────────────────────────────────────────
  const { catalogItems, catalogLoading: loading, catalogError: error } =
    useAppSelector((s) => s.products);

  const { items: rawCategories } = useAppSelector((s) => s.categories);
  const categories = rawCategories.filter(
    (c) => !c.name.includes('{{') && !c.name.includes('}}'),
  );

  // ── local UI state ────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState(urlTitle);
  const [page, setPage]               = useState(1);
  const [priceOpen, setPriceOpen]     = useState(false);
  const [draftMin, setDraftMin]       = useState(urlPriceMin?.toString() ?? '');
  const [draftMax, setDraftMax]       = useState(urlPriceMax?.toString() ?? '');
  const priceRef = useRef<HTMLDivElement>(null);

  // ── price slider bounds ───────────────────────────────────────────────────
  const SLIDER_MIN = 0;
  const SLIDER_MAX = 1000;
  const sliderMin = draftMin !== '' ? Math.max(SLIDER_MIN, Math.min(Number(draftMin), SLIDER_MAX)) : SLIDER_MIN;
  const sliderMax = draftMax !== '' ? Math.max(SLIDER_MIN, Math.min(Number(draftMax), SLIDER_MAX)) : SLIDER_MAX;

  // keep searchInput in sync when URL changes externally (e.g. back/forward)
  const prevTitle = useRef(urlTitle);
  if (prevTitle.current !== urlTitle) {
    prevTitle.current = urlTitle;
    setSearchInput(urlTitle);
  }

  // ── reset page when filters change ───────────────────────────────────────
  const filterKey = `${urlTitle}|${urlCategory}|${urlPriceMin}|${urlPriceMax}`;
  const prevFilterKey = useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    setPage(1);
  }

  // ── fetch categories once ─────────────────────────────────────────────────
  useEffect(() => {
    if (rawCategories.length === 0) dispatch(fetchCategories());
  }, [dispatch, rawCategories.length]);

  // ── fetch products whenever URL filters change ────────────────────────────
  useEffect(() => {
    dispatch(clearCatalog());
    dispatch(fetchCatalogFiltered({
      ...(urlTitle      ? { title: urlTitle }           : {}),
      ...(urlCategory   ? { categoryId: urlCategory }   : {}),
      ...(urlPriceMin != null ? { price_min: urlPriceMin } : {}),
      ...(urlPriceMax != null ? { price_max: urlPriceMax } : {}),
    }));
  }, [dispatch, urlTitle, urlCategory, urlPriceMin, urlPriceMax]);

  // ── debounce title search → URL ───────────────────────────────────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const t = setTimeout(() => {
      router.push(`${pathname}?${buildParams(searchParams, { title: searchInput || null }).toString()}`);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // ── close price popover on outside click ─────────────────────────────────
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) {
        setPriceOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // ── navigation helpers ────────────────────────────────────────────────────
  const setFilter = useCallback((patch: Record<string, string | null>) => {
    router.push(`${pathname}?${buildParams(searchParams, patch).toString()}`);
  }, [router, pathname, searchParams]);

  function selectCategory(id: number | null) {
    setFilter({ category: id?.toString() ?? null });
  }

  function applyPrice() {
    setFilter({ price_min: draftMin || null, price_max: draftMax || null });
    setPriceOpen(false);
  }

  function clearPrice() {
    setDraftMin(''); setDraftMax('');
    setFilter({ price_min: null, price_max: null });
    setPriceOpen(false);
  }

  function clearAll() {
    setSearchInput(''); setDraftMin(''); setDraftMax('');
    router.push(pathname);
  }

  // ── pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(catalogItems.length / PAGE_SIZE));
  const paged = catalogItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── active filter state ───────────────────────────────────────────────────
  const priceActive = urlPriceMin != null || urlPriceMax != null;
  const anyFilter   = !!urlTitle || !!urlCategory || priceActive;
  const priceLabel  = priceActive
    ? urlPriceMin != null && urlPriceMax != null
      ? `$${urlPriceMin} – $${urlPriceMax}`
      : urlPriceMin != null ? `≥ $${urlPriceMin}` : `≤ $${urlPriceMax}`
    : null;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#e7e7e3]">

      {/* ── page header ── */}
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
              : `${catalogItems.length} product${catalogItems.length !== 1 ? 's' : ''}${urlCategory ? ' in this category' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── filters bar ── */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-48 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5BFF]/40 focus:border-[#4B5BFF] transition"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Price range popover */}
            <div ref={priceRef} className="relative">
              <button
                onClick={() => {
                  setDraftMin(urlPriceMin?.toString() ?? '');
                  setDraftMax(urlPriceMax?.toString() ?? '');
                  setPriceOpen((o) => !o);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors duration-150 ${
                  priceActive
                    ? 'bg-[#4B5BFF] text-white border-[#4B5BFF]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#4B5BFF] hover:text-[#4B5BFF]'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="18" x2="11" y2="18"/>
                </svg>
                {priceActive ? priceLabel : 'Price'}
                {priceActive && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); clearPrice(); }}
                    className="ml-0.5 opacity-80 hover:opacity-100"
                    aria-label="Clear price filter"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </span>
                )}
              </button>

              {priceOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Price Range</p>

                  {/* ── Dual-thumb range slider ── */}
                  <PriceRangeSlider
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    low={sliderMin}
                    high={sliderMax}
                    onChange={(lo, hi) => {
                      setDraftMin(String(lo));
                      setDraftMax(String(hi));
                    }}
                  />

                  {/* ── Min / Max tick labels ── */}
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-4">
                    <span>${SLIDER_MIN}</span>
                    <span>${SLIDER_MAX}+</span>
                  </div>

                  {/* ── Numeric summary badges ── */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Min</p>
                      <input
                        type="number" min={SLIDER_MIN} max={sliderMax - 1}
                        value={draftMin}
                        onChange={(e) => setDraftMin(e.target.value)}
                        placeholder="0"
                        className="w-full text-sm font-bold text-center text-[#111] bg-transparent outline-none"
                      />
                    </div>
                    <span className="text-gray-300 font-medium text-lg">–</span>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Max</p>
                      <input
                        type="number" min={sliderMin + 1} max={SLIDER_MAX}
                        value={draftMax}
                        onChange={(e) => setDraftMax(e.target.value)}
                        placeholder="∞"
                        className="w-full text-sm font-bold text-center text-[#111] bg-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearPrice}
                      className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={applyPrice}
                      className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#111] text-white hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear all filters */}
            {anyFilter && (
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-[#111] font-semibold transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => selectCategory(null)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                urlCategory === null
                  ? 'bg-[#111] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(urlCategory === cat.id ? null : cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                  urlCategory === cat.id
                    ? 'bg-[#4B5BFF] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#4B5BFF] hover:text-[#4B5BFF]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── products grid ── */}
        {error && catalogItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#111] text-base mb-1">Failed to load products</h3>
              <p className="text-gray-400 text-sm">Check your connection and try again.</p>
            </div>
            <button
              onClick={() => dispatch(fetchCatalogFiltered({
                ...(urlTitle    ? { title: urlTitle }         : {}),
                ...(urlCategory ? { categoryId: urlCategory } : {}),
                ...(urlPriceMin != null ? { price_min: urlPriceMin } : {}),
                ...(urlPriceMax != null ? { price_max: urlPriceMax } : {}),
              }))}
              className="bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#3a47e0] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <ProductGridSkeleton count={PAGE_SIZE} />
        ) : paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <path d="M8 11h6M11 8v6" opacity="0.4"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#111] text-base mb-1">No products found</p>
              <p className="text-gray-400 text-sm max-w-xs">
                {anyFilter
                  ? 'Try adjusting your filters to find what you\u2019re looking for.'
                  : 'Check back soon — new items are added regularly.'}
              </p>
            </div>
            {anyFilter && (
              <button
                onClick={clearAll}
                className="bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-[#3a47e0] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paged.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* ── pagination ── */}
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
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
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
                ),
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

        {/* ── result count hint ── */}
        {!loading && catalogItems.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, catalogItems.length)}–
            {Math.min(page * PAGE_SIZE, catalogItems.length)} of {catalogItems.length} products
          </p>
        )}
      </div>
    </main>
  );
}
