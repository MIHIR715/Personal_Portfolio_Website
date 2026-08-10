import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/public.functions";
import type { SiteSettings, SocialLink } from "@/lib/types";
import { ContactForm } from "@/components/ContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/contact")({
  loader: async () => await getSiteData(),
  head: () => ({
    meta: [
      { title: "Contact — Mihirkumar Lad, UI/UX Designer" },
      {
        name: "description",
        content:
          "Start a conversation with Mihirkumar Lad about UI/UX design, interaction design, product interfaces and Figma prototyping work.",
      },
      { property: "og:title", content: "Contact — Mihirkumar Lad, UI/UX Designer" },
      {
        property: "og:description",
        content: "Let's turn ideas into clear, useful, and engaging digital experiences.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const site = Route.useLoaderData() as {
    settings: SiteSettings | null;
    socials: SocialLink[];
  };
  const settings = site.settings;

  return (
    <div className="container-page pb-16 pt-32 md:pt-40">
      <p className="eyebrow">Contact</p>
      <h1 className="display-lg mt-5 max-w-3xl text-foreground">
        Have a product worth designing?
      </h1>
      <p className="body-lead mt-5 max-w-xl">
        Let&apos;s turn ideas into clear, useful, and engaging digital experiences.
      </p>

      <div className="mt-14 grid gap-12 border-t border-border pt-12 lg:grid-cols-12">
        <ScrollReveal className="lg:col-span-5">
          <div className="space-y-8">
            {settings?.email ? (
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="link-underline text-xl font-medium text-foreground"
                >
                  {settings.email}
                </a>
              </div>
            ) : null}
            {settings?.phone ? (
              <div>
                <p className="eyebrow mb-2">Phone</p>
                <a href={`tel:${settings.phone}`} className="text-xl font-medium text-foreground">
                  {settings.phone}
                </a>
              </div>
            ) : null}
            {settings?.location ? (
              <div>
                <p className="eyebrow mb-2">Location</p>
                <p className="text-xl font-medium text-foreground">{settings.location}</p>
              </div>
            ) : null}
            {site.socials.length > 0 ? (
              <div>
                <p className="eyebrow mb-3">Elsewhere</p>
                <ul className="flex flex-wrap gap-2">
                  {site.socials.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        {s.platform} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-7">
          <ContactForm />
        </ScrollReveal>
      </div>
    </div>
  );
}
