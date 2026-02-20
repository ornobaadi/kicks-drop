import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductsClient } from '@/components/products/ProductsClient';
import { SectionSkeleton } from '@/components/common/Skeletons';

export const metadata: Metadata = {
  title: 'All Products | KICKS DROP',
  description: 'Browse our full collection across clothing, electronics, furniture, accessories and more at Kicks Drop.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<SectionSkeleton />}>
      <ProductsClient />
    </Suspense>
  );
}
