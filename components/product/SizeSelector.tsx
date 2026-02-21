import type { SizeType } from '@/lib/variants';

interface SizeSelectorProps {
  sizeType: SizeType;
  selected: string | null;
  onChange: (size: string) => void;
}

const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
const SHOE_UNAVAILABLE = ['43', '46'];

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CLOTHING_UNAVAILABLE: string[] = [];

export function SizeSelector({ sizeType, selected, onChange }: SizeSelectorProps) {
  const isShoes = sizeType === 'eu';
  const sizes = isShoes ? SHOE_SIZES : CLOTHING_SIZES;
  const unavailable = isShoes ? SHOE_UNAVAILABLE : CLOTHING_UNAVAILABLE;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#111]">
          {isShoes ? 'Size (EU)' : 'Size'}
        </span>
        {isShoes && (
          <button className="text-xs text-[#4B5BFF] font-semibold underline underline-offset-2 hover:text-[#3a47e0] transition-colors">
            Size Chart
          </button>
        )}
      </div>
      <div className={`grid gap-2 ${isShoes ? 'grid-cols-6' : 'grid-cols-6 sm:grid-cols-6'}`}>
        {sizes.map((size) => {
          const isUnavailable = unavailable.includes(size);
          const isSelected = selected === size;
          return (
            <button
              key={size}
              onClick={() => !isUnavailable && onChange(size)}
              disabled={isUnavailable}
              aria-label={`Size ${size}${isUnavailable ? ' — unavailable' : ''}`}
              className={`h-10 rounded-lg text-sm font-bold transition-all duration-150 border-2
                ${isSelected
                  ? 'bg-[#111] text-white border-[#111] shadow-md'
                  : isUnavailable
                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                  : 'bg-white text-[#111] border-gray-200 hover:border-[#111] hover:shadow-sm'
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
