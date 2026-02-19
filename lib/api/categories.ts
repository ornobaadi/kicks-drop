import type { Category } from '@/types/category';
import apiClient from './client';

export const categoriesAPI = {
  getAll: () => apiClient.get<Category[]>('/categories'),
};
