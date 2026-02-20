'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse flex gap-3" style={{ minHeight: '440px' }}>
      <div className="flex-1 rounded-2xl bg-gray-200" />
      <div className="flex flex-col gap-3 w-[28%] max-w-50">
        <div className="flex-1 rounded-2xl bg-gray-200" />
        <div className="flex-1 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

export function HeroSection() {
  const dispatch = useAppDispatch();
  const { items: rawItems, loading } = useAppSelector((s) => s.products);
  const items = Array.isArray(rawItems) ? rawItems : [];

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts(20));
  }, [dispatch, items.length]);

  // Only use products that have at least one image
  const withImages = items.filter((p) => p.images?.length > 0 && p.images[0]);
  const hero = withImages[0] ?? null;
  const thumb1 = withImages[1] ?? null;
  const thumb2 = withImages[2] ?? null;

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
    <section className="bg-[#eeece8] px-4 sm:px-6 pt-8 pb-12 overflow-hidden">
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
        {loading && items.length === 0 ? (
          <HeroSkeleton />
        ) : (
          <div className="flex gap-3 items-stretch" style={{ minHeight: '440px' }}>
            {/* Large hero card */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#c8ad87]">
              {/* Vertical side badge */}
              <div className="absolute left-0 top-0 bottom-0 w-7.5 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                <span
                  className="text-white text-[8px] font-semibold uppercase tracking-[0.22em] whitespace-nowrap select-none"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Nike product of the year
                </span>
              </div>

              {/* Image */}
              {hero && hero.images?.[0] && (
                <div className="absolute inset-0">
                  <Image
                    src={cleanImageUrl(hero.images[0])}
                    alt={hero.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover"
                    priority
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-6 pl-12">
                <h2 className="text-white font-black uppercase text-2xl sm:text-3xl lg:text-4xl leading-tight">
                  {hero?.title ?? 'NIKE AIR MAX'}
                </h2>
                <p
                  className="text-white/70 text-sm mt-1.5 mb-5 max-w-xs leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {hero
                    ? hero.description.slice(0, 65) + (hero.description.length > 65 ? '…' : '')
                    : "Nike introducing the new air max for everyone's comfort"}
                </p>
                <Link
                  href={hero ? `/products/${hero.id}` : '/products'}
                  className="inline-block bg-[#4B5BFF] text-white text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-[#3a47e0] transition-colors duration-200"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Right thumbnails */}
            <div className="hidden sm:flex flex-col gap-3 w-[27%] max-w-52.5">
              {thumb1 && thumb1.images?.[0] && (
                <Link
                  href={`/products/${thumb1.id}`}
                  className="group relative flex-1 rounded-2xl overflow-hidden bg-[#d4c4ae] min-h-35"
                >
                  <Image
                    src={cleanImageUrl(thumb1.images[0])}
                    alt={thumb1.title}
                    fill
                    sizes="210px"
                    className="object-cover group-hover:scale-105 transition-transform duration-400"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </Link>
              )}
              {thumb2 && thumb2.images?.[0] && (
                <Link
                  href={`/products/${thumb2.id}`}
                  className="group relative flex-1 rounded-2xl overflow-hidden bg-[#bfaf99] min-h-35"
                >
                  <Image
                    src={cleanImageUrl(thumb2.images[0])}
                    alt={thumb2.title}
                    fill
                    sizes="210px"
                    className="object-cover group-hover:scale-105 transition-transform duration-400"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
