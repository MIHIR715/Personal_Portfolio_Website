import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Max 100 characters"),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell me a bit more (min 10 characters)").max(2000),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const field =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus-visible:outline-none";

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof Errors] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setState("loading");
    const { error } = await supabase.from("messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      message: parsed.data.message,
    });
    if (error) {
      setState("idle");
      toast.error("Message could not be sent. Please try again or email me directly.");
      return;
    }
    setState("success");
    setValues({ name: "", email: "", company: "", message: "" });
    toast.success("Message sent — I'll get back to you soon.");
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-5 w-5" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-foreground">Message received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. I&apos;ll reply as soon as I can.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 rounded-full border border-border px-5 py-2 text-sm font-medium"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="eyebrow mb-2 block">
            Name *
          </label>
          <input
            id="cf-name"
            className={field}
            value={values.name}
            maxLength={100}
            aria-invalid={!!errors.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Your name"
          />
          {errors.name ? <p className="mt-1.5 text-xs text-destructive">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow mb-2 block">
            Email *
          </label>
          <input
            id="cf-email"
            type="email"
            className={field}
            value={values.email}
            maxLength={255}
            aria-invalid={!!errors.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="you@company.com"
          />
          {errors.email ? <p className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
        </div>
      </div>
      <div>
        <label htmlFor="cf-company" className="eyebrow mb-2 block">
          Company
        </label>
        <input
          id="cf-company"
          className={field}
          value={values.company}
          maxLength={120}
          onChange={(e) => setValues({ ...values, company: e.target.value })}
          placeholder="Optional"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="eyebrow mb-2 block">
          Message *
        </label>
        <textarea
          id="cf-message"
          rows={6}
          className={`${field} resize-none`}
          value={values.message}
          maxLength={2000}
          aria-invalid={!!errors.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder="What are you working on?"
        />
        <div className="mt-1.5 flex justify-between">
          <p className="text-xs text-destructive">{errors.message ?? ""}</p>
          <p className="text-xs text-muted-foreground">{values.message.length}/2000</p>
        </div>
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Start a Conversation
      </button>
    </form>
  );
}
