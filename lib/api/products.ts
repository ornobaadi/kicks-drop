import type { Product } from '@/types/product';
import apiClient from './client';

export const productsAPI = {
  getAll: (limit = 20, offset = 0) =>
    apiClient.get<Product[]>('/products', { params: { limit, offset } }),

  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`),

  getByCategory: (categoryId: number, limit = 8) =>
    apiClient.get<Product[]>('/products', {
      params: { categoryId, limit },
    }),
};
