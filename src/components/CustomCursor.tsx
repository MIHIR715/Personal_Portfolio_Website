import { useEffect, useRef, useState } from "react";
import { useIsDesktopPointer } from "./ScrollReveal";

export function CustomCursor() {
  const enabled = useIsDesktopPointer();
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      setVisible(true);
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (el) {
        setActive(true);
        setLabel(el.dataset["cursor"] === "true" ? null : (el.dataset["cursor"] ?? null));
      } else if ((e.target as HTMLElement)?.closest?.("a,button,input,textarea,select")) {
        setActive(true);
        setLabel(null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="grid place-items-center rounded-full bg-accent text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground transition-all duration-200 ease-out"
        style={{
          width: label ? 68 : active ? 34 : 9,
          height: label ? 68 : active ? 34 : 9,
          opacity: label ? 1 : active ? 0.5 : 0.9,
        }}
      >
        {label}
      </div>
    </div>
  );
}
