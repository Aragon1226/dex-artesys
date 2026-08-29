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
 * Artesys brand mark — a sculptural 3D monogram: the "A" extruded as a solid
 * geometric prism with lit front faces, shaded side planes and a single
 * Aureus Gold ledger beam crossing the counter. No enclosing tile or box.
 * Drawn on a 100-unit grid; reads cleanly from 512px down to 16px.
 */
export const ArtesysMark: React.FC<{ size?: number; className?: string; accent?: boolean }> = ({
  size = 40,
  className = '',
  accent = true,
}) => {
  const uid = React.useId().replace(/:/g, '');
  const FRONT = 'M50 6 L88 84 L70 84 L50 45 L30 84 L12 84 Z';

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
        <linearGradient id={`f-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#5E95F7" />
          <stop offset="55%" stopColor="#2A67DF" />
          <stop offset="100%" stopColor="#1B4FB8" />
        </linearGradient>
        <linearGradient id={`s-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123F9B" />
          <stop offset="100%" stopColor="#0A2A6B" />
        </linearGradient>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F2CE7A" />
          <stop offset="100%" stopColor="#D69C31" />
        </linearGradient>
        <clipPath id={`tri-${uid}`}>
          <path d="M50 6 L90 86 L10 86 Z" />
        </clipPath>
      </defs>

      <g transform="translate(-4,3)">
        {/* Extruded body */}
        <path d={FRONT} transform="translate(9,-5)" fill="#0A2A6B" />

        {/* Shaded side planes */}
        <polygon points="12,84 50,6 59,1 21,79" fill={`url(#s-${uid})`} />
        <polygon points="50,6 88,84 97,79 59,1" fill={`url(#s-${uid})`} opacity="0.85" />
        <polygon points="50,45 30,84 39,79 59,40" fill="#0E3585" />
        <polygon points="70,84 50,45 59,40 79,79" fill="#0E3585" opacity="0.9" />

        {/* Lit front face */}
        <path d={FRONT} fill={`url(#f-${uid})`} />

        {/* Aureus Gold ledger beam */}
        {accent && (
          <g clipPath={`url(#tri-${uid})`}>
            <polygon points="10,71 90,71 99,66 19,66" fill="#F6DDA1" />
            <rect x="10" y="71" width="80" height="6.5" fill={`url(#g-${uid})`} />
          </g>
        )}

        {/* Apex highlight */}
        <path d="M50 6 L12 84" stroke="#8FB6FA" strokeOpacity="0.5" strokeWidth="1" fill="none" />
      </g>
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
