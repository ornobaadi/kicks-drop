export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
}

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  relatedProducts: Product[];
  loading: boolean;
  error: string | null;
}
