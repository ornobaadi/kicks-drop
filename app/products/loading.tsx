import { SectionSkeleton } from '@/components/common/Skeletons';

/**
 * Next.js App Router loading.tsx — shown while the products page streams.
 */
export default function ProductsLoading() {
  return <SectionSkeleton count={12} />;
}
