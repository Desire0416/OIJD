import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales de la plateforme de l'OIJD - Section CIV.",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-ink">{title}</h2>
      <div className="mt-2 space-y-2 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations"
        eyebrowIcon="Info"
        title="Mentions legales"
        breadcrumb={[{ label: "Mentions legales" }]}
      />
      <Section>
        <Container className="max-w-3xl space-y-8">
          <Block title="Editeur">
            <p>
              {siteConfig.fullNameWithSection} (OIJD - Section CIV).
              <br />
              {siteConfig.contact.address} — {siteConfig.contact.email} —{" "}
              {siteConfig.contact.phone}
            </p>
          </Block>
          <Block title="Directeur de la publication">
            <p>Le President de l'OIJD - Section CIV.</p>
          </Block>
          <Block title="Conception et realisation">
            <p>
              {siteConfig.digitalAccess.name}. {siteConfig.digitalAccess.tagline}
            </p>
          </Block>
          <Block title="Hebergement">
            <p>
              Plateforme hebergee par Vercel Inc. — 340 S Lemon Ave #4133, Walnut,
              CA 91789, USA — vercel.com. Base de donnees hebergee par Neon.
            </p>
          </Block>
          <Block title="Propriete intellectuelle">
            <p>
              L'ensemble des contenus (textes, logo, visuels, documents) est la
              propriete de l'OIJD - Section CIV ou de ses partenaires, sauf mention
              contraire. Toute reproduction sans autorisation est interdite.
            </p>
          </Block>
          <Block title="Donnees personnelles">
            <p>
              Le traitement des donnees personnelles (candidatures, messages) est
              decrit dans notre{" "}
              <a href="/confidentialite" className="font-medium text-ojid-green hover:underline">
                politique de confidentialite
              </a>
              .
            </p>
          </Block>
          <Block title="Contact">
            <p>
              Pour toute question :{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-ojid-green hover:underline">
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </Block>
        </Container>
      </Section>
    </>
  );
}
