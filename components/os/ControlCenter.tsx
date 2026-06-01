"use client";

import { WALLPAPERS, type Theme } from "@/lib/os";
import { Moon, Sun } from "@/components/Icons";

type Props = {
  theme: Theme;
  wallpaper: number;
  onTheme: (t: Theme) => void;
  onWallpaper: (i: number) => void;
  onClose: () => void;
};

export default function ControlCenter({ theme, wallpaper, onTheme, onWallpaper, onClose }: Props) {
  return (
    <div className="os-cc-backdrop" onPointerDown={onClose}>
      <div className="os-cc" onPointerDown={(e) => e.stopPropagation()}>
        <div className="os-cc__block">
          <span className="os-cc__label">Appearance</span>
          <div className="os-cc__seg">
            <button className={theme === "light" ? "is-active" : ""} onClick={() => onTheme("light")}>
              <Sun size={15} /> Light
            </button>
            <button className={theme === "dark" ? "is-active" : ""} onClick={() => onTheme("dark")}>
              <Moon size={15} /> Dark
            </button>
          </div>
        </div>

        <div className="os-cc__block">
          <span className="os-cc__label">Wallpaper</span>
          <div className="os-cc__wps">
            {WALLPAPERS.map((w, i) => (
              <button
                key={w.name}
                className={`os-cc__wp ${wallpaper === i ? "is-active" : ""}`}
                style={{ background: w[theme] }}
                onClick={() => onWallpaper(i)}
                title={w.name}
                aria-label={w.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
