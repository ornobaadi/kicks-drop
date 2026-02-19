'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrateCart } from './slices/cartSlice';
import type { CartItem } from '@/types/cart';

function CartHydrator() {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const saved = localStorage.getItem('kicks-cart');
      if (saved) {
        const items: CartItem[] = JSON.parse(saved);
        store.dispatch(hydrateCart(items));
      }
    } catch {
      // ignore malformed localStorage data
    }

    // Persist cart to localStorage on every state change
    store.subscribe(() => {
      const { cart } = store.getState();
      localStorage.setItem('kicks-cart', JSON.stringify(cart.items));
    });
  }, []);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator />
      {children}
    </Provider>
  );
}
