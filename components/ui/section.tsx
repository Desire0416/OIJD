import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  muted = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", muted && "bg-ojid-gray/40", className)}
    >
      {children}
    </section>
  );
}
