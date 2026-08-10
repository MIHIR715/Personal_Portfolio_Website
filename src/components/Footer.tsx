import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import type { SiteSettings, SocialLink } from "@/lib/types";

export function Footer({
  settings,
  socials,
}: {
  settings: SiteSettings | null;
  socials: SocialLink[];
}) {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {settings?.name ?? "Mihirkumar Lad"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {settings?.professional_title ??
                "UI/UX Designer · Interaction Designer · Figma Specialist"}
            </p>
            {settings?.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="link-underline mt-5 inline-block text-sm text-foreground"
              >
                {settings.email}
              </a>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="eyebrow mb-4">Pages</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/work" className="link-underline hover:text-foreground">
                    Work
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="link-underline hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/" hash="process" className="link-underline hover:text-foreground">
                    Process
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="link-underline hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/resume" className="link-underline hover:text-foreground">
                    Resume
                  </Link>
                </li>
              </ul>
            </div>
            {socials.length > 0 ? (
              <div>
                <p className="eyebrow mb-4">Elsewhere</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {socials.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-underline hover:text-foreground"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div>
              <p className="eyebrow mb-4">Based in</p>
              <p className="text-sm text-muted-foreground">
                {settings?.location ?? "India"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings?.name ?? "Mihirkumar Lad"}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-foreground transition-opacity hover:opacity-70"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
