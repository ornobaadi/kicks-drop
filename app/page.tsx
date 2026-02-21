import { HeroSection } from '@/components/home/HeroSection';
import { NewDrops } from '@/components/home/NewDrops';
import { Categories } from '@/components/home/Categories';
import { Reviews } from '@/components/home/Reviews';
import { Newsletter } from '@/components/common/Newsletter';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

async function getInitialHomeData() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const [productsRes, categoriesRes] = await Promise.allSettled([
      fetch(`${base}/products?limit=20`, { next: { revalidate: 60 } }),
      fetch(`${base}/categories`, { next: { revalidate: 60 } }),
    ]);
    const products =
      productsRes.status === 'fulfilled' && productsRes.value.ok
        ? ((await productsRes.value.json()) as Product[])
        : [];
    const categories =
      categoriesRes.status === 'fulfilled' && categoriesRes.value.ok
        ? ((await categoriesRes.value.json()) as Category[])
        : [];
    return { products, categories };
  } catch {
    return { products: [] as Product[], categories: [] as Category[] };
  }
}

export default async function HomePage() {
  const { products, categories } = await getInitialHomeData();

  return (
    <main>
      <HeroSection initialProducts={products} />
      <NewDrops initialProducts={products} />
      <Categories initialCategories={categories} />
      <Reviews />
      <Newsletter />
    </main>
  );
}