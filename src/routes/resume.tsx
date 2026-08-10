import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/public.functions";
import type { SiteSettings } from "@/lib/types";

export const Route = createFileRoute("/resume")({
  loader: async () => await getSiteData(),
  head: () => ({
    meta: [
      { title: "Resume — Mihirkumar Lad, UI/UX Designer" },
      {
        name: "description",
        content:
          "View and download the resume of Mihirkumar Lad — UI/UX designer, interaction designer and Figma specialist.",
      },
      { property: "og:title", content: "Resume — Mihirkumar Lad" },
      {
        property: "og:description",
        content: "Skills, projects and background of UI/UX designer Mihirkumar Lad.",
      },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const site = Route.useLoaderData() as { settings: SiteSettings | null };
  const url = site.settings?.resume_url;

  return (
    <div className="container-page pb-16 pt-32 md:pt-40">
      <p className="eyebrow">Resume</p>
      <h1 className="display-lg mt-5 text-foreground">Want the full picture?</h1>
      <p className="body-lead mt-5 max-w-xl">
        Take a closer look at my skills, projects, and background.
      </p>

      {url ? (
        <>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground"
            >
              Open in new tab
            </a>
            <a
              href={url}
              download
              className="rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Download Resume
            </a>
          </div>
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-surface">
            <object data={url} type="application/pdf" className="h-[80vh] w-full">
              <p className="p-10 text-sm text-muted-foreground">
                Your browser can&apos;t display PDFs inline.{" "}
                <a href={url} className="link-underline text-foreground">
                  Download the resume instead.
                </a>
              </p>
            </object>
          </div>
        </>
      ) : (
        <p className="mt-12 text-muted-foreground">No resume uploaded yet.</p>
      )}
    </div>
  );
}
