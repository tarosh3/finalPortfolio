"use client";

import { APPS, APP_BY_ID, type AppId } from "@/lib/os";
import Sym from "./Sym";
import Logo from "./Logo";

const DOCK_IDS: AppId[] = ["about", "projects", "games", "contact"];

export default function MobileHome({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <div className="os-mhome">
      <header className="os-mhome__head">
        <Logo size={62} />
        <h1 className="os-mhome__name">Tarosh Mathuria</h1>
        <p className="os-mhome__role">Senior Software Engineer</p>
        <p className="os-mhome__sub">Go &amp; Distributed Systems · 60K+ merchants on ONDC</p>
        <p className="os-mhome__hint">Tap an app to explore</p>
      </header>

      <div className="os-mhome__grid">
        {APPS.map((app) => (
          <button key={app.id} className="os-mhome__app" onClick={() => onOpen(app.id)}>
            <span
              className="os-mhome__icon"
              style={{ background: `linear-gradient(160deg, ${app.grad[0]}, ${app.grad[1]})` }}
            >
              <Sym name={app.icon} size={30} fill />
            </span>
            <span className="os-mhome__label">{app.label}</span>
          </button>
        ))}
      </div>

      <div className="os-mhome__dock">
        {DOCK_IDS.map((id) => {
          const app = APP_BY_ID[id];
          return (
            <button key={id} className="os-mhome__dockicon" onClick={() => onOpen(id)} aria-label={app.name}>
              <span
                className="os-mhome__icon"
                style={{ background: `linear-gradient(160deg, ${app.grad[0]}, ${app.grad[1]})` }}
              >
                <Sym name={app.icon} size={26} fill />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
