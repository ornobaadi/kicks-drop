'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { KicksLogo } from '@/components/common/KicksLogo';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  User02Icon,
  ShoppingCart01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import type { Category } from '@/types/category';

/* ── Category dropdown card ── */
function CategoryCard({ category }: { category: Category }) {
  return (
    <NavigationMenuLink
      href={`/products?category=${category.id}`}
      render={<Link href={`/products?category=${category.id}`} prefetch={false} />}
      className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#e7e7e3] transition-colors duration-150 group outline-none"
    >
      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#e7e7e3] shrink-0 border border-black/5">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="44px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
            {category.name[0]}
          </div>
        )}
      </div>
      <span className="text-sm font-semibold text-[#111] capitalize leading-tight">
        {category.name}
      </span>
    </NavigationMenuLink>
  );
}

/* ── Mobile expandable Men / Women section ── */
function MobileCategorySection({
  label,
  categories,
  onNavigate,
}: {
  label: string;
  categories: Category[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-1 ml-2 grid grid-cols-2 gap-1.5 pb-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              onClick={onNavigate}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <div className="relative w-8 h-8 rounded-md overflow-hidden bg-[#e7e7e3] shrink-0 border border-black/5">
                {cat.image && (
                  <Image src={cat.image} alt={cat.name} fill sizes="32px" className="object-cover" />
                )}
              </div>
              <span className="capitalize truncate">{cat.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const cartCount = useAppSelector(selectCartItemCount);
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-4 pb-2 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Floaty pill card */}
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100">

          {/* ── Main bar ── */}
          <div className="px-5 sm:px-8 h-15 flex items-center justify-between gap-4 relative">

            {/* Left: NavigationMenu (desktop) / hamburger (mobile) */}
            <div className="hidden md:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-0">

                  {/* New Drops — simple link */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/#new-drops"
                      render={<Link href="/#new-drops" />}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      <span>🔥</span> New Drops
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Men */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 hover:text-black h-auto data-open:bg-gray-50">
                      Men
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2 min-w-[320px]">
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((cat) => (
                          <CategoryCard key={cat.id} category={cat} />
                        ))}
                        {categories.length === 0 && (
                          <div className="col-span-2 py-4 text-center text-sm text-gray-400">Loading…</div>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <NavigationMenuLink
                          href="/products"
                          render={<Link href="/products" />}
                          className="block text-center text-xs font-bold uppercase tracking-widest text-[#4B5BFF] hover:text-[#3a47e0] py-1.5 transition-colors"
                        >
                          View all products →
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Women — same categories, all unisex */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 hover:text-black h-auto data-open:bg-gray-50">
                      Women
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2 min-w-[320px]">
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((cat) => (
                          <CategoryCard key={cat.id} category={cat} />
                        ))}
                        {categories.length === 0 && (
                          <div className="col-span-2 py-4 text-center text-sm text-gray-400">Loading…</div>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <NavigationMenuLink
                          href="/products"
                          render={<Link href="/products" />}
                          className="block text-center text-xs font-bold uppercase tracking-widest text-[#4B5BFF] hover:text-[#3a47e0] py-1.5 transition-colors"
                        >
                          View all products →
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} size={22} color="#111" />
            </button>

            {/* Logo — absolute center */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <KicksLogo size="text-[22px]" />
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 ml-auto">
              <div className="hidden md:block">
                <GlobalSearch variant="desktop" />
              </div>
              <Link href="/account" aria-label="Account" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <HugeiconsIcon icon={User02Icon} size={20} color="#111" />
              </Link>
              <Link href="/cart" aria-label="Cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={20} color="#111" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ── Mobile dropdown ── */}
          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 px-5 py-5 flex flex-col gap-1 rounded-b-2xl overflow-hidden">
              <Link
                href="/#new-drops"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50 hover:text-black transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <span>🔥</span> New Drops
              </Link>
              <MobileCategorySection
                label="Men"
                categories={categories}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileCategorySection
                label="Women"
                categories={categories}
                onNavigate={() => setMobileOpen(false)}
              />
              <GlobalSearch variant="mobile" onNavigate={() => setMobileOpen(false)} />
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
