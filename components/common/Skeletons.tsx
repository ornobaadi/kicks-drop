import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

function Pulse({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)} style={style} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      {/* Image area */}
      <div className="relative bg-gray-100 rounded-3xl ring-4 ring-white overflow-hidden mb-4">
        <Pulse className="w-full aspect-5/6 rounded-none" />
      </div>
      {/* Title */}
      <div className="px-1 space-y-2 mb-3">
        <Pulse className="h-4 w-3/4" />
        <Pulse className="h-4 w-1/2" />
      </div>
      {/* CTA button */}
      <Pulse className="h-13 w-full rounded-2xl" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/10 min-h-90">
      <Pulse className="w-full h-full rounded-none bg-white/20 min-h-90" />
    </div>
  );
}

export function SectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="min-h-screen bg-[#e7e7e3]">
      {/* Page header */}
      <div className="bg-[#111] px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-3">
          <Pulse className="h-10 w-48 bg-white/10" />
          <Pulse className="h-4 w-24 bg-white/10" />
        </div>
      </div>
      {/* Filters bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Pulse className="h-10 w-56 rounded-lg" />
          <Pulse className="h-10 w-24 rounded-lg" />
          <Pulse className="h-10 w-24 rounded-lg" />
          <Pulse className="h-10 w-24 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
          {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductDetailPageSkeleton() {
  return (
    <main className="bg-[#e7e7e3]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Pulse className="h-3 w-10" />
          <Pulse className="h-3 w-2" />
          <Pulse className="h-3 w-16" />
          <Pulse className="h-3 w-2" />
          <Pulse className="h-3 w-32" />
        </div>
      </div>
      {/* Product layout */}
      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Gallery */}
            <div className="space-y-3">
              <Pulse className="aspect-square rounded-2xl w-full" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Pulse key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
            {/* Info */}
            <div className="space-y-4 pt-2">
              <Pulse className="h-5 w-24 rounded-md" />
              <Pulse className="h-8 w-3/4 rounded-md" />
              <Pulse className="h-8 w-1/2 rounded-md" />
              <Pulse className="h-10 w-32 rounded-md" />
              <Pulse className="h-4 w-36 rounded-md" />
              <div className="space-y-2 pt-4">
                <Pulse className="h-3 w-16 rounded" />
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Pulse key={i} className="w-9 h-9 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Pulse className="h-3 w-16 rounded" />
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Pulse key={i} className="h-10 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <Pulse className="h-12 w-full rounded-xl" />
                <Pulse className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <Pulse className="h-9 w-36" />
        <Pulse className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 divide-y-0 space-y-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
              <Pulse className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Pulse className="h-4 w-3/4" />
                <Pulse className="h-3 w-1/2" />
                <Pulse className="h-3 w-1/3" />
                <div className="flex items-center justify-between mt-3">
                  <Pulse className="h-8 w-24 rounded-lg" />
                  <Pulse className="h-5 w-14" />
                  <Pulse className="h-7 w-7 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Pulse className="h-6 w-32" />
          <Pulse className="h-14 w-full rounded-xl" />
          <div className="space-y-3 pt-2">
            <div className="flex justify-between gap-4">
              <Pulse className="h-4 w-24" />
              <Pulse className="h-4 w-16" />
            </div>
            <div className="flex justify-between gap-4">
              <Pulse className="h-4 w-20" />
              <Pulse className="h-4 w-12" />
            </div>
            <Pulse className="h-px w-full" />
            <div className="flex justify-between gap-4">
              <Pulse className="h-5 w-16" />
              <Pulse className="h-5 w-20" />
            </div>
          </div>
          <Pulse className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
