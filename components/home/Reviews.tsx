import Image from 'next/image';

const REVIEWS = [
  {
    title: 'Absolutely Worth It',
    text: 'These kicks are next level. The quality is incredible and they arrived ahead of schedule. KICKS has earned a loyal customer.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/40?img=5',
    name: 'Sarah M.',
    date: 'Feb 10, 2026',
  },
  {
    title: 'Best Purchase I\'ve Made',
    text: 'Exactly as described — no surprises. The quality is fire and the materials feel premium. Kicks Drop never disappoints.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/40?img=12',
    name: 'James T.',
    date: 'Jan 28, 2026',
  },
  {
    title: 'Lightning Fast Delivery',
    text: 'Ordered Sunday, arrived Tuesday. The packaging was immaculate and the product matched the photos perfectly. 10/10 will buy again.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/40?img=22',
    name: 'Alex R.',
    date: 'Jan 15, 2026',
  },
];

const REVIEW_PHOTOS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-200'} style={{ fontSize: '13px' }}>
          ★
        </span>
      ))}
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
            className="font-black uppercase text-[#111] leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Reviews
          </h2>
          <button className="bg-[#4B5BFF] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-[#3a47e0] transition-colors duration-200">
            See All
          </button>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex flex-col gap-3">
              {/* Reviewer row */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#111] leading-tight">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.date}</p>
                </div>
                <StarRating count={r.rating} />
              </div>
              {/* Review content */}
              <div>
                <p className="font-bold text-sm text-[#111] mb-1">{r.title}</p>
                <p
                  className="text-xs text-gray-500 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-4">
          {REVIEW_PHOTOS.map((src, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-4/3">
              <Image src={src} alt={`Customer photo ${i + 1}`} fill sizes="(max-width: 640px) 33vw, 33vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
