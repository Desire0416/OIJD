import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export function EmptyState({
  icon = "Inbox",
  title,
  description,
  children,
  className,
}: {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-ojid-gray bg-ojid-gray/30 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ojid-green shadow-sm">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-md text-sm text-muted">{description}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
