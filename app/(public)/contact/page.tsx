import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";
import { submitContact } from "./actions";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'OIJD - Section CIV.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const coords = [
    { icon: "MapPin", label: "Adresse", value: siteConfig.contact.address },
    { icon: "Mail", label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: "Phone", label: "Telephone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        eyebrowIcon="Mail"
        title="Contactez-nous"
        description="Une question, un partenariat, une demande ? Notre equipe vous repond."
        breadcrumb={[{ label: "Contact" }]}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-6">
              <div className="space-y-3">
                {coords.map((c) => (
                  <Card key={c.label} className="flex items-center gap-4 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ojid-green/10 text-ojid-green">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {c.label}
                      </p>
                      {c.href ? (
                        <a href={c.href} className="font-medium text-ink hover:text-ojid-green">
                          {c.value}
                        </a>
                      ) : (
                        <p className="font-medium text-ink">{c.value}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="overflow-hidden p-0">
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-ojid-green to-ojid-green-dark">
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="relative text-center text-white">
                    <Icon name="MapPin" size={32} className="mx-auto text-ojid-orange-flame" />
                    <p className="mt-2 font-semibold">{siteConfig.contact.address}</p>
                  </div>
                </div>
              </Card>

              <div>
                <p className="mb-3 text-sm font-semibold text-ink">Suivez-nous</p>
                <div className="flex gap-2.5">
                  {siteConfig.socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-ojid-gray text-ink transition-colors hover:bg-ojid-green hover:text-white"
                    >
                      <Icon name={s.icon} size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm departments={departments} action={submitContact} />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
