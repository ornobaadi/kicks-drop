import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | KICKS',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="bg-[#e7e7e3] min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Giant 404 */}
        <div className="relative select-none mb-6">
          <span
            className="font-black text-[#111] leading-none block"
            style={{ fontSize: 'clamp(7rem, 25vw, 14rem)', letterSpacing: '-0.04em' }}
          >
            4
            <span className="text-[#4B5BFF]">0</span>
            4
          </span>
          {/* Floating question mark */}
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-8xl pointer-events-none opacity-20"
            aria-hidden
          >
            ?
          </span>
        </div>

        {/* Copy */}
        <h1 className="font-black uppercase text-[#111] text-2xl sm:text-3xl mb-3 leading-tight tracking-tight">
          Lost your way?
        </h1>
        <p
          className="text-gray-500 text-base mb-8 max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          The page you&apos;re looking for has left the building — or maybe it never existed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#3a47e0] transition-colors duration-200 w-full sm:w-auto text-center"
          >
            Back to Home
          </Link>
          <Link
            href="/#new-drops"
            className="inline-block bg-[#111] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#333] transition-colors duration-200 w-full sm:w-auto text-center"
          >
            Shop New Drops
          </Link>
        </div>
      </div>
    </main>
  );
}
