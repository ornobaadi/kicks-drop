import type { Product } from '@/types/product';
import apiClient from './client';

export interface ProductFilterParams {
  title?: string;
  categoryId?: number;
  price_min?: number;
  price_max?: number;
  limit?: number;
  offset?: number;
}

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

  /** Server-side filtered fetch: title, categoryId, price_min, price_max */
  getFiltered: (params: ProductFilterParams) => {
    const clean: Record<string, unknown> = { limit: params.limit ?? 100 };
    if (params.offset)            clean.offset     = params.offset;
    if (params.title?.trim())     clean.title      = params.title.trim();
    if (params.categoryId)        clean.categoryId = params.categoryId;
    if (params.price_min != null) clean.price_min  = params.price_min;
    if (params.price_max != null) clean.price_max  = params.price_max;
    return apiClient.get<Product[]>('/products', { params: clean });
  },
};
