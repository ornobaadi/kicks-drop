import type { Product } from '@/types/product';
import apiClient from './client';

export const productsAPI = {
  /** Fetch a page of products with optional limit/offset */
  getAll: (limit = 20, offset = 0) =>
    apiClient.get<Product[]>('/products', { params: { limit, offset } }),

  /** Fetch ALL products in one shot (API max is ~100; adjust if needed) */
  getAll100: () =>
    apiClient.get<Product[]>('/products', { params: { limit: 100, offset: 0 } }),

  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`),

  getByCategory: (categoryId: number, limit = 50) =>
    apiClient.get<Product[]>('/products', {
      params: { categoryId, limit },
    }),

  /** Full-text title search */
  search: (title: string, limit = 100) =>
    apiClient.get<Product[]>('/products', {
      params: { title, limit },
    }),
};
