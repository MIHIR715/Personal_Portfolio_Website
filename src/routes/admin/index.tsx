import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Mail, Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — ML Studio" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

async function loadStats() {
  const [projects, published, featured, messages, unread, skills] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("skills").select("id", { count: "exact", head: true }),
  ]);
  return {
    projects: projects.count ?? 0,
    published: published.count ?? 0,
    featured: featured.count ?? 0,
    messages: messages.count ?? 0,
    unread: unread.count ?? 0,
    skills: skills.count ?? 0,
  };
}

function Dashboard() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: loadStats });

  const stats = [
    { label: "Projects", value: data?.projects, icon: FolderOpen, sub: `${data?.published ?? 0} published` },
    { label: "Featured", value: data?.featured, icon: Star, sub: "on homepage" },
    { label: "Messages", value: data?.messages, icon: Mail, sub: `${data?.unread ?? 0} unread` },
    { label: "Skills", value: data?.skills, icon: Sparkles, sub: "listed" },
  ];

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="display-md mt-3 text-foreground">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <s.icon className="h-4 w-4 text-accent" />
            <p className="mt-4 text-3xl font-medium tracking-tight text-foreground">
              {s.value ?? "—"}
            </p>
            <p className="mt-1 text-sm text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/admin/projects"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Manage projects
        </Link>
        <Link
          to="/admin/content"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground"
        >
          Edit site content
        </Link>
        <Link
          to="/admin/messages"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground"
        >
          View messages
        </Link>
      </div>
    </div>
  );
}
