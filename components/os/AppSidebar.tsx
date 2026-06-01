"use client";

import Sym from "./Sym";

export type SideItem = { icon: string; label: string; active?: boolean };

type Props = {
  title: string;
  status?: string;
  cta?: { icon: string; label: string; onClick?: () => void };
  items: SideItem[];
  foot?: { initials: string; name: string; role: string };
};

export default function AppSidebar({ title, status, cta, items, foot }: Props) {
  return (
    <aside className="os-side">
      <div className="os-side__head">
        <h2>{title}</h2>
        {status && <span className="os-side__status"><i />{status}</span>}
      </div>

      {cta && (
        <button className="os-side__cta" type="button" onClick={cta.onClick}>
          <Sym name={cta.icon} size={18} /> {cta.label}
        </button>
      )}

      <nav className="os-side__nav">
        {items.map((it, i) => (
          <button key={i} type="button" className={`os-side__item ${it.active ? "is-active" : ""}`}>
            <Sym name={it.icon} size={20} fill={it.active} />
            {it.label}
          </button>
        ))}
      </nav>

      {foot && (
        <div className="os-side__foot">
          <span className="os-side__avatar">{foot.initials}</span>
          <span className="os-side__who">
            <b>{foot.name}</b>
            <span>{foot.role}</span>
          </span>
        </div>
      )}
    </aside>
  );
}
