"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeSubmissionStatus } from "@/app/dashboard/dossiers/actions";
import { SUBMISSION_ACTIONS } from "@/lib/constants";
import { Label, Select, Textarea, Checkbox } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const EMAIL_STATUSES = new Set<string>(
  SUBMISSION_ACTIONS.filter((a) => a.emailTemplate).map((a) => a.status),
);

export function DecisionPanel({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(
    SUBMISSION_ACTIONS.find((a) => a.status === currentStatus)?.status ??
      SUBMISSION_ACTIONS[0].status,
  );
  const [comment, setComment] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const emailAvailable = EMAIL_STATUSES.has(status);

  function apply() {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", status);
    fd.set("comment", comment);
    fd.set("sendEmail", sendEmail && emailAvailable ? "on" : "");
    start(async () => {
      const res = await changeSubmissionStatus(fd);
      setMsg({ ok: res.ok, text: res.ok ? "Statut mis a jour." : res.error ?? "Erreur." });
      if (res.ok) {
        setComment("");
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-2xl border border-ojid-gray bg-white p-5 shadow-card">
      <h3 className="flex items-center gap-2 font-heading font-bold text-ink">
        <Icon name="Flag" size={18} className="text-ojid-orange" />
        Decision & traitement
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="decision-status">Nouveau statut</Label>
          <Select
            id="decision-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {SUBMISSION_ACTIONS.map((a) => (
              <option key={a.status} value={a.status}>
                {a.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="decision-comment">Commentaire / prochaine etape</Label>
          <Textarea
            id="decision-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optionnel - inclus dans l'email si envoye."
          />
        </div>
        <Checkbox
          checked={sendEmail}
          disabled={!emailAvailable}
          onChange={(e) => setSendEmail(e.target.checked)}
          label={
            emailAvailable
              ? "Envoyer l'email automatique correspondant"
              : "Aucun email automatique pour ce statut"
          }
        />
        {msg ? (
          <p
            className={`flex items-center gap-1.5 text-sm font-medium ${msg.ok ? "text-ojid-green" : "text-red-600"}`}
          >
            <Icon name={msg.ok ? "CheckCircle2" : "AlertTriangle"} size={15} />
            {msg.text}
          </p>
        ) : null}
        <Button onClick={apply} loading={pending} className="w-full" icon="Check">
          Appliquer la decision
        </Button>
        <p className="text-center text-xs text-muted">
          La presynthese est une aide ; la decision reste humaine.
        </p>
      </div>
    </div>
  );
}
