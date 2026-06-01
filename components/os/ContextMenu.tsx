"use client";

export type CtxItem = { label: string; onClick: () => void; danger?: boolean; divider?: boolean };

type Props = {
  x: number;
  y: number;
  items: CtxItem[];
  onClose: () => void;
};

export default function ContextMenu({ x, y, items, onClose }: Props) {
  // keep the menu on-screen
  const left = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 220);
  const top = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 9999) - items.length * 36 - 16);

  return (
    <div
      className="os-ctx-backdrop"
      onPointerDown={onClose}
      onContextMenu={(e) => { e.preventDefault(); onClose(); }}
    >
      <div className="os-ctx" style={{ left, top }} onPointerDown={(e) => e.stopPropagation()}>
        {items.map((it, i) =>
          it.divider ? (
            <span key={i} className="os-ctx__divider" />
          ) : (
            <button
              key={i}
              className={`os-ctx__item ${it.danger ? "is-danger" : ""}`}
              onClick={() => { it.onClick(); onClose(); }}
            >
              {it.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
