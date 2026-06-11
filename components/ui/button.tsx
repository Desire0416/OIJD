import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "soft" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ojid-orange text-white shadow-sm hover:bg-ojid-flame hover:shadow-glow active:translate-y-px",
  secondary:
    "bg-ojid-green text-white shadow-sm hover:bg-ojid-green-dark active:translate-y-px",
  outline:
    "border border-ojid-green/30 text-ojid-green bg-white hover:border-ojid-green hover:bg-ojid-green/5",
  ghost: "text-ink/80 hover:bg-ojid-gray/70 hover:text-ink",
  soft: "bg-ojid-green/10 text-ojid-green hover:bg-ojid-green/15",
  danger: "bg-red-600 text-white hover:bg-red-700 active:translate-y-px",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ojid-green/40 disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, icon, iconRight, loading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Icon name="Loader2" className="animate-spin" size={18} />
        ) : icon ? (
          <Icon name={icon} size={18} />
        ) : null}
        {children}
        {iconRight && !loading ? <Icon name={iconRight} size={18} /> : null}
      </button>
    );
  },
);
Button.displayName = "Button";
