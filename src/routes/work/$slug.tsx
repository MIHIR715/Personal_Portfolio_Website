import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getProjectBySlug } from "@/lib/public.functions";
import type { Project } from "@/lib/types";
import { ScrollReveal } from "@/components/ScrollReveal";

type Brief = { title: string; slug: string; subtitle: string | null; thumbnail_url: string | null };

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const res = await getProjectBySlug({ data: { slug: params.slug } });
    if (!res.project) throw notFound();
    return { project: res.project as Project, all: res.all as Brief[] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    const title = p.seo_title || `${p.title} — ${p.subtitle ?? "Case Study"} | Mihirkumar Lad`;
    const description =
      p.seo_description || p.short_description || `${p.title} case study by Mihirkumar Lad.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  errorComponent: ProjectError,
  component: CaseStudy,
});

function ProjectNotFound() {
  return (
    <div className="container-page pt-40 pb-24">
      <h1 className="display-md text-foreground">Project not found</h1>
      <p className="body-lead mt-4">This case study doesn&apos;t exist or isn&apos;t published.</p>
      <Link to="/work" className="link-underline mt-6 inline-block text-sm font-medium">
        Back to all work
      </Link>
    </div>
  );
}

function ProjectError() {
  return (
    <div className="container-page pt-40 pb-24">
      <h1 className="display-md text-foreground">Couldn&apos;t load this case study</h1>
      <Link to="/work" className="link-underline mt-6 inline-block text-sm font-medium">
        Back to all work
      </Link>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function Block({
  title,
  body,
  placeholder,
}: {
  title: string;
  body: string | null;
  placeholder: string;
}) {
  return (
    <ScrollReveal>
      <div className="grid gap-4 border-t border-border py-10 md:grid-cols-12 md:gap-8">
        <h2 className="eyebrow md:col-span-3 md:pt-1">{title}</h2>
        <div className="md:col-span-9">
          {body ? (
            <div className="space-y-4">
              {body.split("\n\n").map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base italic text-muted-foreground/70">{placeholder}</p>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

function Gallery({ title, images }: { title: string; images: string[] }) {
  if (!images || images.length === 0) return null;
  return (
    <ScrollReveal>
      <div className="grid gap-4 border-t border-border py-10 md:grid-cols-12 md:gap-8">
        <h2 className="eyebrow md:col-span-3 md:pt-1">{title}</h2>
        <div className="grid gap-5 md:col-span-9">
          {images.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${title} ${i + 1}`}
              loading="lazy"
              className="w-full rounded-2xl border border-border bg-surface object-cover"
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function CaseStudy() {
  const { project, all } = Route.useLoaderData();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];
  const prev = all[(index - 1 + all.length) % all.length];

  return (
    <article className="pb-10">
      <header className="container-page pt-32 md:pt-40">
        <Link
          to="/work"
          className="link-underline inline-flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All work
        </Link>
        <p className="eyebrow mt-8">{project.category}</p>
        <h1 className="display-lg mt-4 max-w-4xl text-foreground">{project.title}</h1>
        <p className="body-lead mt-3">{project.subtitle}</p>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
          <Meta label="Year" value={project.year} />
          <Meta label="Role" value={project.role} />
          <Meta label="Tools" value={project.tools.join(", ") || null} />
          <Meta label="Category" value={project.category} />
        </div>

        {project.prototype_url ? (
          <a
            href={project.prototype_url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground"
          >
            View Prototype <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </header>

      <div className="container-page mt-14">
        {project.hero_image_url ? (
          <img
            src={project.hero_image_url}
            alt={`${project.title} hero`}
            className="w-full rounded-3xl border border-border object-cover"
          />
        ) : (
          <div className="grid aspect-[16/8] w-full place-items-center rounded-3xl border border-dashed border-border bg-surface">
            <p className="eyebrow">Hero image not added yet</p>
          </div>
        )}
      </div>

      <div className="container-page mt-16">
        <Block title="Overview" body={project.description} placeholder="Add an overview." />
        <Block title="Problem" body={project.problem} placeholder="Add the problem statement." />
        <Block title="Goal" body={project.goal} placeholder="Add the design goal." />
        <Block
          title="Research"
          body={project.research}
          placeholder="Add research findings when available."
        />
        <Gallery title="User Flow" images={project.user_flow} />
        <Gallery title="Wireframes" images={project.wireframes} />
        <Gallery title="Design Exploration" images={project.design_exploration} />
        <Block
          title="Design System"
          body={project.design_system}
          placeholder="Add typography, colors, and components."
        />
        <Gallery title="Final UI" images={project.final_ui} />
        <Gallery title="Gallery" images={project.gallery} />

        {project.prototype_url ? (
          <ScrollReveal>
            <div className="grid gap-4 border-t border-border py-10 md:grid-cols-12 md:gap-8">
              <h2 className="eyebrow md:col-span-3 md:pt-1">Prototype</h2>
              <div className="md:col-span-9">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <iframe
                    title={`${project.title} Figma prototype`}
                    src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(project.prototype_url)}`}
                    className="h-[420px] w-full md:h-[560px]"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <a
                  href={project.prototype_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                >
                  Open prototype in Figma ↗
                </a>
              </div>
            </div>
          </ScrollReveal>
        ) : null}

        <Block
          title="Outcome"
          body={project.outcome}
          placeholder="Add verified outcomes when available."
        />
        <Block title="Learnings" body={project.learnings} placeholder="Add learnings." />
      </div>

      {all.length > 1 ? (
        <nav
          aria-label="Project navigation"
          className="container-page mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              to="/work/$slug"
              params={{ slug: prev.slug }}
              className="group rounded-2xl border border-border p-6 transition-colors hover:bg-surface"
            >
              <span className="eyebrow inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3 w-3" /> Previous
              </span>
              <p className="mt-3 text-xl font-medium text-foreground">{prev.title}</p>
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              className="group rounded-2xl border border-border p-6 text-right transition-colors hover:bg-surface"
            >
              <span className="eyebrow inline-flex items-center gap-1.5">
                Next <ArrowRight className="h-3 w-3" />
              </span>
              <p className="mt-3 text-xl font-medium text-foreground">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
