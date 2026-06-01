import { useId } from "react";

// TM monogram — interlocking T + M with an Action-Yellow accent slash.
// Geometry from the Stitch "Luminous Glass" brand exploration.
type Props = {
  size?: number;
  tile?: boolean; // charcoal squircle tile (default) vs. bare glyph
  className?: string;
};

export default function Logo({ size = 28, tile = true, className = "" }: Props) {
  const id = useId();
  const glyph = tile ? "#ffffff" : "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={`tm-logo ${className}`}
      role="img"
      aria-label="Tarosh Mathuria"
    >
      {tile && (
        <>
          <defs>
            <linearGradient id={`tm-${id}`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2a2a2a" />
              <stop offset="1" stopColor="#0d0d0d" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="44" fill={`url(#tm-${id})`} />
        </>
      )}
      {/* T */}
      <path d="M60 70H105V85H90V140H75V85H60V70Z" fill={glyph} />
      {/* M */}
      <path d="M100 70L120 110L140 70H155V140H140V95L120 135L100 95V140H85V70H100Z" fill={glyph} />
      {/* accent slash */}
      <rect x="140" y="125" width="4" height="20" transform="rotate(45 140 125)" fill="#ffd600" />
    </svg>
  );
}
