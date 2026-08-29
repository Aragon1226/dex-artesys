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
 * Artesys brand mark — a precision aperture ring enclosing a mitred
 * triangular "A". Drawn on a 100-unit grid in a single colour
 * (currentColor) with one optional Aureus Gold hairline accent.
 * No gradients, no bevels, no 3D — per Artesys Brand Guidelines v1.0.
 *
 * Construction:
 *   r=46  outer hairline (calibration edge, 1.5u)
 *   r=37  primary aperture ring (6u) broken by four cardinal apertures
 *   r=27  inner calibration ticks
 *   A     mitred chevron, 8.5u strokes, apex on the vertical axis
 */
export const ArtesysMark: React.FC<{ size?: number; className?: string; accent?: boolean }> = ({
  size = 40,
  className = '',
  accent = true,
}) => {
  // r=37 ring, broken by four apertures centred on the cardinal axes.
  const C = 2 * Math.PI * 37; // 232.478
  const seg = C / 4;
  const gap = 13;
  const dash = seg - gap;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Artesys symbol"
      className={`shrink-0 ${className}`}
    >
      {/* Calibration edge */}
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" opacity="0.38" />

      {/* Primary aperture ring — four arcs, apertures on the cardinals */}
      <circle
        cx="50"
        cy="50"
        r="37"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="butt"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={gap / 2}
      />

      {/* Cardinal aperture blades, seated in the ring breaks */}
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="butt" opacity="0.9">
        <path d="M50 26.5v-6" />
        <path d="M50 79.5v6" />
        <path d="M26.5 50h-6" />
        <path d="M79.5 50h6" />
      </g>

      {/* Aureus Gold precision arc — a single 44° reading on the upper right */}
      {accent && (
        <path
          d="M63.85 15.35A37 37 0 0 1 84.65 36.15"
          stroke="var(--logo-accent, #E6B34A)"
          strokeWidth="3"
          strokeLinecap="butt"
          transform="translate(0 0)"
          opacity="0.95"
        />
      )}

      {/* Mitred triangular "A" */}
      <path
        d="M29 72 50 29 71 72"
        stroke="currentColor"
        strokeWidth="8.5"
        strokeLinejoin="miter"
        strokeLinecap="butt"
        strokeMiterlimit="8"
      />
      {/* Crossbar — ledger rule through the counter */}
      <path d="M37.5 62.5h25" stroke="currentColor" strokeWidth="6" strokeLinecap="butt" />
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
