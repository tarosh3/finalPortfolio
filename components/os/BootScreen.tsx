"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const DURATION = 2200;
    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setProgress(100);
      setLeaving(true);
      window.setTimeout(onDone, 600);
    };
    // setInterval + a hard backstop guarantee the boot completes even if the
    // tab is backgrounded and rAF/timers are throttled.
    const id = window.setInterval(() => {
      // ease-out so the bar surges then settles — feels like a real load
      const t = Math.min(1, (performance.now() - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(eased * 100);
      if (t >= 1) {
        window.clearInterval(id);
        finish();
      }
    }, 30);
    const backstop = window.setTimeout(finish, DURATION + 900);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(backstop);
    };
  }, [onDone]);

  return (
    <div className={`os-boot ${leaving ? "os-boot--leaving" : ""}`}>
      <div className="os-boot__stage">
        <Logo size={112} className="os-boot__mark" />
        <div className="os-boot__bar">
          <div className="os-boot__fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="os-boot__caption">Tarosh&nbsp;OS</p>
      </div>
      <p className="os-boot__foot">Tarosh Mathuria · Senior Software Engineer</p>
    </div>
  );
}
