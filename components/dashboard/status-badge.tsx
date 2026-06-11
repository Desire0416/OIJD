import { Badge } from "@/components/ui/badge";
import {
  ACTIVITY_STATUS_META,
  DOCUMENT_VISIBILITY_META,
  OPPORTUNITY_STATUS_META,
  PUBLISH_STATUS_META,
  ROLE_META,
  SUBMISSION_STATUS_META,
  USER_STATUS_META,
  type Tone,
} from "@/lib/constants";

type Kind =
  | "submission"
  | "opportunity"
  | "publish"
  | "activity"
  | "user"
  | "document"
  | "role";

const MAPS: Record<Kind, Record<string, { label: string; tone: Tone }>> = {
  submission: SUBMISSION_STATUS_META,
  opportunity: OPPORTUNITY_STATUS_META,
  publish: PUBLISH_STATUS_META,
  activity: ACTIVITY_STATUS_META,
  user: USER_STATUS_META,
  document: DOCUMENT_VISIBILITY_META,
  role: ROLE_META,
};

export function StatusBadge({
  kind,
  value,
  dot = true,
}: {
  kind: Kind;
  value: string;
  dot?: boolean;
}) {
  const meta = MAPS[kind]?.[value];
  if (!meta) return <Badge tone="gray">{value}</Badge>;
  return (
    <Badge tone={meta.tone} dot={dot}>
      {meta.label}
    </Badge>
  );
}
