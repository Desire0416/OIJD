import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  eyebrowIcon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="eyebrow">
          {eyebrowIcon ? <Icon name={eyebrowIcon} size={15} /> : null}
          {eyebrow}
        </span>
      ) : null}
      <Tag className="mt-3 text-3xl font-bold leading-tight text-balance md:text-[2.5rem]">
        {title}
      </Tag>
      {description ? (
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
