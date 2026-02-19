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
    <section className="px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto bg-blue-600 rounded-2xl overflow-hidden">
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
                className="flex-1 min-w-0 bg-white/15 border border-white/30 text-white placeholder-blue-200 rounded-md px-4 py-2.5 text-sm outline-none focus:border-white focus:bg-white/25 transition-all"
              />
              <button
                type="submit"
                className="bg-white text-blue-700 font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap"
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

          {/* Right — KICKS logo watermark */}
          <div className="flex-shrink-0 select-none relative">
            <KicksLogo
              asLink={false}
              fontSize="clamp(3.5rem, 10vw, 6rem)"
              color="text-white"
              opacity={0.25}
            />
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-400 translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
