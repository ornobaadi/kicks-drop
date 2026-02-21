'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

interface ProductGalleryProps {
  images: string[];
  title: string;
}

/* ─── Cursor-tracking zoom cell (desktop only) ─── */
interface ZoomCellProps {
  src: string;
  alt: string;
  sizes: string;
  padding: string;
  className?: string;
  overlayContent?: React.ReactNode;
  onTap?: () => void;
}

function ZoomCell({ src, alt, sizes, padding, className = '', overlayContent, onTap }: ZoomCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    setOrigin(`${x}% ${y}%`);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${className}`}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
      onClick={onTap}
    >
      <div
        style={{
          transformOrigin: origin,
          transform: zoomed ? 'scale(2.3)' : 'scale(1)',
          transition: zoomed
            ? 'transform 0.12s ease-out'
            : 'transform 0.28s ease-out',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-contain ${padding}`}
        />
      </div>
      {overlayContent}
    </div>
  );
}

/* ─── Fullscreen lightbox (mobile + desktop click) ─── */
interface LightboxProps {
  images: string[];
  title: string;
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ images, title, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-200 bg-black/90 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 2l14 14M16 2L2 16" />
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Image — pinch-zoom works natively here */}
      <div
        className="relative w-full max-w-2xl mx-auto px-4"
        style={{ touchAction: 'pinch-zoom' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
          touchStartX.current = null;
        }}
      >
        <div className="relative aspect-square w-full">
          <Image
            key={images[index]}
            src={images[index]}
            alt={`${title} ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </>
      )}

      {/* Dot strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`rounded-full transition-all duration-200 ${i === index ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const cleaned = images.map(cleanImageUrl).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (cleaned.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] aspect-square w-full flex items-center justify-center text-gray-300">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      </div>
    );
  }

  const extraCount = cleaned.length - 4;

  return (
    <>
      {/* ─── DESKTOP: zoomable image grid ─── */}
      <div className="hidden md:block">
        {cleaned.length === 1 && (
          <ZoomCell
            src={cleaned[0]}
            alt={title}
            sizes="50vw"
            padding="p-8"
            className="rounded-2xl bg-[#e7e7e3] aspect-square w-full"
            onTap={() => setLightboxIndex(0)}
          />
        )}

        {cleaned.length === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {cleaned.map((src, i) => (
              <ZoomCell
                key={i}
                src={src}
                alt={`${title} ${i + 1}`}
                sizes="25vw"
                padding="p-5"
                className="rounded-2xl bg-[#e7e7e3] aspect-square"
                onTap={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        )}

        {cleaned.length === 3 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ aspectRatio: '1' }}>
            <ZoomCell
              src={cleaned[0]}
              alt={`${title} 1`}
              sizes="25vw"
              padding="p-6"
              className="rounded-2xl bg-[#e7e7e3] row-span-2"
              onTap={() => setLightboxIndex(0)}
            />
            <ZoomCell
              src={cleaned[1]}
              alt={`${title} 2`}
              sizes="20vw"
              padding="p-4"
              className="rounded-2xl bg-[#e7e7e3]"
              onTap={() => setLightboxIndex(1)}
            />
            <ZoomCell
              src={cleaned[2]}
              alt={`${title} 3`}
              sizes="20vw"
              padding="p-4"
              className="rounded-2xl bg-[#e7e7e3]"
              onTap={() => setLightboxIndex(2)}
            />
          </div>
        )}

        {cleaned.length >= 4 && (
          <div className="grid grid-cols-2 gap-2">
            {cleaned.slice(0, 4).map((src, i) => (
              <ZoomCell
                key={i}
                src={src}
                alt={`${title} ${i + 1}`}
                sizes="25vw"
                padding="p-4"
                className={`rounded-2xl bg-[#e7e7e3] aspect-square ${i === 3 && extraCount > 0 ? '[&_img]:brightness-50' : ''}`}
                onTap={() => setLightboxIndex(i)}
                overlayContent={
                  i === 3 && extraCount > 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className="text-white text-3xl font-bold tracking-tight drop-shadow-lg">
                        +{extraCount}
                      </span>
                    </div>
                  ) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── MOBILE: main image (tap → lightbox) + thumbnail strip ─── */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Main active image — tap opens lightbox */}
        <button
          className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] aspect-square w-full block"
          onClick={() => setLightboxIndex(activeIndex)}
          aria-label="Open image viewer"
        >
          <Image
            key={cleaned[activeIndex]}
            src={cleaned[activeIndex]}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-contain p-6 transition-opacity duration-300"
          />
          {/* Tap-to-zoom hint icon */}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </div>
          {/* Dot indicators */}
          {cleaned.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              {cleaned.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIndex ? 'w-4 h-1.5 bg-gray-700' : 'w-1.5 h-1.5 bg-gray-400/70'
                  }`}
                />
              ))}
            </div>
          )}
        </button>

        {/* Thumbnail strip (show up to 4) */}
        {cleaned.length > 1 && (
          <div className={`grid gap-2 ${cleaned.length >= 4 ? 'grid-cols-4' : `grid-cols-${cleaned.length}`}`}>
            {cleaned.slice(0, 4).map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-xl overflow-hidden aspect-square bg-[#e7e7e3] border-2 transition-all duration-150 ${
                  activeIndex === i
                    ? 'border-[#4B5BFF] shadow-md'
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={src} alt={`${title} view ${i + 1}`} fill sizes="80px" className="object-contain p-1.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Lightbox (shared desktop + mobile) ─── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={cleaned}
          title={title}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
