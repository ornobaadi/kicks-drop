import { HeroSection } from '@/components/home/HeroSection';
import { NewDrops } from '@/components/home/NewDrops';
import { Categories } from '@/components/home/Categories';
import { Reviews } from '@/components/home/Reviews';
import { Newsletter } from '@/components/common/Newsletter';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <NewDrops />
      <Categories />
      <Reviews />
      <Newsletter />
    </main>
  );
}