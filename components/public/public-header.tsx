"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { primaryNav, type NavEntry } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function isGroup(
  entry: NavEntry,
): entry is Extract<NavEntry, { items: unknown }> {
  return "items" in entry;
}

export function PublicHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture au changement de route
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Echap + clic exterieur
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const groupActive = (entry: Extract<NavEntry, { items: unknown }>) =>
    entry.items.some((i) => isActive(i.href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || openMenu
          ? "border-b border-ojid-gray bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white/70 backdrop-blur-sm",
      )}
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-4">
        <Link href="/" aria-label="Accueil OIJD" className="flex items-center">
          <Logo size={52} />
        </Link>

        {/* Navigation desktop */}
        <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((entry) => {
            if (!isGroup(entry)) {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  data-active={isActive(entry.href)}
                  className="nav-link px-3 py-2 text-[15px]"
                >
                  {entry.label}
                </Link>
              );
            }

            const active = groupActive(entry);
            const isOpen = openMenu === entry.label;
            const wide = Boolean(entry.featured);

            return (
              <div
                key={entry.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(entry.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  data-active={active}
                  onClick={() =>
                    setOpenMenu((o) => (o === entry.label ? null : entry.label))
                  }
                  className="nav-link inline-flex items-center gap-1 px-3 py-2 text-[15px]"
                >
                  {entry.label}
                  <Icon
                    name="ChevronDown"
                    size={15}
                    className={cn(
                      "mt-0.5 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 top-full pt-3"
                    >
                      <div
                        className={cn(
                          "rounded-2xl border border-ojid-gray bg-white p-2 shadow-xl ring-1 ring-black/5",
                          wide ? "grid w-[600px] grid-cols-[1fr_230px] gap-2" : "w-[320px]",
                        )}
                      >
                        <ul className={cn(wide && "grid grid-cols-1 gap-0.5")}>
                          {entry.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-ojid-gray/60"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ojid-green/10 text-ojid-green transition-colors group-hover:bg-ojid-green group-hover:text-white">
                                  <Icon name={item.icon} size={18} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-ink">
                                    {item.label}
                                  </span>
                                  <span className="block text-xs leading-snug text-muted">
                                    {item.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>

                        {entry.featured ? (
                          <Link
                            href={entry.featured.href}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-ojid-green to-ojid-forest p-4 text-white"
                          >
                            <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ojid-orange/20 blur-2xl" />
                            <span className="relative">
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                                <Icon name={entry.featured.icon} size={20} className="text-ojid-orange-flame" />
                              </span>
                              <span className="mt-3 block font-heading text-base font-bold">
                                {entry.featured.title}
                              </span>
                              <span className="mt-1 block text-xs leading-snug text-white/75">
                                {entry.featured.description}
                              </span>
                            </span>
                            <span className="relative mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ojid-orange-flame">
                              {entry.featured.cta}
                              <Icon
                                name="ArrowRight"
                                size={15}
                                className="transition-transform group-hover:translate-x-0.5"
                              />
                            </span>
                          </Link>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Actions desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Icon name="Lock" size={16} />
            Espace prive
          </Link>
          <Link
            href="/appels"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Voir les appels
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-ojid-gray lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <Icon name={open ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-ojid-gray bg-white lg:hidden"
          >
            <div className="container-x flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-4">
              {primaryNav.map((entry) => {
                if (!isGroup(entry)) {
                  return (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      className={cn(
                        "rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors",
                        isActive(entry.href)
                          ? "bg-ojid-green/10 text-ojid-green"
                          : "text-ink hover:bg-ojid-gray",
                      )}
                    >
                      {entry.label}
                    </Link>
                  );
                }
                return (
                  <div key={entry.label} className="pt-2">
                    <p className="px-4 pb-1 text-xs font-bold uppercase tracking-wider text-muted">
                      {entry.label}
                    </p>
                    {entry.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-ojid-green/10 text-ojid-green"
                            : "text-ink hover:bg-ojid-gray",
                        )}
                      >
                        <Icon name={item.icon} size={18} className="text-ojid-green" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                );
              })}

              <div className="mt-3 flex flex-col gap-2.5">
                <Link href="/appels" className={buttonVariants({ variant: "primary" })}>
                  Voir les appels
                  <Icon name="ArrowRight" size={18} />
                </Link>
                <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                  <Icon name="Lock" size={16} />
                  Espace prive
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
