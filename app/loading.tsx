import { ProductGridSkeleton } from '@/components/common/Skeletons';

/**
 * Next.js App Router loading.tsx — shown while the home page shell loads.
 * This is the streamed fallback before any client components hydrate.
 */
export default function HomeLoading() {
  return (
    <main className="bg-[#e7e7e3]">
      {/* Hero skeleton */}
      <div className="px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse h-10 w-64 rounded-lg bg-gray-200 mb-6" />
          <div className="animate-pulse rounded-2xl bg-gray-200 min-h-120" />
        </div>
      </div>

      {/* New Drops skeleton */}
      <div className="px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div className="animate-pulse h-10 w-56 rounded-lg bg-gray-200" />
            <div className="animate-pulse h-9 w-32 rounded-lg bg-gray-200" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    </main>
  );
}
