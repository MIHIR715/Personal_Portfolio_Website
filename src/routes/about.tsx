import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/public.functions";
import type { Education, Experience, Skill, SiteSettings } from "@/lib/types";
import { EducationTimeline, Skills } from "@/sections/Sections";
import { ContactCta, ResumeCta } from "@/sections/Cta";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/about")({
  loader: async () => await getSiteData(),
  head: () => ({
    meta: [
      { title: "About — Mihirkumar Lad, UI/UX Designer" },
      {
        name: "description",
        content:
          "Mihirkumar Lad is a UI/UX and interaction designer with a Computer Engineering background, designing accessible interfaces and design systems in Figma.",
      },
      { property: "og:title", content: "About — Mihirkumar Lad, UI/UX Designer" },
      {
        property: "og:description",
        content:
          "Design philosophy, skills, technical awareness and education of UI/UX designer Mihirkumar Lad.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const site = Route.useLoaderData();
  const settings = site.settings as SiteSettings | null;
  const experience = site.experience as Experience[];

  return (
    <div>
      <div className="container-page pt-32 md:pt-40">
        <p className="eyebrow">About</p>
        <h1 className="display-lg mt-5 max-w-3xl text-foreground">
          {settings?.name ?? "Mihirkumar Lad"}
        </h1>
        <p className="body-lead mt-4">{settings?.professional_title}</p>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface">
              {settings?.avatar_url ? (
                <img
                  src={settings.avatar_url}
                  alt="Portrait of Mihirkumar Lad"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid aspect-[4/5] place-items-center">
                  <span className="font-serif text-6xl text-muted-foreground/50">ML</span>
                </div>
              )}
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {settings?.location ? (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="text-foreground">{settings.location}</dd>
                </div>
              ) : null}
              {settings?.email ? (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${settings.email}`} className="link-underline text-foreground">
                      {settings.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {settings?.phone ? (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="text-foreground">{settings.phone}</dd>
                </div>
              ) : null}
            </dl>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7">
            <h2 className="display-md text-foreground">A designer who thinks beyond pixels.</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              {(settings?.about_text ?? "").split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {settings?.philosophy ? (
              <blockquote className="mt-10 border-l-2 border-accent pl-6">
                <p className="font-serif text-2xl leading-snug text-foreground">
                  {settings.philosophy}
                </p>
              </blockquote>
            ) : null}
          </ScrollReveal>
        </div>
      </div>

      {experience.length > 0 ? (
        <section className="container-page py-24">
          <SectionHeading eyebrow="Experience" title="Where I've worked" />
          <div className="mt-12">
            {experience.map((e) => (
              <div key={e.id} className="grid gap-2 border-b border-border py-7 md:grid-cols-12">
                <p className="eyebrow md:col-span-3 md:pt-1.5">
                  {[e.start_date, e.end_date].filter(Boolean).join(" – ")}
                </p>
                <div className="md:col-span-9">
                  <h3 className="text-lg font-semibold text-foreground">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.organization}</p>
                  {e.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Skills skills={site.skills as Skill[]} />
      <EducationTimeline education={site.education as Education[]} />
      <ResumeCta settings={settings} />
      <ContactCta settings={settings} />
    </div>
  );
}
