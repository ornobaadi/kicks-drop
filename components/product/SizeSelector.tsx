interface SizeSelectorProps {
  selected: number | null;
  onChange: (size: number) => void;
}

const ALL_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
// Simulate unavailable sizes (cosmetic — API has no stock data)
const UNAVAILABLE = [43, 46];

export function SizeSelector({ selected, onChange }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#111]">Size</span>
        <button className="text-xs text-[#4B5BFF] font-semibold underline underline-offset-2 hover:text-[#3a47e0] transition-colors">
          Size Chart
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {ALL_SIZES.map((size) => {
          const isUnavailable = UNAVAILABLE.includes(size);
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
