import Link from 'next/link';
import { KicksLogo } from '@/components/common/KicksLogo';
import { categoriesAPI } from '@/lib/api/categories';
import type { Category } from '@/types/category';

const COMPANY = ['About', 'Contact', 'Blogs'];

const SOCIAL = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://x.com',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" />
      </svg>
    ),
  },
];

export async function Footer() {
  let categories: Category[] = [];
  try {
    const res = await categoriesAPI.getAll();
    categories = res?.data ?? [];
  } catch (err) {
    // fallback to empty; server console log for debugging
    console.error('Failed to load categories for footer', err);
    categories = [];
  }

  return (
    <footer className="text-white -mt-8 relative z-10">
      {/* Dark rounded card — overlaps the newsletter blue card from below */}
      <div className="px-4 sm:px-6 pt-0">
        <div className="max-w-7xl mx-auto bg-[#111111] rounded-3xl overflow-hidden">
          {/* Main columns */}
          <div className="px-6 sm:px-10 pt-10 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div>
              <h3 className="text-amber-400 font-bold text-base mb-3">About us</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We are the biggest hyperstore in the universe. We got you all cover with our exclusive collections and latest drops.
              </p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-amber-400 font-bold text-base mb-3">Categories</h3>
              <ul className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.slug)}`}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-amber-400 font-bold text-base mb-3">Company</h3>
              <ul className="flex flex-col gap-2">
                {COMPANY.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow us */}
            <div>
              <h3 className="text-amber-400 font-bold text-base mb-3">Follow us</h3>
              <div className="flex items-center gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Giant KICKS — full-width, only top half visible */}
          <div
            className="overflow-hidden select-none text-center w-full flex items-start justify-center"
            style={{ height: 'clamp(7rem, 20vw, 16rem)' }}
          >
            <KicksLogo
              asLink={false}
              fontSize="clamp(14rem, 24vw, 30rem)"
              color="text-white"
              strokeColor="#111111"
            />
          </div>
        </div>
      </div>

      {/* Copyright — on the #e7e7e3 background */}
      <div className="py-5 text-center">
        <p className="text-gray-500 text-xs">© All rights reserved</p>
      </div>
    </footer>
  );
}
