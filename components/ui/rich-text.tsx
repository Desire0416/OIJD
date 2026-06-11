import { cn } from "@/lib/utils";

/**
 * Rendu simple de texte multi-paragraphes (contenus saisis en clair).
 * - Double saut de ligne => nouveau paragraphe.
 * - Une ligne commencant par "- " dans un bloc => liste a puces.
 */
export function RichText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={cn("prose-oijd", className)}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^[-•]\s+/.test(l.trim()));
        if (isList) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^[-•]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {l}
                {j < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
