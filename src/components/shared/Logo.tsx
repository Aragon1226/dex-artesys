import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'FULL' | 'SYMBOL' | 'WORDMARK';
  /** Show the "Crypto Exchange" descriptor under the wordmark. */
  descriptor?: boolean;
}

/**
 * Artesys brand mark — a triangular "A" nested inside an aperture ring.
 * Drawn on a 100-unit grid, single color (currentColor), never gradient,
 * never bevelled, per the Artesys Brand Guidelines v1.0.
 */
export const ArtesysMark: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    role="img"
    aria-label="Artesys symbol"
    className={`shrink-0 ${className}`}
  >
    {/* Aperture ring: r=44, stroke 5 */}
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="5" />
    {/* Cardinal aperture ticks */}
    <g stroke="currentColor" strokeWidth="5" strokeLinecap="butt">
      <path d="M50 2v12" />
      <path d="M50 86v12" />
      <path d="M2 50h12" />
      <path d="M86 50h12" />
    </g>
    {/* Solid isoceles triangle "A" */}
    <path d="M50 24 74 72H26L50 24Z" fill="currentColor" />
    {/* Chart-bar crossbar (negative space) */}
    <rect x="39" y="58" width="22" height="6" rx="1" fill="var(--logo-counter, hsl(var(--background)))" />
    {/* Aperture pupil / decimal point */}
    <circle cx="50" cy="50" r="3.5" fill="var(--logo-counter, hsl(var(--background)))" />
  </svg>
);

const Wordmark: React.FC<{ size?: number; descriptor?: boolean }> = ({ size = 40, descriptor }) => (
  <span className="flex flex-col justify-center leading-none">
    <span
      className="font-display font-semibold tracking-[-0.02em] text-current"
      style={{ fontSize: size * 0.62 }}
    >
      Artesys
    </span>
    {descriptor && (
      <span
        className="uppercase text-current/70 font-medium"
        style={{ fontSize: Math.max(7, size * 0.19), letterSpacing: '0.28em', marginTop: size * 0.11 }}
      >
        Crypto Exchange
      </span>
    )}
  </span>
);

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  variant = 'FULL',
  descriptor = false,
}) => {
  if (variant === 'SYMBOL') {
    return <ArtesysMark size={size} className={`text-primary ${className}`} />;
  }

  if (variant === 'WORDMARK') {
    return (
      <span className={`inline-flex items-center text-primary ${className}`} style={{ height: size }}>
        <Wordmark size={size} descriptor={descriptor} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 text-primary ${className}`}>
      <ArtesysMark size={size} />
      <Wordmark size={size} descriptor={descriptor} />
    </span>
  );
};

export default Logo;
