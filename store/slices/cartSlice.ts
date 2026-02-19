import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '@/types/cart';
import type { Product } from '@/types/product';
import type { RootState } from '../store';

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ product: Product; color: string; size: number; quantity?: number }>
    ) {
      const { product, color, size, quantity = 1 } = action.payload;
      const key = `${product.id}-${color}-${size}`;
      const existing = state.items.find((item) => item.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, color, size, quantity, key });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.key !== action.payload);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.key === action.payload.key);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
    /** Hydrate cart from localStorage on app mount */
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, hydrateCart } =
  cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);
