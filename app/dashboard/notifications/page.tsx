import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dash-auth";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDateTime } from "@/lib/utils";
import { markAllNotificationsRead } from "../actions";

export const dynamic = "force-dynamic";

const ICONS: Record<string, string> = {
  NEW_SUBMISSION: "Inbox",
  CONTACT_MESSAGE: "Mail",
  STATUS_CHANGE: "Flag",
  CONTENT_REVIEW: "FileCheck2",
  DEADLINE: "Clock",
};

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 60,
  });
  const unread = notifications.filter((n) => !n.readAt).length;

  return (
    <>
      <PageTitle title="Notifications" description={`${unread} non lue(s).`}>
        {unread > 0 ? (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="outline" size="sm" icon="CheckCheck">
              Tout marquer comme lu
            </Button>
          </form>
        ) : null}
      </PageTitle>

      {notifications.length > 0 ? (
        <Card className="p-0">
          <ul className="divide-y divide-ojid-gray">
            {notifications.map((n) => {
              const body = (
                <div
                  className={cn(
                    "flex items-start gap-3 px-5 py-4 transition-colors",
                    n.link ? "hover:bg-ojid-gray/30" : "",
                    !n.readAt ? "bg-ojid-green/[0.03]" : "",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      n.readAt ? "bg-ojid-gray text-muted" : "bg-ojid-green/10 text-ojid-green",
                    )}
                  >
                    <Icon name={ICONS[n.type] ?? "Bell"} size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {n.title}
                      {!n.readAt ? (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-ojid-orange align-middle" />
                      ) : null}
                    </p>
                    <p className="text-sm text-muted">{n.message}</p>
                    <p className="mt-0.5 text-xs text-muted">{formatDateTime(n.createdAt)}</p>
                  </div>
                </div>
              );
              return (
                <li key={n.id}>
                  {n.link ? <Link href={n.link}>{body}</Link> : body}
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <EmptyState icon="BellOff" title="Aucune notification" description="Vous etes a jour." />
      )}
    </>
  );
}
