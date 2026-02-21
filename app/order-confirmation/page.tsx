'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

// ── Confetti fireworks ──────────────────────────────────────────────────────
function fireConfetti() {
  const duration = 4500;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 70, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = window.setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

// ── Stable order ID (client-only, generated once) ──────────────────────────
function makeOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'KD-';
  for (let i = 0; i < 8; i++) {
    if (i === 4) id += '-';
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const NEXT_STEPS = [
  { icon: '📧', title: 'Confirmation email', desc: 'Full order details sent to your inbox' },
  { icon: '📦', title: 'Processing (1–2 days)', desc: 'Picking, packing, and quality-checked' },
  { icon: '🚚', title: 'Out for delivery', desc: 'Tracked express shipping to your door' },
  { icon: '👟', title: 'Time to lace up', desc: 'Your drops have arrived — enjoy' },
];

export default function OrderConfirmationPage() {
  const orderId = useRef<string | null>(null);
  if (!orderId.current) orderId.current = makeOrderId();

  const estimatedDate = useRef<string | null>(null);
  if (!estimatedDate.current) {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    estimatedDate.current = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    setTimeout(fireConfetti, 300);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-[#111] text-white overflow-y-auto">
    <main className="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden">

      {/* Giant background watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-black text-white/[0.025] leading-none tracking-tighter"
          style={{ fontSize: 'clamp(10rem, 32vw, 26rem)' }}
        >
          KICKS
        </span>
      </div>

      {/* Decorative corner rings */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full border border-[#4B5BFF]/20 pointer-events-none" />
      <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full border border-[#4B5BFF]/10 pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

      {/* Pulsing checkmark */}
      <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
        <span className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#4B5BFF]/10 animate-ping" style={{ animationDuration: '2s' }} />
        <span className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#4B5BFF]/15 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#4B5BFF] flex items-center justify-center shadow-[0_0_80px_rgba(75,91,255,0.5)] z-10">
          <svg
            width="28" height="28" className="sm:w-[34px] sm:h-[34px]" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Label */}
      <p className="text-[#4B5BFF] text-[11px] font-black uppercase tracking-[0.35em] mb-3">
        Order Confirmed
      </p>

      {/* Hero heading */}
      <h1
        className="font-black uppercase text-center leading-none mb-5"
        style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', letterSpacing: '-0.04em' }}
      >
        DROPPED!&nbsp;✓
      </h1>

      <p className="text-gray-400 text-sm text-center max-w-xs leading-relaxed mb-6 sm:mb-8">
        Your kicks are locked in and on their way.
        <br />
        Get ready to lace up.
      </p>

      {/* Order ID + ETA card */}
      <div className="flex items-stretch gap-0 bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8 sm:mb-10 w-full max-w-sm">
        <div className="flex-1 px-4 sm:px-6 py-4 text-center flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Order ID</p>
          <p className="font-black text-white tracking-wider text-xs sm:text-sm font-mono truncate">{orderId.current}</p>
        </div>
        <div className="w-px bg-white/10 self-stretch shrink-0" />
        <div className="flex-1 px-4 sm:px-6 py-4 text-center flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Est. Delivery</p>
          <p className="font-semibold text-[#4B5BFF] text-xs sm:text-sm leading-snug">{estimatedDate.current}</p>
        </div>
      </div>

      {/* What happens next */}
      <div className="w-full max-w-sm mb-8 sm:mb-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 text-center">
          What happens next
        </p>
        <div className="space-y-2">
          {NEXT_STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.05] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 transition-colors group"
            >
              <span className="text-xl leading-none shrink-0">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">{step.title}</p>
                <p className="text-xs text-gray-500 leading-snug mt-0.5">{step.desc}</p>
              </div>
              <span className="shrink-0 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[11px] font-black text-gray-600 group-hover:border-[#4B5BFF]/40 group-hover:text-[#4B5BFF] transition-colors">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          href="/products"
          className="w-full sm:flex-1 h-12 bg-[#4B5BFF] text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-[#3a47e0] active:scale-[0.98] transition-all duration-150 gap-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Shop More Drops
        </Link>
        <Link
          href="/"
          className="w-full sm:flex-1 h-12 bg-white/[0.08] text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-white/[0.12] active:scale-[0.98] transition-all duration-150 border border-white/10"
        >
          Back to Home
        </Link>
      </div>

      {/* Re-fire confetti */}
      <button
        onClick={fireConfetti}
        className="mt-10 text-xs text-gray-700 hover:text-gray-400 transition-colors font-semibold flex items-center gap-1.5 group"
      >
        <span className="group-hover:scale-125 transition-transform duration-150 inline-block">🎉</span>
        <span>Celebrate again</span>
      </button>
    </main>
    </div>
  );
}
