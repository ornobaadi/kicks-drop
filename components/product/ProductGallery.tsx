'use client';

import { useState } from 'react';
import Image from 'next/image';

function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const cleaned = images.map(cleanImageUrl).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const extraCount = cleaned.length - 4; // positive when > 4

  return (
    <>
      {/* ─── DESKTOP: image grid ─── */}
      <div className="hidden md:block">
        {cleaned.length === 1 && (
          /* Single image — full square */
          <div className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] aspect-square w-full">
            <Image src={cleaned[0]} alt={title} fill priority sizes="50vw" className="object-contain p-8" />
          </div>
        )}

        {cleaned.length === 2 && (
          /* Two images — side by side */
          <div className="grid grid-cols-2 gap-2">
            {cleaned.map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] aspect-square">
                <Image src={src} alt={`${title} ${i + 1}`} fill sizes="25vw" className="object-contain p-5" />
              </div>
            ))}
          </div>
        )}

        {cleaned.length === 3 && (
          /*
           * Three images — hero on the left spanning full height,
           * two smaller cells stacked on the right.
           * Container uses a 1:1 aspect ratio so each small cell
           * ends up roughly square.
           */
          <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{ aspectRatio: '1' }}>
            {/* Left: tall hero */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] row-span-2">
              <Image src={cleaned[0]} alt={`${title} 1`} fill priority sizes="25vw" className="object-contain p-6" />
            </div>
            {/* Right top */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e7e7e3]">
              <Image src={cleaned[1]} alt={`${title} 2`} fill sizes="20vw" className="object-contain p-4" />
            </div>
            {/* Right bottom */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e7e7e3]">
              <Image src={cleaned[2]} alt={`${title} 3`} fill sizes="20vw" className="object-contain p-4" />
            </div>
          </div>
        )}

        {cleaned.length >= 4 && (
          /* 2×2 grid. If there are more than 4 images the 4th cell
             shows a "+N" overlay so users know to open a lightbox/etc. */
          <div className="grid grid-cols-2 gap-2">
            {cleaned.slice(0, 4).map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] aspect-square">
                <Image src={src} alt={`${title} ${i + 1}`} fill sizes="25vw"
                  className={`object-contain p-4 ${i === 3 && extraCount > 0 ? 'brightness-50' : ''}`}
                />
                {i === 3 && extraCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-3xl font-bold tracking-tight drop-shadow-lg">
                      +{extraCount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── MOBILE: main image + thumbnail strip ─── */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Main/active image */}
        <div className="relative rounded-2xl overflow-hidden bg-[#e7e7e3] aspect-square w-full">
          <Image
            key={cleaned[activeIndex]}
            src={cleaned[activeIndex]}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-contain p-6 transition-opacity duration-300"
          />
          {/* Dot indicators */}
          {cleaned.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {cleaned.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? 'w-4 h-1.5 bg-gray-700'
                      : 'w-1.5 h-1.5 bg-gray-400/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

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
    </>
  );
}
