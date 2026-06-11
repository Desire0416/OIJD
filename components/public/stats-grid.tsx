import { Counter } from "@/components/ui/counter";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
};

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ojid-forest via-ojid-green-dark to-ojid-green px-6 py-12 text-white shadow-lift md:px-12">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-ojid-orange/20 blur-3xl" />
      <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-ojid-orange-flame">
              <Icon name={s.icon} size={24} />
            </span>
            <div className="mt-3 font-heading text-4xl font-extrabold tracking-tight">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-sm font-medium text-white/70">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
