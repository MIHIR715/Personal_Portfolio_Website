import { ScrollReveal } from "@/components/ScrollReveal";
import { CORE_COMPETENCIES, PROCESS_STAGES, type Education, type Skill, type SiteSettings } from "@/lib/types";
import { SectionHeading } from "@/components/SectionHeading";

export function Intro({ settings }: { settings: SiteSettings | null }) {
  return (
    <section className="container-page py-24 md:py-32">
      <ScrollReveal>
        <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">Introduction</p>
            <h2 className="display-lg text-foreground">A designer who thinks beyond pixels.</h2>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <p className="body-lead">
              I focus on designing digital experiences that balance user needs, business goals,
              visual clarity, interaction, accessibility, and technical feasibility.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {settings?.philosophy ??
                "My Computer Engineering background gives me frontend awareness in React.js and Tailwind CSS, which helps me make implementation-aware design decisions and collaborate effectively with developers."}
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {["User needs", "Business goals", "Visual clarity", "Interaction", "Accessibility", "Feasibility"].map(
                (i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {i}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="container-page scroll-mt-24 py-24 md:py-32">
      <SectionHeading
        eyebrow="Process"
        title="How I Design"
        subtitle="A repeatable way of moving from an unclear problem to an interface that works."
      />
      <div className="mt-14">
        {PROCESS_STAGES.map((stage, i) => (
          <ScrollReveal key={stage.no} delay={i * 0.05}>
            <div className="grid grid-cols-1 items-baseline gap-3 border-b border-border py-8 md:grid-cols-12 md:gap-8">
              <span className="font-serif text-3xl text-accent md:col-span-2">{stage.no}</span>
              <h3 className="text-2xl font-medium tracking-tight text-foreground md:col-span-4">
                {stage.title}
              </h3>
              <p className="text-base text-muted-foreground md:col-span-6">{stage.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="container-page scroll-mt-24 py-24 md:py-32">
      <SectionHeading
        eyebrow="Capabilities"
        title="Skills & tools"
        subtitle="The toolkit I use to research, design, prototype, and hand off interfaces."
      />
      <div className="mt-14 space-y-10">
        {Object.entries(grouped).map(([category, items], i) => (
          <ScrollReveal key={category} delay={i * 0.04}>
            <div className="grid gap-4 border-b border-border pb-8 md:grid-cols-12">
              <p className="eyebrow md:col-span-3 md:pt-2">{category}</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-9">
                {items.map((s) => (
                  <li
                    key={s.id}
                    className="text-xl font-medium tracking-tight text-foreground transition-colors hover:text-accent md:text-2xl"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-14">
          <p className="eyebrow mb-5">Core competencies</p>
          <ul className="flex flex-wrap gap-2">
            {CORE_COMPETENCIES.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function EducationTimeline({ education }: { education: Education[] }) {
  if (education.length === 0) return null;
  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeading eyebrow="Background" title="Education" />
      <div className="mt-12">
        {education.map((e, i) => (
          <ScrollReveal key={e.id} delay={i * 0.05}>
            <div className="grid gap-2 border-b border-border py-7 md:grid-cols-12 md:gap-8">
              <p className="eyebrow md:col-span-3 md:pt-1.5">
                {[e.start_date, e.end_date].filter(Boolean).join(" – ")}
              </p>
              <div className="md:col-span-6">
                <h3 className="text-lg font-semibold text-foreground">{e.degree}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.institution}</p>
                {e.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                ) : null}
              </div>
              {e.grade ? (
                <p className="text-sm text-foreground md:col-span-3 md:text-right">{e.grade}</p>
              ) : null}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
