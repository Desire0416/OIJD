import type { Metadata } from "next";
import { bureauExecutif } from "@/lib/site-config";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { BureauCard } from "@/components/public/bureau-card";

export const metadata: Metadata = {
  title: "Responsables",
  description:
    "Le Bureau Executif de l'OIJD - Section CIV : president, vice-presidents et directeurs.",
};

export default function ResponsablesPage() {
  const { president, vicePresidents, directeurs } = bureauExecutif;

  return (
    <>
      <PageHeader
        eyebrow="Bureau Executif"
        eyebrowIcon="Users"
        title="Nos responsables"
        description="Les femmes et les hommes qui dirigent et animent l'OIJD - Section CIV."
        breadcrumb={[
          { label: "Organisation", href: "/organisation" },
          { label: "Responsables" },
        ]}
      />

      {/* --- Presidence --- */}
      <Section>
        <Container>
          <Reveal>
            <GroupLabel tone="president" icon="Flag" label="Presidence" />
          </Reveal>
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xs">
              <BureauCard
                member={{
                  name: president.name || "Presidence",
                  title: "President",
                  mission: president.mission,
                  photo: president.photo,
                  gender: "M",
                }}
                tone="president"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- Vice-Presidents --- */}
      <Section muted>
        <Container>
          <Reveal>
            <GroupLabel
              tone="vp"
              icon="Star"
              label="Vice-Presidents"
              description="Membres du bureau charges de piloter les grands axes strategiques de l'organisation."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vicePresidents.map((vp, i) => (
              <Reveal key={vp.name} delay={i * 0.07}>
                <BureauCard member={vp} tone="vp" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- Directeurs --- */}
      <Section>
        <Container>
          <Reveal>
            <GroupLabel
              tone="dir"
              icon="Briefcase"
              label="Directeurs"
              description="Responsables de l'execution operationnelle des programmes et des domaines d'action de l'OIJD."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {directeurs.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.05}>
                <BureauCard member={d} tone="dir" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

function GroupLabel({
  tone,
  icon,
  label,
  description,
}: {
  tone: "president" | "vp" | "dir";
  icon: string;
  label: string;
  description?: string;
}) {
  const colors = {
    president: "border-ojid-green/30 bg-ojid-green/5 text-ojid-green",
    vp:        "border-ojid-orange/30 bg-ojid-orange/5 text-ojid-orange",
    dir:       "border-ojid-bluegray/30 bg-ojid-bluegray/5 text-ojid-bluegray",
  };
  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${colors[tone]}`}
      >
        <Icon name={icon} size={13} />
        {label}
      </span>
      {description ? (
        <p className="text-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
}
