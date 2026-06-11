"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero({ openCalls = 0 }: { openCalls?: number }) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.15 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ojid-forest-deep lg:min-h-[88vh]">
      {/* Image plein ecran avec zoom lent (Ken Burns) */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.06 }}
        animate={reduce ? { scale: 1.06 } : { scale: 1.16 }}
        transition={{
          duration: 24,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 -z-20"
      >
        <img
          src="/brand/hero-world.jpg"
          alt="Drapeaux des nations autour d'un globe - cooperation internationale"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* Voiles de lisibilite + teinte institutionnelle */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ojid-forest-deep/95 via-ojid-forest/60 to-ojid-forest-deep/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ojid-forest-deep/90 via-transparent to-ojid-forest-deep/30"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.08]" />

      {/* Contenu */}
      <div className="container-x relative w-full py-24 lg:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ojid-orange opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ojid-orange" />
            </span>
            Section Cote d'Ivoire - Jeunesse diplomatique
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-heading text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white text-balance drop-shadow-sm sm:text-5xl lg:text-[3.7rem]"
          >
            Jeunesse, diplomatie et{" "}
            <span className="text-ojid-orange-flame">engagement</span> pour un
            avenir responsable.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/85"
          >
            L'Organisation Internationale de la Jeunesse Diplomatique - Section
            CIV federe une jeunesse engagee pour la cooperation, le leadership
            responsable et l'ouverture internationale.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/appels"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Voir les appels
              <Icon name="ArrowRight" size={18} />
            </Link>
            <Link
              href="/a-propos"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/5 px-6 font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Decouvrir l'OIJD
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80"
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="Megaphone" size={17} className="text-ojid-orange-flame" />
              <strong className="text-white">{openCalls}</strong> appels ouverts
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="Building2" size={17} className="text-white" />
              <strong className="text-white">14</strong> departements
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="Globe2" size={17} className="text-white" />
              Cooperation internationale
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicateur de defilement anime */}
      <motion.a
        href="#contenu"
        aria-label="Defiler vers le contenu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={cn(
          "absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/70 hover:text-white md:flex",
        )}
      >
        <span className="text-[11px] font-medium uppercase tracking-widest">
          Defiler
        </span>
        <motion.span
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-white/80" />
        </motion.span>
      </motion.a>
    </section>
  );
}
