"use client";

import { Sparkles } from "@/components/Icons";

type Props = {
  onStart: () => void;
  onClose: () => void;
};

export default function Welcome({ onStart, onClose }: Props) {
  return (
    <div className="os-welcome">
      <div className="os-welcome__card">
        <span className="os-welcome__icon"><Sparkles size={18} /></span>
        <div className="os-welcome__body">
          <h3 className="os-welcome__title">Welcome — you&apos;re on Tarosh&apos;s desktop</h3>
          <p className="os-welcome__text">
            Open anything from the <strong>Dock</strong> below or the <strong>menu bar</strong> up top —
            or press <kbd>/</kbd> to search. Drag windows around; it&apos;s yours to explore.
          </p>
          <div className="os-welcome__actions">
            <button className="btn btn--accent os-welcome__cta" onClick={onStart}>Take the tour</button>
            <button className="os-welcome__skip" onClick={onClose}>I&apos;ll explore myself</button>
          </div>
        </div>
      </div>
      <span className="os-welcome__arrow" aria-hidden>↓</span>
    </div>
  );
}
