// Google Material Symbols (Rounded) — the same icon system the Stitch mockups use.
// Loaded via the stylesheet link in app/layout.tsx.

type Props = {
  name: string;
  size?: number;
  fill?: boolean;
  weight?: number;
  className?: string;
};

export default function Sym({ name, size = 20, fill = false, weight = 400, className = "" }: Props) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
