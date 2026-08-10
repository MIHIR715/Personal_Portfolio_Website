import { ScrollReveal } from "./ScrollReveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  aside,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
}) {
  return (
    <ScrollReveal>
      <div className="flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          <h2 className="display-md text-foreground">{title}</h2>
          {subtitle ? <p className="body-lead mt-4">{subtitle}</p> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </ScrollReveal>
  );
}
