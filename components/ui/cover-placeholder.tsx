import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const GRADIENTS = [
  "from-ojid-green to-ojid-green-dark",
  "from-ojid-orange to-ojid-flame",
  "from-ojid-green-dark via-ojid-green to-ojid-bluegray",
  "from-ojid-bluegray to-ojid-green",
  "from-ojid-flame to-ojid-orange",
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Visuel de remplacement (branded) lorsqu'aucune image n'est fournie. */
export function CoverPlaceholder({
  seed = "oijd",
  icon = "Newspaper",
  className,
}: {
  seed?: string;
  icon?: string;
  className?: string;
}) {
  const grad = GRADIENTS[hash(seed) % GRADIENTS.length];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        grad,
        className,
      )}
    >
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <Icon name={icon} className="relative text-white/90" size={40} />
    </div>
  );
}
