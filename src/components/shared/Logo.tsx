import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "FULL" | "SYMBOL" | "WORDMARK";
  /** Show the "Crypto Exchange" descriptor under the wordmark. */
  descriptor?: boolean;
  /** Aureus Gold precision accent on the aperture. Used sparingly. */
  accent?: boolean;
}

/**
 * Artesys brand mark — the social-share sculpture reduced to a scalable mark:
 * a solid, extruded midnight-blue "A" prism with lit front faces, deep shaded
 * side planes and a single tapered Aureus Gold blade slicing across the
 * counter. No enclosing tile or box. Drawn on a 100-unit grid; reads cleanly
 * from 512px down to 16px.
 */
export const ArtesysMark: React.FC<{ size?: number; className?: string; accent?: boolean }> = ({
  size = 40,
  className = "",
  accent = true,
}) => {
  const uid = React.useId().replace(/:/g, "");
  const FRONT = "M50 5 L90 87 L71 87 L50 43 L29 87 L10 87 Z";

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
        {/* Lit front face — midnight blue #1E3FD8 family */}
        <linearGradient id={`f-${uid}`} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#4C7CFF" />
          <stop offset="45%" stopColor="#2A55E8" />
          <stop offset="100%" stopColor="#1E3FD8" />
        </linearGradient>
        {/* Shaded extrusion planes */}
        <linearGradient id={`s-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3FD8" />
          <stop offset="100%" stopColor="#050510" />
        </linearGradient>
        <linearGradient id={`g-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#C98A22" />
          <stop offset="45%" stopColor="#F4D488" />
          <stop offset="100%" stopColor="#D9A63A" />
        </linearGradient>
      </defs>

      <g transform="translate(-3,2)">
        {/* Deep extruded body */}
        <path d={FRONT} transform="translate(9,-5)" fill="#080830" />

        {/* Side planes */}
        <polygon points="10,87 50,5 59,0 19,82" fill={`url(#s-${uid})`} />
        <polygon points="50,5 90,87 99,82 59,0" fill={`url(#s-${uid})`} opacity="0.9" />
        <polygon points="50,43 29,87 38,82 59,38" fill="#101052" />
        <polygon points="71,87 50,43 59,38 80,82" fill="#101052" opacity="0.9" />

        {/* Lit front face */}
        <path d={FRONT} fill={`url(#f-${uid})`} />

        {/* Aureus Gold blade — tapered, slicing across the counter */}
        {accent && (
          <g>
            <polygon points="2,73 84,57 86,60 4,77" fill={`url(#g-${uid})`} />
            <polygon points="2,73 84,57 84,58.4 2,74.4" fill="#F8E6B4" opacity="0.85" />
          </g>
        )}

        {/* Apex highlight */}
        <path d="M50 5 L10 87" stroke="#8A8AE8" strokeOpacity="0.45" strokeWidth="1" fill="none" />
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
        <span style={{ letterSpacing: "0.3em" }}>Crypto Exchange</span>
      </span>
    )}
  </span>
);

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 40,
  variant = "FULL",
  descriptor = false,
  accent = true,
}) => {
  if (variant === "SYMBOL") {
    return <ArtesysMark size={size} accent={accent} className={`text-primary ${className}`} />;
  }

  if (variant === "WORDMARK") {
    return (
      <span
        className={`inline-flex items-center text-primary ${className}`}
        style={{ height: size }}
      >
        <Wordmark size={size} descriptor={descriptor} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-primary ${className}`}
      style={{ gap: size * 0.3 }}
    >
      <ArtesysMark size={size} accent={accent} />
      <Wordmark size={size} descriptor={descriptor} />
    </span>
  );
};

export default Logo;
