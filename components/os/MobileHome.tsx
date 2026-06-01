"use client";

import { APPS, APP_BY_ID, type AppId } from "@/lib/os";
import Logo from "./Logo";

const DOCK_IDS: AppId[] = ["safari", "about", "games", "contact"];

export default function MobileHome({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <div className="os-mhome">
      <header className="os-mhome__head">
        <span className="os-mhome__mark"><Logo size={58} /></span>
        <h1 className="os-mhome__name">Tarosh Mathuria</h1>
        <p className="os-mhome__role">Senior Software Engineer</p>
        <p className="os-mhome__sub">Go &amp; Distributed Systems · 60K+ merchants on ONDC</p>
      </header>

      <div className="os-mhome__grid">
        {APPS.map((app) => (
          <button key={app.id} className="os-mhome__app" onClick={() => onOpen(app.id)}>
            <span className="os-mhome__icon">
              <img src={`/assets/dock/${app.id}.png`} alt="" width={62} height={62} draggable={false} />
            </span>
            <span className="os-mhome__label">{app.label}</span>
          </button>
        ))}
      </div>

      <div className="os-mhome__dock">
        {DOCK_IDS.map((id) => (
          <button key={id} className="os-mhome__dockicon" onClick={() => onOpen(id)} aria-label={APP_BY_ID[id].name}>
            <span className="os-mhome__icon">
              <img src={`/assets/dock/${id}.png`} alt="" width={56} height={56} draggable={false} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
