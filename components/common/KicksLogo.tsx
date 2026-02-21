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
  /** Background color used as the C's outline stroke so it visually separates from K. E.g. 'white', '#4B5BFF', '#111111' */
  strokeColor?: string;
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
  strokeColor,
}: {
  size?: string;
  fontSize?: string;
  className?: string;
  color?: string;
  opacity?: number;
  strokeColor?: string;
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
      {/* C slides into K's space; C sits on top with a bg-colored stroke so its outline shows visibly over K */}
      <span
        style={{
          marginRight: '-0.13em',
          position: 'relative',
          zIndex: 2,
          ...(strokeColor
            ? {
                WebkitTextStroke: `0.07em ${strokeColor}`,
                paintOrder: 'stroke fill',
              }
            : {}),
        }}
      >
        C
      </span>
      <span style={{ position: 'relative', zIndex: 1 }}>K</span>
      <span>S</span>
    </span>
  );
}

export function KicksLogo({ size, fontSize, className, color, opacity, asLink = true, strokeColor }: KicksLogoProps) {
  if (!asLink) return <LogoText size={size} fontSize={fontSize} className={className} color={color} opacity={opacity} strokeColor={strokeColor} />;
  return (
    <Link href="/" aria-label="KICKS home">
      <LogoText size={size} fontSize={fontSize} className={className} color={color} opacity={opacity} strokeColor={strokeColor} />
    </Link>
  );
}
