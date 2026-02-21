import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

/** Cleans API image URLs — strips wrapping brackets/quotes from Platzi API */
function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

export function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const imageUrl = product.images?.[0] ? cleanImageUrl(product.images[0]) : null;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* Image card */}
      <div className="relative bg-[#e7e7e3] rounded-3xl ring-4 ring-white overflow-hidden mb-4">
        {/* New badge — only shown when explicitly flagged */}
        {showNewBadge && (
          <span className="absolute top-3 left-3 z-10 bg-[#4B5BFF] text-white text-sm font-bold px-4 py-1.5 rounded-xl">
            New
          </span>
        )}

        {/* Product image */}
        <div className="relative w-full aspect-5/6 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="m9 9 6 6M15 9l-6 6" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-bold text-base sm:text-lg uppercase tracking-wide text-[#111] line-clamp-2 leading-tight mb-3 px-1">
        {product.title}
      </h3>

      {/* CTA button */}
      <div className="flex items-center justify-center gap-1.5 bg-[#111] text-white rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-widest group-hover:bg-[#222] transition-colors duration-200">
        <span>View Product</span>
        <span className="text-white/40">-</span>
        <span className="text-[#FF8C00]">{formattedPrice}</span>
      </div>
    </Link>
  );
}
