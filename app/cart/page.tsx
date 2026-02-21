import type { Metadata } from 'next';
import { CartClient } from '@/components/cart/CartClient';

export const metadata: Metadata = {
  title: 'Your Cart | KICKS',
  description: 'Review your selected items and proceed to checkout.',
};

export default function CartPage() {
  return (
    <main className="bg-[#e7e7e3] min-h-[70vh]">
      <CartClient />
    </main>
  );
}
