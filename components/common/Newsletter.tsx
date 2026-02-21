'use client';

import { useState } from 'react';
import { KicksLogo } from '@/components/common/KicksLogo';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
  }

  return (
    <section className="px-4 sm:px-6 pt-8 pb-4">
      <div className="max-w-7xl mx-auto bg-[#4B5BFF] rounded-t-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between px-8 sm:px-12 py-10 gap-8">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-black text-3xl sm:text-4xl leading-tight uppercase mb-1">
              JOIN OUR KICKSPLUS<br />
              CLUB &amp; GET 15% OFF
            </h2>
            <p className="text-blue-200 text-sm mt-2 mb-6">
              Sign up for free! Join the community.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus('idle');
                }}
                placeholder="Email address"
                className="flex-1 min-w-0 bg-transparent border border-white/50 text-white placeholder-white/60 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white transition-all"
              />
              <button
                type="submit"
                className="bg-[#111] text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Submit
              </button>
            </form>

            {status === 'success' && (
              <p className="text-green-300 text-sm mt-3 font-medium">
                🎉 You&apos;re in! Check your inbox for your 15% off code.
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-300 text-sm mt-3">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* Right — KICKS logo */}
          <div className="shrink-0 select-none relative">
            <KicksLogo
              asLink={false}
              fontSize="clamp(4rem, 11vw, 7rem)"
              color="text-white"
            />
            <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-orange-400 translate-x-1/3 -translate-y-1/3 flex items-center justify-center text-white font-black text-sm leading-none">
              +
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
