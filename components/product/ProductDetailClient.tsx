'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProductById,
  clearSelectedProduct,
} from '@/store/slices/productsSlice';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ColorSelector } from '@/components/product/ColorSelector';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductDescription } from '@/components/product/ProductDescription';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Newsletter } from '@/components/common/Newsletter';
import { getVariantConfig } from '@/lib/variants';

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-gray-200 w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-4 pt-2">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-10 w-32 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="space-y-2 pt-4">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-12 w-full rounded-xl bg-gray-200" />
            <div className="h-12 w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductDetailClientProps {
  id: number;
}

export function ProductDetailClient({ id }: ProductDetailClientProps) {
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading, error } = useAppSelector((s) => s.products);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // Track previous id so we can reset selections during render when it changes
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setSelectedColor(null);
    setSelectedSize(null);
  }

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  if (loading || (!product && !error)) {
    return (
      <main>
        <ProductDetailSkeleton />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center gap-4 text-center">
          <p className="text-gray-500 text-base">
            {error ?? 'Product not found.'}
          </p>
          <button
            onClick={() => dispatch(fetchProductById(id))}
            className="bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-[#3a47e0] transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#e7e7e3] border-b border-gray-100 px-4 sm:px-6 py-3"
      >
        <ol className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <li>
            <Link href="/" className="hover:text-[#111] transition-colors font-medium">
              Home
            </Link>
          </li>
          <li aria-hidden className="select-none">/</li>
          <li>
            <Link
              href={`/products?category=${product.category.id}`}
              className="hover:text-[#111] transition-colors font-medium capitalize"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden className="select-none">/</li>
          <li className="text-[#111] font-semibold truncate max-w-50 sm:max-w-xs">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* ── Product layout ── */}
      <section className="bg-[#e7e7e3] px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left — gallery */}
            <div className="lg:sticky lg:top-28">
              <ProductGallery images={product.images} title={product.title} />
            </div>

            {/* Right — info + configuration */}
            <div className="space-y-6">
              <ProductInfo product={product} />

              {/* Variant selectors — driven by title keywords + category slug */}
              {(() => {
                const { needsColor, needsSize, sizeType } = getVariantConfig(
                  product.category.slug,
                  product.title,
                );
                const hasVariants = needsColor || needsSize;
                return (
                  <>
                    {hasVariants && <div className="w-full h-px bg-gray-100" />}

                    {needsColor && (
                      <ColorSelector
                        selected={selectedColor}
                        onChange={setSelectedColor}
                      />
                    )}

                    {needsSize && sizeType && (
                      <SizeSelector
                        sizeType={sizeType}
                        selected={selectedSize}
                        onChange={setSelectedSize}
                      />
                    )}

                    <div className="w-full h-px bg-gray-100" />

                    <ProductActions
                      product={product}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      needsColor={needsColor}
                      needsSize={needsSize}
                    />
                  </>
                );
              })()}

              <ProductDescription description={product.description} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      <RelatedProducts
        categoryId={product.category.id}
        excludeId={product.id}
      />

      {/* ── Newsletter ── */}
      <Newsletter />
    </main>
  );
}
