import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { Magnetic } from "@/components/Magnetic";
import { useMouseParallax } from "@/components/ScrollReveal";
import type { SiteSettings } from "@/lib/types";

const LABELS = [
  { text: "UI/UX Designer", pos: "left-[-8%] top-[16%]", depth: 2.4 },
  { text: "Figma Specialist", pos: "right-[-6%] top-[38%]", depth: -1.8 },
  { text: "Interaction Design", pos: "left-[-4%] bottom-[16%]", depth: 1.4 },
];

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const reduced = useReducedMotion();
  const parallax = useMouseParallax(12);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
      };

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(80%_60%_at_50%_0%,var(--color-surface),transparent)]"
      />
      <div className="container-page relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid items-center gap-14 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <motion.p variants={item} className="eyebrow">
              {settings?.professional_title ??
                "UI/UX Designer · Interaction Designer · Figma Specialist"}
            </motion.p>

            <motion.h1 variants={item} className="display-xl mt-6 text-foreground">
              {settings?.hero_headline ??
                "Designing digital experiences that feel simple, useful, and memorable."}
            </motion.h1>

            <motion.p variants={item} className="body-lead mt-7 max-w-xl">
              {settings?.hero_description ??
                "I am Mihir, a UI/UX and interaction designer who combines user-centered design, visual design, prototyping, and frontend awareness to create thoughtful digital experiences."}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  View My Work <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Let&apos;s Work Together
              </Link>
              <Link
                to="/resume"
                className="link-underline inline-flex items-center gap-2 px-1 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <FileText className="h-4 w-4" /> View Resume
              </Link>
            </motion.div>

            {settings?.availability ? (
              <motion.div variants={item} className="mt-9 flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="eyebrow">{settings.availability}</span>
              </motion.div>
            ) : null}
          </div>

          <motion.div variants={item} className="lg:col-span-5">
            <div
              className="relative mx-auto w-full max-w-sm"
              style={{
                transform: `translate3d(${parallax.x * 0.6}px, ${parallax.y * 0.6}px, 0)`,
                transition: "transform 0.25s ease-out",
              }}
            >
              <div className="relative aspect-[4/5] w-full">
                {/* halo */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[8%] h-[74%] w-[74%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_26%,transparent),transparent)] blur-[2px]"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[10%] h-[70%] w-[70%] -translate-x-1/2 rounded-full border border-accent/35"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[14%] bottom-[7%] h-4 rounded-[50%] bg-foreground/15 blur-xl"
                />

                {settings?.avatar_url ? (
                  <motion.img
                    src={settings.avatar_url}
                    alt="Portrait of Mihirkumar Lad"
                    className="absolute inset-x-0 bottom-[6%] mx-auto h-[92%] w-auto object-contain drop-shadow-[0_24px_40px_oklch(0_0_0/0.28)]"
                    animate={reduced ? { y: 0 } : { y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    width={671}
                    height={898}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <span className="font-serif text-6xl text-muted-foreground/50">ML</span>
                  </div>
                )}
              </div>

              {LABELS.map((l) => (
                <span
                  key={l.text}
                  className={`absolute hidden rounded-full border border-border bg-card/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur md:inline-block ${l.pos}`}
                  style={{
                    transform: `translate3d(${parallax.x * l.depth}px, ${parallax.y * l.depth}px, 0)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  {l.text}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>

        <div className="mt-20 flex items-center gap-3 pb-6 text-muted-foreground">
          <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
          <span className="eyebrow">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
