export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}
