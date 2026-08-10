import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useIsDesktopPointer() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(mq.matches && !reduced.matches);
    update();
    mq.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);
  return ok;
}

export function useMouseParallax(strength = 1) {
  const enabled = useIsDesktopPointer();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({
          x: ((e.clientX / window.innerWidth) * 2 - 1) * strength,
          y: ((e.clientY / window.innerHeight) * 2 - 1) * strength,
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled, strength]);
  return enabled ? pos : { x: 0, y: 0 };
}
