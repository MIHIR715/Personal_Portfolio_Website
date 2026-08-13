import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Field, inputClass } from "@/components/admin/ui";
import { ImageUpload, MultiImageUpload } from "@/components/admin/ImageUpload";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — ML Studio" }, { name: "robots", content: "noindex" }] }),
  component: ProjectsAdmin,
});

type Draft = Partial<Project> & { title: string; slug: string };

const empty: Draft = {
  title: "",
  slug: "",
  subtitle: "",
  category: "",
  tags: [],
  tools: [],
  short_description: "",
  description: "",
  year: "",
  role: "",
  thumbnail_url: null,
  hero_image_url: null,
  gallery: [],
  problem: "",
  goal: "",
  research: "",
  user_flow: [],
  wireframes: [],
  design_exploration: [],
  design_system: "",
  final_ui: [],
  prototype_url: "",
  outcome: "",
  learnings: "",
  seo_title: "",
  seo_description: "",
  published: true,
  featured: false,
  display_order: 0,
};

const list = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function ProjectsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as Project[];
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = { ...d };
      delete (payload as Record<string, unknown>)["created_at"];
      delete (payload as Record<string, unknown>)["updated_at"];
      if (d.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", d.id);
        if (error) throw new Error(error.message);
      } else {
        delete (payload as Record<string, unknown>)["id"];
        const { error } = await supabase.from("projects").insert(payload as never);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Project saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Project deleted");
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  if (draft) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.title.trim() || !draft.slug.trim()) {
            toast.error("Title and slug are required");
            return;
          }
          save.mutate(draft);
        }}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="display-md text-foreground">{draft.id ? "Edit project" : "New project"}</h1>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save project"}
            </Btn>
          </div>
        </div>

        <Card className="space-y-5">
          <p className="eyebrow">Basics</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setDraft((d) =>
                    d
                      ? {
                          ...d,
                          title,
                          slug: d.id
                            ? d.slug
                            : title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, ""),
                        }
                      : d,
                  );
                }}
              />
            </Field>
            <Field label="Slug">
              <input className={inputClass} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
            </Field>
            <Field label="Subtitle">
              <input
                className={inputClass}
                value={draft.subtitle ?? ""}
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={draft.category ?? ""}
                onChange={(e) => set("category", e.target.value)}
              />
            </Field>
            <Field label="Tags (comma separated)">
              <input
                className={inputClass}
                value={(draft.tags ?? []).join(", ")}
                onChange={(e) => set("tags", list(e.target.value))}
              />
            </Field>
            <Field label="Tools (comma separated)">
              <input
                className={inputClass}
                value={(draft.tools ?? []).join(", ")}
                onChange={(e) => set("tools", list(e.target.value))}
              />
            </Field>
            <Field label="Year">
              <input
                className={inputClass}
                value={draft.year ?? ""}
                onChange={(e) => set("year", e.target.value)}
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={draft.role ?? ""}
                onChange={(e) => set("role", e.target.value)}
              />
            </Field>
            <Field label="Display order">
              <input
                type="number"
                className={inputClass}
                value={draft.display_order ?? 0}
                onChange={(e) => set("display_order", Number(e.target.value))}
              />
            </Field>
            <Field label="Figma prototype URL">
              <input
                className={inputClass}
                value={draft.prototype_url ?? ""}
                onChange={(e) => set("prototype_url", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Short description">
            <textarea
              rows={2}
              className={inputClass}
              value={draft.short_description ?? ""}
              onChange={(e) => set("short_description", e.target.value)}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              className={inputClass}
              value={draft.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={!!draft.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={!!draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
          </div>
        </Card>

        <Card className="space-y-6">
          <p className="eyebrow">Images</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              label="Thumbnail"
              value={draft.thumbnail_url ?? null}
              onChange={(url) => set("thumbnail_url", url)}
            />
            <ImageUpload
              label="Hero image"
              value={draft.hero_image_url ?? null}
              onChange={(url) => set("hero_image_url", url)}
            />
          </div>
          <MultiImageUpload
            label="Gallery"
            value={draft.gallery ?? []}
            onChange={(urls) => set("gallery", urls)}
          />
          <MultiImageUpload
            label="User flow"
            value={draft.user_flow ?? []}
            onChange={(urls) => set("user_flow", urls)}
          />
          <MultiImageUpload
            label="Wireframes"
            value={draft.wireframes ?? []}
            onChange={(urls) => set("wireframes", urls)}
          />
          <MultiImageUpload
            label="Design exploration"
            value={draft.design_exploration ?? []}
            onChange={(urls) => set("design_exploration", urls)}
          />
          <MultiImageUpload
            label="Final UI"
            value={draft.final_ui ?? []}
            onChange={(urls) => set("final_ui", urls)}
          />
        </Card>

        <Card className="space-y-5">
          <p className="eyebrow">Case study</p>
          {(
            [
              ["problem", "Problem"],
              ["goal", "Goal"],
              ["research", "Research"],
              ["design_system", "Design system"],
              ["outcome", "Outcome"],
              ["learnings", "Learnings"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <textarea
                rows={3}
                className={inputClass}
                value={(draft[key] as string | null) ?? ""}
                onChange={(e) => set(key, e.target.value as never)}
              />
            </Field>
          ))}
        </Card>

        <Card className="space-y-4">
          <p className="eyebrow">SEO</p>
          <Field label="SEO title">
            <input
              className={inputClass}
              value={draft.seo_title ?? ""}
              onChange={(e) => set("seo_title", e.target.value)}
            />
          </Field>
          <Field label="SEO description">
            <textarea
              rows={2}
              className={inputClass}
              value={draft.seo_description ?? ""}
              onChange={(e) => set("seo_description", e.target.value)}
            />
          </Field>
        </Card>

        <div className="flex justify-end gap-2 pb-10">
          <Btn variant="ghost" onClick={() => setDraft(null)}>
            Cancel
          </Btn>
          <Btn type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save project"}
          </Btn>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Case studies</p>
          <h1 className="display-md mt-3 text-foreground">Projects</h1>
        </div>
        <Btn onClick={() => setDraft({ ...empty, display_order: projects.length })}>
          <Plus className="h-4 w-4" /> New project
        </Btn>
      </div>

      <div className="mt-8 space-y-3">
        {projects.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {p.thumbnail_url ? (
                  <img
                    src={p.thumbnail_url}
                    alt=""
                    className="h-14 w-20 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="h-14 w-20 rounded-lg border border-dashed border-border" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    /{p.slug} · {p.published ? "Published" : "Draft"}
                    {p.featured ? " · Featured" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setDraft(p)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Btn>
                <Btn variant="danger" onClick={() => remove.mutate(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
