"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { ROLE_META, type Role } from "@/lib/constants";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export type NavGroup = {
  title: string;
  items: { label: string; href: string; icon: string }[];
};

export function DashboardShell({
  user,
  groups,
  unreadCount,
  logout,
  children,
}: {
  user: { name: string; email: string; role: string };
  groups: NavGroup[];
  unreadCount: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const roleMeta = ROLE_META[user.role as Role];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = (
    <div className="flex h-full flex-col bg-gradient-to-b from-ojid-forest to-ojid-forest-deep text-white">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/dashboard" onClick={() => setOpen(false)}>
          <Logo variant="dark" size={38} />
        </Link>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-white/40">
              {group.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon name={item.icon} size={18} />
                      {item.label}
                      {item.href === "/dashboard/notifications" && unreadCount > 0 ? (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-ojid-orange px-1.5 text-xs font-bold text-white">
                          {unreadCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
        >
          <Icon name="Globe2" size={14} />
          Voir le site public
        </Link>
        <p className="mt-2 text-[10px] leading-snug text-white/40">
          {siteConfig.digitalAccess.creditPrivate}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ojid-gray/40">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{SidebarContent}</aside>

      {/* Sidebar mobile (drawer) */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ojid-gray bg-white/90 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-ojid-gray lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Icon name="Menu" size={22} />
          </button>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-ojid-gray hover:text-ink"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ojid-orange px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Link>

            <div className="hidden items-center gap-3 border-l border-ojid-gray pl-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold leading-tight text-ink">
                  {user.name}
                </p>
                {roleMeta ? (
                  <Badge tone={roleMeta.tone} className="mt-0.5">
                    {roleMeta.label}
                  </Badge>
                ) : null}
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ojid-green font-bold text-white">
                {initials(user.name)}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted hover:bg-red-50 hover:text-red-600"
              >
                <Icon name="LogOut" size={18} />
                <span className="hidden md:inline">Deconnexion</span>
              </button>
            </form>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
