export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  relatedProducts: Product[];
  loading: boolean;
  relatedLoading: boolean;
  error: string | null;
}
