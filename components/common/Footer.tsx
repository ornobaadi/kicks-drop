import Link from 'next/link';
import { KicksLogo } from '@/components/common/KicksLogo';

const CATEGORIES = ['Runners', 'Sneakers', 'Basketball', 'Outdoor', 'Golf', 'Hiking'];
const COMPANY = ['About', 'Contact', 'Blogs'];

const SOCIAL = [
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
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
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/categories/${cat.toLowerCase()}`}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  {cat}
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Giant KICKS watermark */}
      <div className="overflow-hidden select-none text-center py-2">
        <KicksLogo
          asLink={false}
          fontSize="clamp(5rem, 20vw, 14rem)"
          color="text-white"
          opacity={0.1}
        />
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-4 text-center">
        <p className="text-gray-600 text-xs">© All rights reserved</p>
      </div>
    </footer>
  );
}
