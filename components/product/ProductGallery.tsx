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
  const activeImage = cleaned[activeIndex] ?? null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#f4f3f0] aspect-square w-full">
        {activeImage ? (
          <Image
            key={activeImage}
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6 transition-opacity duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9l6 6M15 9l-6 6" />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails grid */}
      {cleaned.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {cleaned.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative rounded-xl overflow-hidden aspect-square bg-[#f4f3f0] border-2 transition-all duration-150 ${
                activeIndex === i
                  ? 'border-[#4B5BFF] shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} view ${i + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
