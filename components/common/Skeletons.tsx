import { cn } from '@/lib/utils';

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
      {/* image */}
      <Pulse className="w-full aspect-square rounded-none" />
      {/* title */}
      <div className="px-3 pt-3 pb-1 space-y-1.5">
        <Pulse className="h-3 w-3/4" />
        <Pulse className="h-3 w-1/2" />
      </div>
      {/* button */}
      <div className="px-3 pb-3 pt-2">
        <Pulse className="h-8 w-full rounded-md" />
      </div>
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
    <div className="rounded-xl overflow-hidden bg-white/10">
      <Pulse className="w-full aspect-[4/3] rounded-none bg-white/20" />
      <div className="p-4 space-y-2">
        <Pulse className="h-4 w-1/2 bg-white/20" />
        <Pulse className="h-3 w-1/3 bg-white/20" />
      </div>
    </div>
  );
}

export function SectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-6 py-12 px-4 max-w-7xl mx-auto">
      <Pulse className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
