'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import type { Product } from '@/types/product';

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden bg-gray-200 min-h-120">
      {/* Simulates the bottom text overlay */}
      <div className="h-full flex flex-col justify-end p-6 pl-12 min-h-120">
        <div className="space-y-3">
          <div className="h-7 w-1/2 bg-gray-300/60 rounded" />
          <div className="h-4 w-1/3 bg-gray-300/60 rounded" />
          <div className="h-4 w-2/5 bg-gray-300/60 rounded" />
          <div className="h-10 w-28 bg-gray-300/60 rounded-lg mt-2" />
        </div>
      </div>
    </div>
  );
}

interface HeroSectionProps {
  initialProducts?: Product[];
}

export function HeroSection({ initialProducts = [] }: HeroSectionProps) {
  const dispatch = useAppDispatch();
  const { items: rawItems } = useAppSelector((s) => s.products);
  // Use live Redux data when available; fall back to server-prefetched data
  // so the initial SSR render and client hydration always agree.
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : initialProducts;

  useEffect(() => {
    if (rawItems.length === 0) dispatch(fetchProducts(20));
  }, [dispatch, rawItems.length]);

  // Pick the first product with multiple images so we can show alternate angles
  const hero =
    items.find((p) => {
      const imgs = (p.images ?? []).map(cleanImageUrl).filter(Boolean);
      return imgs.length >= 3;
    }) ??
    items.find((p) => (p.images ?? []).length > 0) ??
    null;

  const heroImages = hero ? hero.images.map(cleanImageUrl).filter(Boolean) : [];

  // ── FitText: dynamically scale heading to fill container width ──
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fitText = useCallback(() => {
    const heading = headingRef.current;
    const container = containerRef.current;
    if (!heading || !container) return;

    const baseRem = 15;
    heading.style.fontSize = `${baseRem}rem`;
    const containerWidth = container.clientWidth;
    const textWidth = heading.scrollWidth;

    if (textWidth > 0) {
      const scale = containerWidth / textWidth;
      heading.style.fontSize = `${baseRem * scale}rem`;
    }
  }, []);

  useEffect(() => {
    fitText();
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(fitText);
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitText]);

  return (
    <section className="bg-[#e7e7e3] px-4 sm:px-6 pt-24 pb-12 overflow-hidden -mt-21">
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        {/* Giant heading — auto-scales to fill container width */}
        <h1
          ref={headingRef}
          className="font-semibold uppercase leading-none tracking-tighter mb-6 select-none whitespace-nowrap"
        >
          <span className="text-[#111]">DO IT </span>
          <span className="text-[#4B5BFF]">RIGHT</span>
        </h1>

        {/* Main hero layout */}
        {items.length === 0 ? (
          <HeroSkeleton />
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-[#c8ad87] min-h-135">
            {/* Vertical side badge */}
            <div className="absolute left-0 top-0 bottom-0 w-7.5 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
              <span
                className="text-white text-[8px] font-semibold uppercase tracking-[0.22em] whitespace-nowrap select-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Kicks product of the year
              </span>
            </div>

            {/* Main hero image */}
            {heroImages[0] && (
              <div className="absolute inset-0">
                <Image
                  src={heroImages[0]}
                  alt={hero?.title ?? 'Featured product'}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Bottom overlay with text */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-6 pl-12">
              <h2 className="text-white font-black uppercase text-2xl sm:text-3xl lg:text-4xl leading-tight">
                {hero?.title ?? 'KICKS AIR MAX'}
              </h2>
              <p
                className="text-white/70 text-sm mt-1.5 mb-5 max-w-xs leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {hero
                  ? hero.description.slice(0, 65) + (hero.description.length > 65 ? '…' : '')
                  : "Discover the latest drop crafted for everyone's comfort"}
              </p>
              <Link
                href={hero ? `/products/${hero.id}` : '/products'}
                className="inline-block bg-[#4B5BFF] text-white text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-[#3a47e0] transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>

            {/* Right-bottom product thumbnails (same product, different angles) */}
            {heroImages.length >= 2 && (
              <div className="hidden sm:flex absolute right-4 lg:right-6 bottom-4 lg:bottom-6 z-10 flex-col gap-3">
                {heroImages.slice(1, 3).map((img, i) => (
                  <Link
                    key={i}
                    href={hero ? `/products/${hero.id}` : '/products'}
                    className="group relative w-28 h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden ring-[3px] ring-white/40 shadow-lg hover:ring-white/70 transition-all duration-300"
                  >
                    <Image
                      src={img}
                      alt={`${hero?.title ?? 'Product'} view ${i + 2}`}
                      fill
                      sizes="144px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
