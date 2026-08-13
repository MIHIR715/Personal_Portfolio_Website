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
  component: ContentAdmin;
});

function ContentAdmin() {
  return null;
}
