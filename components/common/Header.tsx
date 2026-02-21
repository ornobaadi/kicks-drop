'use client';

import Link from 'next/link';
import { useState } from 'react';
import { KicksLogo } from '@/components/common/KicksLogo';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { useAppSelector } from '@/store/hooks';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  User02Icon,
  ShoppingCart01Icon,
  Menu01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';

const NAV_LINKS = [
  { label: 'New Drops', href: '/#new-drops', fire: true },
  { label: 'Men', href: '/men', dropdown: true },
  { label: 'Women', href: '/women', dropdown: true },
];

export function Header() {
  const cartCount = useAppSelector(selectCartItemCount);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-4 pb-2 pointer-events-none">
      <div className="pointer-events-auto">
      {/* Floaty pill card — wraps BOTH the bar and the mobile dropdown */}
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100">

        {/* ── Main bar ── */}
        <div className="px-5 sm:px-8 h-15 flex items-center justify-between gap-4 relative">

          {/* Left: nav links (desktop) / hamburger (mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-black transition-colors"
              >
                {link.fire && <span>🔥</span>}
                {link.label}
                {link.dropdown && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-0.5 opacity-50">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} size={22} color="#111" />
          </button>

          {/* Logo — absolute center on both mobile and desktop */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <KicksLogo size="text-[22px]" />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 ml-auto">
            {/* Desktop live search */}
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

        {/* ── Mobile dropdown — inside the pill card ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 px-5 py-5 flex flex-col gap-1 rounded-b-2xl overflow-hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50 hover:text-black transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.fire && <span>🔥</span>}
                {link.label}
              </Link>
            ))}
            {/* Search row on mobile */}
            <GlobalSearch variant="mobile" onNavigate={() => setMobileOpen(false)} />
          </div>
        )}

      </div>
    </div>
    </header>
  );
}
