import type { Product } from './product';

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
  /** Unique key: `${productId}-${color}-${size}` */
  key: string;
}

export interface CartState {
  items: CartItem[];
}
