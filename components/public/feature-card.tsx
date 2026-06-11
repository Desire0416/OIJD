import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export function FeatureCard({
  icon,
  title,
  description,
  accent = "green",
  className,
}: {
  icon: string;
  title: string;
  description: string;
  accent?: "green" | "orange";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group h-full rounded-2xl border border-ojid-gray bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          accent === "green"
            ? "bg-ojid-green/10 text-ojid-green"
            : "bg-ojid-orange/10 text-ojid-orange",
        )}
      >
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-heading text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
