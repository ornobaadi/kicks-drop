import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productsAPI, type ProductFilterParams } from '@/lib/api/products';
import type { Product, ProductsState } from '@/types/product';

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  relatedProducts: [],
  catalogItems: [],
  loading: false,
  relatedLoading: false,
  catalogLoading: false,
  error: null,
  catalogError: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const res = await productsAPI.getAll(limit);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/** Fetches ALL products for the catalog page (up to 100) */
export const fetchCatalogProducts = createAsyncThunk(
  'products/fetchCatalog',
  async (_, { rejectWithValue }) => {
    try {
      const res = await productsAPI.getAll100();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/** Fetches products filtered by category for the catalog page */
export const fetchCatalogByCategory = createAsyncThunk(
  'products/fetchCatalogByCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const res = await productsAPI.getByCategory(categoryId, 50);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/** Single thunk for the catalog page — passes all active filters to the API */
export const fetchCatalogFiltered = createAsyncThunk(
  'products/fetchCatalogFiltered',
  async (params: ProductFilterParams, { rejectWithValue }) => {
    try {
      const res = await productsAPI.getFiltered(params);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await productsAPI.getById(id);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (
    { categoryId, limit = 8 }: { categoryId: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await productsAPI.getByCategory(categoryId, limit);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearCatalog(state) {
      state.catalogItems = [];
      state.catalogError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as Product[];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchCatalogProducts (all 100)
    builder
      .addCase(fetchCatalogProducts.pending, (state) => {
        state.catalogLoading = true;
        state.catalogError = null;
      })
      .addCase(fetchCatalogProducts.fulfilled, (state, action) => {
        state.catalogLoading = false;
        state.catalogItems = action.payload as Product[];
      })
      .addCase(fetchCatalogProducts.rejected, (state, action) => {
        state.catalogLoading = false;
        state.catalogError = action.payload as string;
      });

    // fetchCatalogByCategory
    builder
      .addCase(fetchCatalogByCategory.pending, (state) => {
        state.catalogLoading = true;
        state.catalogError = null;
      })
      .addCase(fetchCatalogByCategory.fulfilled, (state, action) => {
        state.catalogLoading = false;
        state.catalogItems = action.payload as Product[];
      })
      .addCase(fetchCatalogByCategory.rejected, (state, action) => {
        state.catalogLoading = false;
        state.catalogError = action.payload as string;
      });

    // fetchCatalogFiltered (unified — used by the catalog page)
    builder
      .addCase(fetchCatalogFiltered.pending, (state) => {
        state.catalogLoading = true;
        state.catalogError = null;
      })
      .addCase(fetchCatalogFiltered.fulfilled, (state, action) => {
        state.catalogLoading = false;
        state.catalogItems = action.payload as Product[];
      })
      .addCase(fetchCatalogFiltered.rejected, (state, action) => {
        state.catalogLoading = false;
        state.catalogError = action.payload as string;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload as Product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProductsByCategory
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.relatedLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.relatedProducts = action.payload as Product[];
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.relatedLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct, clearCatalog } = productsSlice.actions;
export default productsSlice.reducer;
