'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { productsAPI } from '@/lib/api/products';
import type { Product } from '@/types/product';

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

interface GlobalSearchProps {
  /** In mobile mode it renders full-width inside the nav drawer */
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

export function GlobalSearch({ variant = 'desktop', onNavigate }: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const debounceId = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── open / focus ──────────────────────────────────────────────────────────
  const openSearch = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setActiveIdx(-1);
  }, []);

  // ── outside click → close ─────────────────────────────────────────────────
  useEffect(() => {
    function handler(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [close]);

  // ── debounced API fetch ───────────────────────────────────────────────────
  useEffect(() => {
    if (debounceId.current) clearTimeout(debounceId.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceId.current = setTimeout(async () => {
      try {
        const res = await productsAPI.getFiltered({ title: query.trim(), limit: 3 });
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setActiveIdx(-1);
      }
    }, 300);

    return () => {
      if (debounceId.current) clearTimeout(debounceId.current);
    };
  }, [query]);

  // ── keyboard navigation ───────────────────────────────────────────────────
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { close(); return; }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        router.push(`/products/${results[activeIdx].id}`);
        close();
        onNavigate?.();
      } else if (query.trim()) {
        router.push(`/products?title=${encodeURIComponent(query.trim())}`);
        close();
        onNavigate?.();
      }
    }
  }

  function goToAllResults() {
    if (!query.trim()) return;
    router.push(`/products?title=${encodeURIComponent(query.trim())}`);
    close();
    onNavigate?.();
  }

  const showDropdown = open && query.trim().length > 0;

  // ── MOBILE variant — full-width search row ────────────────────────────────
  if (variant === 'mobile') {
    return (
      <div ref={wrapperRef} className="relative w-full">
        {!open ? (
          <button
            onClick={openSearch}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <HugeiconsIcon icon={Search01Icon} size={18} color="#111" />
            Search
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2">
            <HugeiconsIcon icon={Search01Icon} size={16} color="#9ca3af" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search products…"
              className="flex-1 text-sm bg-transparent outline-none text-[#111] placeholder-gray-400"
            />
            <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors">
              <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" />
            </button>
          </div>
        )}

        {showDropdown && (
          <SearchDropdown
            query={query}
            results={results}
            loading={loading}
            activeIdx={activeIdx}
            onSelect={() => { close(); onNavigate?.(); }}
            onViewAll={goToAllResults}
          />
        )}
      </div>
    );
  }

  // ── DESKTOP variant — collapses to icon, expands to inline input ──────────
  return (
    <div ref={wrapperRef} className="relative flex items-center">
      {!open ? (
        <button
          onClick={openSearch}
          aria-label="Search"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <HugeiconsIcon icon={Search01Icon} size={20} color="#111" />
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64 focus-within:border-[#4B5BFF] focus-within:ring-2 focus-within:ring-[#4B5BFF]/20 transition-all">
          {loading
            ? <svg className="animate-spin w-3.75 h-3.75 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            : <HugeiconsIcon icon={Search01Icon} size={15} color="#9ca3af" className="shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search products…"
            className="flex-1 text-sm bg-transparent outline-none text-[#111] placeholder-gray-400 min-w-0"
          />
          <button onClick={close} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
            <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" />
          </button>
        </div>
      )}

      {showDropdown && (
        <SearchDropdown
          query={query}
          results={results}
          loading={loading}
          activeIdx={activeIdx}
          onSelect={close}
          onViewAll={goToAllResults}
          className="right-0"
        />
      )}
    </div>
  );
}

// ── Shared dropdown ───────────────────────────────────────────────────────────

interface DropdownProps {
  query: string;
  results: Product[];
  loading: boolean;
  activeIdx: number;
  onSelect: () => void;
  onViewAll: () => void;
  className?: string;
}

function SearchDropdown({ query, results, loading, activeIdx, onSelect, onViewAll, className = '' }: DropdownProps) {
  return (
    <div className={`absolute top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Searching…
        </div>
      ) : results.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">No results for <span className="font-semibold text-[#111]">&ldquo;{query}&rdquo;</span></p>
        </div>
      ) : (
        <>
          <ul className="py-1.5">
            {results.map((product, i) => {
              const imageUrl = product.images?.[0] ? cleanImageUrl(product.images[0]) : null;
              const isActive = i === activeIdx;
              return (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    onClick={onSelect}
                    className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                      isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          width={44}
                          height={44}
                          className="object-contain w-full h-full p-1"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111] uppercase tracking-wide truncate leading-tight">
                        {product.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{product.category.name}</p>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-black text-[#4B5BFF] shrink-0">{fmt(product.price)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* View all results footer */}
          <div className="border-t border-gray-100 px-3 py-2.5">
            <button
              onClick={onViewAll}
              className="w-full text-xs font-bold text-[#4B5BFF] hover:text-[#3a47e0] transition-colors text-left flex items-center justify-between group"
            >
              <span>View all results for &ldquo;{query}&rdquo;</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
