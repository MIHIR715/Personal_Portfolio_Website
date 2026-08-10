import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getPublicProjects, getSiteData } from "@/lib/public.functions";
import type { Education, Project, Skill, SiteSettings } from "@/lib/types";
import { Hero } from "@/sections/Hero";
import { Intro, Process, Skills, EducationTimeline } from "@/sections/Sections";
import { ContactCta, ResumeCta } from "@/sections/Cta";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectRow } from "@/components/ProjectCard";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [projects, site] = await Promise.all([getPublicProjects(), getSiteData()]);
    return { projects: projects as Project[], site };
  },
  head: () => ({
    meta: [
      { title: "Mihirkumar Lad — UI/UX Designer & Figma Specialist" },
      {
        name: "description",
        content:
          "Portfolio of Mihirkumar Lad — UI/UX and interaction designer crafting web and mobile product interfaces, design systems, and interactive Figma prototypes.",
      },
      { property: "og:title", content: "Mihirkumar Lad — UI/UX Designer & Figma Specialist" },
      {
        property: "og:description",
        content:
          "Selected UI/UX work: mobile apps, e-commerce redesigns, brand websites and design systems, prototyped end-to-end in Figma.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { projects, site } = Route.useLoaderData() as {
    projects: Project[];
    site: { settings: SiteSettings | null; skills: Skill[]; education: Education[] };
  };
  const settings = site.settings as SiteSettings | null;
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const list = featured.length > 0 ? featured : projects.slice(0, 4);

  return (
    <>
      <h1 className="sr-only">
        Mihirkumar Lad — UI/UX Designer, Interaction Designer, Figma Specialist
      </h1>
      <Hero settings={settings} />
      <Intro settings={settings} />

      <section id="work" className="container-page scroll-mt-24 py-8 md:py-16">
        <SectionHeading
          eyebrow="Work"
          title="Selected Work"
          subtitle="A collection of interfaces, products, and experiences I've designed."
          aside={
            <Link
              to="/work"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              All projects <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        {list.length === 0 ? (
          <p className="mt-14 text-muted-foreground">No projects published yet.</p>
        ) : (
          <div className="mt-16 space-y-24 md:space-y-32">
            {list.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <Process />
      <Skills skills={site.skills as Skill[]} />
      <EducationTimeline education={site.education as Education[]} />
      <ResumeCta settings={settings} />
      <ContactCta settings={settings} />
    </>
  );
}
