import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Magnetic } from "@/components/Magnetic";
import type { SiteSettings } from "@/lib/types";

export function ResumeCta({ settings }: { settings: SiteSettings | null }) {
  return (
    <section className="container-page py-24">
      <ScrollReveal>
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-border bg-surface p-10 md:flex-row md:items-center md:p-14">
          <div className="max-w-lg">
            <h2 className="display-md text-foreground">Want the full picture?</h2>
            <p className="body-lead mt-3">
              Take a closer look at my skills, projects, and background.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/resume"
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground"
            >
              View Resume
            </Link>
            {settings?.resume_url ? (
              <a
                href={settings.resume_url}
                download
                className="rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
              >
                Download Resume
              </a>
            ) : null}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function ContactCta({ settings }: { settings: SiteSettings | null }) {
  const email = settings?.email;
  return (
    <section className="container-page py-24 md:py-32">
      <ScrollReveal>
        <div className="border-t border-border pt-12">
          <p className="eyebrow">Contact</p>
          <h2 className="display-lg mt-5 max-w-3xl text-foreground">
            Have a product worth designing?
          </h2>
          <p className="body-lead mt-5 max-w-xl">
            Let&apos;s turn ideas into clear, useful, and engaging digital experiences.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground"
              >
                Start a Conversation <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            {email ? (
              <>
                <a
                  href={`mailto:${email}`}
                  className="rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Email Me
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(email);
                    toast.success("Email copied to clipboard");
                  }}
                  className="inline-flex items-center gap-2 px-2 py-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" /> {email}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
