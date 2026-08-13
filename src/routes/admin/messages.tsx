import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card } from "@/components/admin/ui";
import type { Message } from "@/lib/types";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — ML Studio" }, { name: "robots", content: "noindex" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const qc = useQueryClient();
  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Message[];
    },
  });

  const toggleRead = useMutation({
    mutationFn: async (m: Message) => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: !m.is_read })
        .eq("id", m.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Message deleted");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <p className="eyebrow">Inbox</p>
      <h1 className="display-md mt-3 text-foreground">Messages</h1>

      {messages.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {messages.map((m) => (
            <Card key={m.id} className={m.is_read ? "opacity-70" : ""}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {m.name}{" "}
                    <span className="font-normal text-muted-foreground">&lt;{m.email}&gt;</span>
                  </p>
                  {m.company ? (
                    <p className="text-xs text-muted-foreground">{m.company}</p>
                  ) : null}
                  <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm text-foreground">
                    {m.message}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Btn variant="ghost" onClick={() => toggleRead.mutate(m)}>
                    {m.is_read ? "Mark unread" : "Mark read"}
                  </Btn>
                  <Btn variant="danger" onClick={() => remove.mutate(m.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
