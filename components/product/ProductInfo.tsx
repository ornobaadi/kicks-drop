import type { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(product.price);

  return (
    <div>
      {/* New Release badge */}
      <span className="inline-block bg-[#4B5BFF] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-3">
        New Release
      </span>

      {/* Product name */}
      <h1 className="font-black uppercase text-[#111] leading-tight tracking-tight mb-4"
        style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
        {product.title}
      </h1>

      {/* Price */}
      <p className="text-[#4B5BFF] font-black text-3xl mb-1">{formattedPrice}</p>
      <p className="text-gray-400 text-xs mb-6">Free shipping &amp; returns</p>

      {/* Category */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span className="uppercase tracking-wider font-semibold">Category</span>
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
          {product.category.name}
        </span>
      </div>
    </div>
  );
}
