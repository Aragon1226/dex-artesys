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
 * Artesys brand mark — an isometric geometric monolith: three shaded facets of
 * a cube in the Artesys blue range, with the "A" projected onto the front-right
 * plane as negative space and a single Aureus Gold ledger rule through its
 * counter. Gold hairlines catch the top edges like machined metal.
 * Drawn on a 100-unit grid; reads cleanly from 512px down to 16px.
 */
export const ArtesysMark: React.FC<{ size?: number; className?: string; accent?: boolean }> = ({
  size = 40,
  className = '',
  accent = true,
}) => {
  const uid = React.useId().replace(/:/g, '');

  // Isometric cube vertices
  const TOP = '50,8 92,31 50,54 8,31';
  const LEFT = '8,31 50,54 50,92 8,69';
  const RIGHT = '92,31 50,54 50,92 92,69';

  // "A" drawn in a unit square, then projected onto the right facet plane
  const A = 'M0.5 0.06 L0.94 0.94 L0.76 0.94 L0.5 0.42 L0.24 0.94 L0.06 0.94 Z';
  const ATRI = 'M0.5 0.06 L0.06 0.94 L0.94 0.94 Z';
  const project = 'matrix(0.42 -0.23 0 0.38 50 54)';

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
        <linearGradient id={`top-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5C93F5" />
          <stop offset="100%" stopColor="#2F6FE4" />
        </linearGradient>
        <linearGradient id={`right-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2360DA" />
          <stop offset="100%" stopColor="#12419E" />
        </linearGradient>
        <linearGradient id={`left-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123F9B" />
          <stop offset="100%" stopColor="#0A2A6B" />
        </linearGradient>
        <clipPath id={`k-${uid}`}>
          <path d={ATRI} transform={project} />
        </clipPath>
      </defs>

      {/* Facets */}
      <polygon points={LEFT} fill={`url(#left-${uid})`} />
      <polygon points={RIGHT} fill={`url(#right-${uid})`} />
      <polygon points={TOP} fill={`url(#top-${uid})`} />

      {/* Structural seams */}
      <g stroke="#061428" strokeOpacity="0.32" strokeWidth="1.1" fill="none" strokeLinejoin="round">
        <path d="M8 31 L50 54 L92 31" />
        <path d="M50 54 L50 92" />
      </g>

      {/* Projected negative-space "A" */}
      <path d={A} transform={project} fill="#061428" fillOpacity="0.92" />

      {/* Aureus Gold ledger rule inside the counter + machined top edges */}
      {accent && (
        <>
          <g clipPath={`url(#k-${uid})`}>
            <rect
              x="0"
              y="0.66"
              width="1"
              height="0.1"
              transform={project}
              fill="var(--logo-accent, #E6B34A)"
            />
          </g>
          <path
            d="M8 31 L50 8 L92 31"
            fill="none"
            stroke="var(--logo-accent, #E6B34A)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeOpacity="0.85"
          />
        </>
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
