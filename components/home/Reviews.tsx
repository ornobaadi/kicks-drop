import Image from 'next/image';
import Link from 'next/link';

const REVIEWS = [
  {
    title: 'Good Quality',
    text: 'I highly recommend shopping from kicks',
    rating: 5,
    avatar: 'https://i.pravatar.cc/80?img=5',
    name: 'Sarah M.',
    date: 'Feb 10, 2026',
    photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    title: 'Good Quality',
    text: 'I highly recommend shopping from kicks',
    rating: 5,
    avatar: 'https://i.pravatar.cc/80?img=12',
    name: 'James T.',
    date: 'Jan 28, 2026',
    photo: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  },
  {
    title: 'Good Quality',
    text: 'I highly recommend shopping from kicks',
    rating: 5,
    avatar: 'https://i.pravatar.cc/80?img=22',
    name: 'Alex R.',
    date: 'Jan 15, 2026',
    photo: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-200'} style={{ fontSize: '14px' }}>
          ★
        </span>
      ))}
      <span className="ml-1 text-xs font-semibold text-[#111]">{count}.0</span>
    </div>
  );
}

export function Reviews() {
  return (
    <section className="bg-[#e7e7e3] px-4 sm:px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-semibold uppercase text-[#111] leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Reviews
          </h2>
          <Link
            href="/products"
            className="bg-[#4B5BFF] text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-[#3a47e0] transition-colors duration-200"
          >
            See All
          </Link>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden flex flex-col">
              {/* Top: title + avatar */}
              <div className="p-5 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#111] mb-1">{r.title}</p>
                  <p
                    className="text-xs text-gray-500 leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {r.text}
                  </p>
                  <div className="mt-3">
                    <StarRating count={r.rating} />
                  </div>
                </div>
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
              </div>
              {/* Bottom: shoe photo */}
              <div className="relative w-full aspect-4/3">
                <Image
                  src={r.photo}
                  alt={`${r.name} review photo`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
