import { cn } from "@/lib/utils";

/**
 * Embleme compact OIJD : globe + flamme, inspire du logo officiel.
 * Utilise dans l'en-tete, le pied de page et le tableau de bord (ou le logo
 * complet en PNG serait trop haut). Le logo complet reste utilise sur l'accueil.
 */
export function BrandMark({
  size = 44,
  className,
  variant = "light",
}: {
  size?: number;
  className?: string;
  variant?: "light" | "dark";
}) {
  const gid = "flame-" + variant;
  const globeStroke = variant === "dark" ? "#CDE9D2" : "#719D96";
  const badgeFrom = variant === "dark" ? "#0B3D17" : "#ffffff";
  const badgeTo = variant === "dark" ? "#072A0F" : "#F2F7F2";
  const badgeStroke = variant === "dark" ? "rgba(255,255,255,.14)" : "#E3EAE4";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FB8204" />
          <stop offset="100%" stopColor="#FC5D01" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="42"
        height="42"
        rx="12"
        fill={`url(#badge-${variant})`}
      />
      <linearGradient id={`badge-${variant}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={badgeFrom} />
        <stop offset="100%" stopColor={badgeTo} />
      </linearGradient>
      <rect
        x="1"
        y="1"
        width="42"
        height="42"
        rx="12"
        fill="none"
        stroke={badgeStroke}
      />
      {/* Flamme */}
      <path
        d="M22 6 C 17.6 11.2, 20.6 14.6, 19.2 18 C 18.1 20.7, 25.8 20.9, 24.7 16.3 C 24 13.2, 25.4 10.4, 22 6 Z"
        fill={`url(#${gid})`}
      />
      <path
        d="M22 9.5 C 19.8 12.6, 21.4 14.8, 20.7 16.8 C 22.6 16.2, 23.3 13.8, 22 9.5 Z"
        fill="#FFD9B0"
        opacity="0.85"
      />
      {/* Globe */}
      <circle cx="22" cy="29" r="8.6" fill="none" stroke={globeStroke} strokeWidth="1.1" />
      <ellipse cx="22" cy="29" rx="3.4" ry="8.6" fill="none" stroke={globeStroke} strokeWidth="1" />
      <line x1="13.6" y1="29" x2="30.4" y2="29" stroke={globeStroke} strokeWidth="1" />
      <line x1="15" y1="24.2" x2="29" y2="24.2" stroke={globeStroke} strokeWidth="0.8" />
      <line x1="15" y1="33.8" x2="29" y2="33.8" stroke={globeStroke} strokeWidth="0.8" />
      <path
        d="M19 26 c 1.6 -0.6 3 0.4 3.8 1.4 c 0.8 1 2 1.2 2.6 2.4 c -1.4 1 -3.2 0.6 -4.4 -0.2 c -1.2 -0.8 -2.2 -2.2 -2 -3.6 Z"
        fill="#00860B"
        opacity="0.9"
      />
    </svg>
  );
}
