import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Work", to: "/work", hash: undefined },
  { label: "About", to: "/about", hash: undefined },
  { label: "Process", to: "/", hash: "process" },
  { label: "Skills", to: "/", hash: "skills" },
  { label: "Contact", to: "/contact", hash: undefined },
] as const;

export function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > 240 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled && !open
            ? "border-b border-border bg-background/75 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="container-page flex h-16 items-center justify-between gap-4 md:h-20"
        >
          <Link
            to="/"
            className="text-sm font-extrabold tracking-[0.22em] text-foreground"
            aria-label="Mihirkumar Lad — home"
          >
            MIHIR
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => {
              const active = item.hash ? false : pathname === item.to;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    hash={item.hash}
                    className={`link-underline text-sm font-medium transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/resume"
              className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            >
              Resume
            </Link>
            <Link
              to="/contact"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
            >
              Let&apos;s talk <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background pt-20 md:hidden"
          >
            <ul className="container-page flex flex-1 flex-col justify-center gap-2">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={item.to}
                    hash={item.hash}
                    className="block border-b border-border py-4 text-3xl font-medium tracking-tight text-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="container-page flex gap-3 pb-10">
              <Link
                to="/resume"
                className="flex-1 rounded-full border border-border py-3 text-center text-sm font-medium"
              >
                Resume
              </Link>
              <Link
                to="/contact"
                className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Let&apos;s talk
              </Link>
            </div>
            {resumeUrl ? null : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
