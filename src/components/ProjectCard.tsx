import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface p-8 text-center">
      <span className="font-serif text-4xl text-muted-foreground/60">{title.charAt(0)}</span>
      <span className="eyebrow">Image coming soon</span>
    </div>
  );
}

export function ProjectVisual({
  project,
  ratio = "aspect-[4/3]",
}: {
  project: Project;
  ratio?: string;
}) {
  const src = project.thumbnail_url || project.hero_image_url;
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-border bg-surface ${ratio}`}
    >
      {src ? (
        <motion.img
          src={src}
          alt={`${project.title} — ${project.subtitle ?? "project preview"}`}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.035 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <Placeholder title={project.title} />
      )}
    </div>
  );
}

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const wide = index % 3 === 2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        data-cursor="View"
        className="block focus-visible:outline-none"
      >
        <div
          className={`grid items-center gap-8 ${wide ? "" : "lg:grid-cols-12"} ${
            flip && !wide ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className={wide ? "" : "lg:col-span-7"}>
            <ProjectVisual project={project} ratio={wide ? "aspect-[16/8]" : "aspect-[4/3]"} />
          </div>
          <div className={wide ? "mt-6 lg:flex lg:items-end lg:justify-between lg:gap-10" : "lg:col-span-5"}>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">{project.category}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="eyebrow">{project.year}</span>
              </div>
              <h3 className="display-md mt-4 flex items-center gap-3 text-foreground">
                {project.title}
                <ArrowUpRight className="h-6 w-6 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p className="mt-1 text-base text-muted-foreground">{project.subtitle}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {project.short_description}
              </p>
            </div>
            <div className={`mt-6 flex flex-wrap gap-2 ${wide ? "lg:mt-0" : ""}`}>
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
      {project.prototype_url ? (
        <a
          href={project.prototype_url}
          target="_blank"
          rel="noreferrer noopener"
          className="link-underline mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
        >
          View Prototype ↗
        </a>
      ) : null}
    </motion.article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to="/work/$slug" params={{ slug: project.slug }} data-cursor="View" className="block">
        <ProjectVisual project={project} />
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{project.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="eyebrow">{project.category}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="eyebrow">{project.year}</span>
        </div>
      </Link>
    </motion.article>
  );
}
