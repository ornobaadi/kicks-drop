import { CartSkeleton } from '@/components/common/Skeletons';

/**
 * Next.js App Router loading.tsx — shown while the cart page streams.
 */
export default function CartLoading() {
  return (
    <main className="bg-[#e7e7e3] min-h-[70vh]">
      <CartSkeleton />
    </main>
  );
}
