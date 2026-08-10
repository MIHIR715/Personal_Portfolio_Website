import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getPublicProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data: input }) => {
    const supabase = publicClient();
    const [{ data: project }, { data: all }] = await Promise.all([
      supabase.from("projects").select("*").eq("slug", input.slug).eq("published", true).maybeSingle(),
      supabase
        .from("projects")
        .select("title,slug,subtitle,thumbnail_url")
        .eq("published", true)
        .order("display_order", { ascending: true }),
    ]);
    return { project: project ?? null, all: all ?? [] };
  });

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [settings, skills, education, experience, socials] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("skills").select("*").order("display_order"),
    supabase.from("education").select("*").order("display_order"),
    supabase.from("experience").select("*").order("display_order"),
    supabase.from("social_links").select("*").order("display_order"),
  ]);
  return {
    settings: settings.data ?? null,
    skills: skills.data ?? [],
    education: education.data ?? [],
    experience: experience.data ?? [],
    socials: socials.data ?? [],
  };
});
