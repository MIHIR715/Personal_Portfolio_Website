import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useIsDesktopPointer } from "./ScrollReveal";

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const enabled = useIsDesktopPointer();
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({
          x: (e.clientX - (r.left + r.width / 2)) * 0.25,
          y: (e.clientY - (r.top + r.height / 2)) * 0.35,
        });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.span>
  );
}
