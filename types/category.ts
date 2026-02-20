export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}
