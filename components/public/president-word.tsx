"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site-config";
import { initials } from "@/lib/utils";

export function PresidentWord() {
  const reduce = useReducedMotion();
  const p = siteConfig.president;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ojid-forest via-ojid-forest to-ojid-forest-deep text-white">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.07]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-ojid-orange/15 blur-3xl"
      />
      <div className="container-x relative grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[300px_1fr] lg:gap-14">
        {/* Photo (background-image : la vraie photo recouvre le placeholder une fois deposee) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[280px]"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-[1.75rem] border border-white/15" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-white/15 to-white/5 shadow-2xl ring-1 ring-white/20">
              {/* Placeholder (visible tant qu'aucune photo n'est deposee) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
                <Icon name="Users" size={54} />
                <span className="text-[11px] uppercase tracking-widest">
                  Photo du president
                </span>
              </div>
              {/* Photo officielle : public/brand/president.jpg */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${p.photo}')` }}
              />
            </div>
            <span className="absolute -bottom-4 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-ojid-orange text-white shadow-glow">
              <Icon name="Quote" size={22} />
            </span>
          </div>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ojid-orange-flame">
            <Icon name="Quote" size={14} />
            Le mot du president
          </span>

          <div className="mt-5 space-y-4">
            {p.message.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-heading text-xl font-semibold leading-snug text-white md:text-2xl"
                    : "leading-relaxed text-white/80"
                }
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-heading font-bold text-ojid-orange-flame">
              {p.name ? initials(p.name) : "P"}
            </span>
            <div>
              {p.name ? (
                <p className="font-heading font-bold text-white">{p.name}</p>
              ) : null}
              <p className="text-sm text-white/70">{p.title}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
