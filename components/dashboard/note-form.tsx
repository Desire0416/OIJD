"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addInternalNote } from "@/app/dashboard/dossiers/actions";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function NoteForm({ id }: { id: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (content.trim().length < 2) {
      setError("Note trop courte.");
      return;
    }
    const fd = new FormData();
    fd.set("id", id);
    fd.set("content", content);
    start(async () => {
      const res = await addInternalNote(fd);
      if (res.ok) {
        setContent("");
        setError(null);
        router.refresh();
      } else {
        setError(res.error ?? "Erreur.");
      }
    });
  }

  return (
    <div className="mt-4">
      <Textarea
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ajouter une observation interne..."
      />
      {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : null}
      <div className="mt-2 flex justify-end">
        <Button size="sm" onClick={submit} loading={pending} icon="Plus">
          Ajouter la note
        </Button>
      </div>
    </div>
  );
}
