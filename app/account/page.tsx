import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | KICKS',
  description: 'Sign in to your KICKS account.',
};

export default function AccountPage() {
  return (
    <main className="bg-[#e7e7e3] min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full mx-auto text-center">

        {/* Icon lockup */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            {/* Coming soon badge */}
            <span className="absolute -top-1 -right-1 bg-[#4B5BFF] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full leading-none flex items-center h-5">
              Soon
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-black uppercase text-[#111] text-3xl sm:text-4xl tracking-tight leading-none mb-3">
          Members area
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto mb-8">
          Sign-in and account management is on its way. Drop your email and we&apos;ll let you know when it&apos;s live.
        </p>

        {/* Email capture — visual only */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-left">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Notify me
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              readOnly
              className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#111] placeholder:text-gray-400 bg-gray-50 cursor-not-allowed focus:outline-none"
            />
            <button
              disabled
              className="h-11 px-5 rounded-xl bg-[#111] text-white text-xs font-bold uppercase tracking-wider opacity-40 cursor-not-allowed shrink-0"
            >
              Notify me
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Coming soon — we&apos;ll only email you once.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 inline-block text-center bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#3a47e0] transition-colors"
          >
            Shop New Drops
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto flex-1 inline-block text-center bg-white text-[#111] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Cart
          </Link>
        </div>

      </div>
    </main>
  );
}
