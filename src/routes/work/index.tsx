import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getPublicProjects } from "@/lib/public.functions";
import { ProjectCard } from "@/components/ProjectCard";
import { WORK_FILTERS, type Project } from "@/lib/types";

export const Route = createFileRoute("/work/")({
  loader: async () => ({ projects: (await getPublicProjects()) as Project[] }),
  head: () => ({
    meta: [
      { title: "Work — Mihirkumar Lad, UI/UX Designer" },
      {
        name: "description",
        content:
          "Selected UI/UX case studies by Mihirkumar Lad: mobile product design, e-commerce redesigns, brand websites, and design systems built in Figma.",
      },
      { property: "og:title", content: "Work — Mihirkumar Lad, UI/UX Designer" },
      {
        property: "og:description",
        content: "Interfaces, products, and experiences designed and prototyped in Figma.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const { projects } = Route.useLoaderData() as { projects: Project[] };
  const [filter, setFilter] = useState<string>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <div className="container-page pt-32 md:pt-40">
      <p className="eyebrow">Work</p>
      <h1 className="display-lg mt-5 max-w-3xl text-foreground">Selected Work</h1>
      <p className="body-lead mt-5 max-w-xl">
        A collection of interfaces, products, and experiences I&apos;ve designed.
      </p>

      <div className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-2">
        {WORK_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-20 text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <motion.div layout className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
