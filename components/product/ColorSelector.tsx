interface ColorSelectorProps {
  selected: string | null;
  onChange: (color: string) => void;
}

const COLORS: { label: string; hex: string }[] = [
  { label: 'Black', hex: '#111111' },
  { label: 'White', hex: '#FFFFFF' },
  { label: 'Grey', hex: '#9CA3AF' },
  { label: 'Blue', hex: '#4B5BFF' },
  { label: 'Red', hex: '#EF4444' },
];

export function ColorSelector({ selected, onChange }: ColorSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#111]">Color</span>
        {selected && (
          <span className="text-xs text-gray-500 font-medium">
            {COLORS.find((c) => c.hex === selected)?.label ?? selected}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {COLORS.map((color) => {
          const isSelected = selected === color.hex;
          return (
            <button
              key={color.hex}
              onClick={() => onChange(color.hex)}
              aria-label={color.label}
              title={color.label}
              className={`w-9 h-9 rounded-full transition-all duration-150 border-2 ${
                isSelected
                  ? 'border-[#4B5BFF] scale-110 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              } ${color.hex === '#FFFFFF' ? 'shadow-sm' : ''}`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
