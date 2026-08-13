import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Field, inputClass } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Education, Experience, SiteSettings, Skill, SocialLink } from "@/lib/types";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Content — ML Studio" }, { name: "robots", content: "noindex" }] }),
  component: ContentAdmin,
});

const tabs = ["Site", "Skills", "Experience", "Education", "Social"] as const;
type Tab = (typeof tabs)[number];

function ContentAdmin() {
  const [tab, setTab] = useState<Tab>("Site");

  return (
    <div>
      <p className="eyebrow">Site content</p>
      <h1 className="display-md mt-3 text-foreground">Content</h1>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "Site" ? <SiteTab /> : null}
        {tab === "Skills" ? <SkillsTab /> : null}
        {tab === "Experience" ? <ExperienceTab /> : null}
        {tab === "Education" ? <EducationTab /> : null}
        {tab === "Social" ? <SocialTab /> : null}
      </div>
    </div>
  );
}

function SiteTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      return (data ?? null) as SiteSettings | null;
    },
  });
  const [form, setForm] = useState<SiteSettings | null>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (s: SiteSettings) => {
      const { id, ...rest } = s;
      const { error } = await supabase.from("site_settings").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!form) return <p className="text-muted-foreground">Loading…</p>;

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const text: [keyof SiteSettings, string][] = [
    ["name", "Name"],
    ["professional_title", "Professional title"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["location", "Location"],
    ["availability", "Availability"],
  ];
  const areas: [keyof SiteSettings, string][] = [
    ["hero_headline", "Hero headline"],
    ["hero_description", "Hero description"],
    ["about_text", "About text"],
    ["philosophy", "Philosophy"],
  ];

  return (
    <Card className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {text.map(([k, label]) => (
          <Field key={k} label={label}>
            <input
              className={inputClass}
              value={(form[k] as string | null) ?? ""}
              onChange={(e) => set(k, e.target.value as never)}
            />
          </Field>
        ))}
      </div>
      {areas.map(([k, label]) => (
        <Field key={k} label={label}>
          <textarea
            rows={3}
            className={inputClass}
            value={(form[k] as string | null) ?? ""}
            onChange={(e) => set(k, e.target.value as never)}
          />
        </Field>
      ))}
      <div className="grid gap-6 sm:grid-cols-2">
        <ImageUpload
          label="Avatar"
          folder="site"
          value={form.avatar_url}
          onChange={(url) => set("avatar_url", url)}
        />
        <ImageUpload
          label="Resume (PDF)"
          folder="site"
          accept="application/pdf"
          value={form.resume_url}
          onChange={(url) => set("resume_url", url)}
        />
      </div>
      <div className="flex justify-end">
        <Btn onClick={() => save.mutate(form)} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Btn>
      </div>
    </Card>
  );
}

function useCrud<T extends { id: string }>(table: "skills" | "experience" | "education" | "social_links", key: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("display_order");
      if (error) throw new Error(error.message);
      return (data ?? []) as T[];
    },
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: [key] });
  const upsert = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      if (row["id"]) {
        const { id, ...rest } = row;
        const { error } = await supabase.from(table).update(rest as never).eq("id", id as string);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from(table).insert(row as never);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return { rows: query.data ?? [], upsert, remove };
}

function SkillsTab() {
  const { rows, upsert, remove } = useCrud<Skill>("skills", "admin-skills");
  const [draft, setDraft] = useState({ category: "", name: "" });

  return (
    <div className="space-y-4">
      <Card className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Category">
          <input
            className={inputClass}
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
        </Field>
        <Field label="Skill">
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </Field>
        <Btn
          onClick={() => {
            if (!draft.name.trim() || !draft.category.trim()) return toast.error("Fill both fields");
            upsert.mutate({ ...draft, display_order: rows.length });
            setDraft({ category: draft.category, name: "" });
          }}
        >
          <Plus className="h-4 w-4" /> Add
        </Btn>
      </Card>
      <Card className="flex flex-wrap gap-2">
        {rows.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-foreground"
          >
            <span className="text-muted-foreground">{s.category}:</span> {s.name}
            <button type="button" aria-label="Delete skill" onClick={() => remove.mutate(s.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          </span>
        ))}
      </Card>
    </div>
  );
}

function ExperienceTab() {
  const { rows, upsert, remove } = useCrud<Experience>("experience", "admin-experience");
  const blank = { title: "", organization: "", start_date: "", end_date: "", description: "" };
  const [draft, setDraft] = useState<Record<string, unknown>>(blank);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["title", "organization", "start_date", "end_date"] as const).map((k) => (
            <Field key={k} label={k.replace("_", " ")}>
              <input
                className={inputClass}
                value={(draft[k] as string) ?? ""}
                onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <Field label="Description">
          <textarea
            rows={3}
            className={inputClass}
            value={(draft["description"] as string) ?? ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </Field>
        <div className="flex justify-end gap-2">
          {draft["id"] ? (
            <Btn variant="ghost" onClick={() => setDraft(blank)}>
              Cancel
            </Btn>
          ) : null}
          <Btn
            onClick={() => {
              if (!String(draft["title"] ?? "").trim()) return toast.error("Title is required");
              upsert.mutate({ ...draft, display_order: draft["display_order"] ?? rows.length });
              setDraft(blank);
            }}
          >
            {draft["id"] ? "Update" : "Add"}
          </Btn>
        </div>
      </Card>
      {rows.map((r) => (
        <Card key={r.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">
                {r.organization} · {r.start_date} – {r.end_date}
              </p>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{r.description}</p>
            </div>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setDraft(r as unknown as Record<string, unknown>)}>
                Edit
              </Btn>
              <Btn variant="danger" onClick={() => remove.mutate(r.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EducationTab() {
  const { rows, upsert, remove } = useCrud<Education>("education", "admin-education");
  const blank = {
    institution: "",
    degree: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
  };
  const [draft, setDraft] = useState<Record<string, unknown>>(blank);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["institution", "degree", "start_date", "end_date", "grade"] as const).map((k) => (
            <Field key={k} label={k.replace("_", " ")}>
              <input
                className={inputClass}
                value={(draft[k] as string) ?? ""}
                onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <Field label="Description">
          <textarea
            rows={2}
            className={inputClass}
            value={(draft["description"] as string) ?? ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </Field>
        <div className="flex justify-end gap-2">
          {draft["id"] ? (
            <Btn variant="ghost" onClick={() => setDraft(blank)}>
              Cancel
            </Btn>
          ) : null}
          <Btn
            onClick={() => {
              if (!String(draft["institution"] ?? "").trim())
                return toast.error("Institution is required");
              upsert.mutate({ ...draft, display_order: draft["display_order"] ?? rows.length });
              setDraft(blank);
            }}
          >
            {draft["id"] ? "Update" : "Add"}
          </Btn>
        </div>
      </Card>
      {rows.map((r) => (
        <Card key={r.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">{r.institution}</p>
              <p className="text-xs text-muted-foreground">
                {r.degree} · {r.start_date} – {r.end_date} {r.grade ? `· ${r.grade}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setDraft(r as unknown as Record<string, unknown>)}>
                Edit
              </Btn>
              <Btn variant="danger" onClick={() => remove.mutate(r.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SocialTab() {
  const { rows, upsert, remove } = useCrud<SocialLink>("social_links", "admin-social");
  const [draft, setDraft] = useState({ platform: "", url: "" });

  return (
    <div className="space-y-4">
      <Card className="grid gap-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
        <Field label="Platform">
          <input
            className={inputClass}
            value={draft.platform}
            onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
          />
        </Field>
        <Field label="URL">
          <input
            className={inputClass}
            value={draft.url}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
          />
        </Field>
        <Btn
          onClick={() => {
            if (!draft.platform.trim() || !draft.url.trim()) return toast.error("Fill both fields");
            upsert.mutate({ ...draft, display_order: rows.length });
            setDraft({ platform: "", url: "" });
          }}
        >
          <Plus className="h-4 w-4" /> Add
        </Btn>
      </Card>
      <Card className="space-y-2">
        {rows.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-foreground">{s.platform}</span>
            <span className="truncate text-muted-foreground">{s.url}</span>
            <button type="button" aria-label="Delete link" onClick={() => remove.mutate(s.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
