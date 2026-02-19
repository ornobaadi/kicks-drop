import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

/** Cleans API image URLs — strips wrapping brackets/quotes from Platzi API */
function cleanImageUrl(raw: string): string {
  return raw.replace(/[\[\]"]/g, '').split(',')[0].trim();
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] ? cleanImageUrl(product.images[0]) : null;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow duration-200 hover:shadow-md">
        {/* New badge */}
        <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
          New
        </span>

        {/* Product image */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
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

        {/* Name */}
        <div className="px-3 pt-3 pb-1">
          <p className="font-bold text-xs uppercase tracking-wide text-gray-900 line-clamp-2 leading-tight">
            {product.title}
          </p>
        </div>

        {/* CTA button */}
        <div className="px-3 pb-3 pt-2">
          <div className="flex items-center justify-between bg-black text-white rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider group-hover:bg-gray-800 transition-colors duration-200">
            <span>View Product</span>
            <span className="text-blue-400">{formattedPrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
