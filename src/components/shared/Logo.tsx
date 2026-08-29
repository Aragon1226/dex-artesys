import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'FULL' | 'SYMBOL' | 'WORDMARK';
  /** Show the "Crypto Exchange" descriptor under the wordmark. */
  descriptor?: boolean;
  /** Aureus Gold precision accent on the aperture. Used sparingly. */
  accent?: boolean;
}

/**
 * Artesys brand mark — a monolithic squared tile with the "A" cut out as
 * negative space and a single Aureus Gold ledger rule through the counter.
 * Drawn on a 100-unit grid: flat colour, one soft diagonal facet for depth,
 * no bevels and no 3D. Reads cleanly from 512px down to 16px.
 */
export const ArtesysMark: React.FC<{ size?: number; className?: string; accent?: boolean }> = ({
  size = 40,
  className = '',
  accent = true,
}) => {
  const uid = React.useId().replace(/:/g, '');
  const tile =
    'M26 3h48a23 23 0 0 1 23 23v48a23 23 0 0 1-23 23H26A23 23 0 0 1 3 74V26A23 23 0 0 1 26 3Z';
  const letter = 'M50 19 L78.5 82 H64.2 L50 50 L35.8 82 H21.5 Z';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Artesys symbol"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id={`t-${uid}`}>
          <path d={tile} />
        </clipPath>
        <clipPath id={`k-${uid}`}>
          {/* the letter's outer triangle — keeps the gold rule inside the counter */}
          <path d="M50 19 L21.5 82 H78.5 Z" />
        </clipPath>
      </defs>

      {/* Tile — Artesys Blue with a single diagonal facet */}
      <g clipPath={`url(#t-${uid})`}>
        <rect width="100" height="100" fill="currentColor" />
        <path d="M3 26A23 23 0 0 1 26 3h48L3 74Z" fill="#FFFFFF" opacity="0.14" />
      </g>

      {/* Negative-space "A" */}
      <path d={letter} fill="var(--logo-void, #061428)" />

      {/* Aureus Gold ledger rule */}
      {accent && (
        <g clipPath={`url(#k-${uid})`}>
          <rect x="20" y="63" width="60" height="6" fill="var(--logo-accent, #E6B34A)" />
        </g>
      )}
    </svg>
  );
};


const Wordmark: React.FC<{ size?: number; descriptor?: boolean }> = ({ size = 40, descriptor }) => (
  <span className="flex flex-col justify-center leading-none">
    <span
      className="font-display font-semibold tracking-[-0.025em] text-current"
      style={{ fontSize: size * 0.6 }}
    >
      Artesys
    </span>
    {descriptor && (
      <span
        className="flex items-center text-current/65 font-medium uppercase"
        style={{ fontSize: Math.max(7, size * 0.175), marginTop: size * 0.13 }}
      >
        <span
          aria-hidden
          className="bg-current/40"
          style={{ width: size * 0.18, height: 1, marginRight: size * 0.1 }}
        />
        <span style={{ letterSpacing: '0.3em' }}>Crypto Exchange</span>
      </span>
    )}
  </span>
);

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  variant = 'FULL',
  descriptor = false,
  accent = true,
}) => {
  if (variant === 'SYMBOL') {
    return <ArtesysMark size={size} accent={accent} className={`text-primary ${className}`} />;
  }

  if (variant === 'WORDMARK') {
    return (
      <span className={`inline-flex items-center text-primary ${className}`} style={{ height: size }}>
        <Wordmark size={size} descriptor={descriptor} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center text-primary ${className}`} style={{ gap: size * 0.3 }}>
      <ArtesysMark size={size} accent={accent} />
      <Wordmark size={size} descriptor={descriptor} />
    </span>
  );
};

export default Logo;
