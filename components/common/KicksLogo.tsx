import Link from 'next/link';
import { cn } from '@/lib/utils';

interface KicksLogoProps {
  size?: string;
  /** Raw CSS font-size value, e.g. 'clamp(5rem, 20vw, 14rem)'. Overrides size class. */
  fontSize?: string;
  className?: string;
  color?: string;
  /** Applied to the outer wrapper so overlapping letters don't compound opacity. */
  opacity?: number;
  asLink?: boolean;
}

/**
 * Renders KICKS with only the C overlapping the K after it.
 * Every other letter has normal spacing.
 */
function LogoText({
  size = 'text-[22px]',
  fontSize,
  className,
  color = 'text-black',
  opacity,
}: {
  size?: string;
  fontSize?: string;
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <span
      className={cn(
        'font-black leading-none tracking-normal inline-flex items-baseline select-none',
        !fontSize && size,
        color,
        className,
      )}
      style={{ ...(fontSize ? { fontSize } : {}), ...(opacity !== undefined ? { opacity } : {}) }}
    >
      <span>K</span>
      <span>I</span>
      {/* C slides into K's space; K is explicitly stacked above to cover C's antialiased edge */}
      <span style={{ marginRight: '-0.13em', position: 'relative', zIndex: 0 }}>C</span>
      <span style={{ position: 'relative', zIndex: 1 }}>K</span>
      <span>S</span>
    </span>
  );
}

export function KicksLogo({ size, fontSize, className, color, opacity, asLink = true }: KicksLogoProps) {
  if (!asLink) return <LogoText size={size} fontSize={fontSize} className={className} color={color} opacity={opacity} />;
  return (
    <Link href="/" aria-label="KICKS home">
      <LogoText size={size} fontSize={fontSize} className={className} color={color} opacity={opacity} />
    </Link>
  );
}
