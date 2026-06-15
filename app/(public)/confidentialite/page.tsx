import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description:
    "Comment l'OIJD - Section CIV collecte, utilise et protege vos donnees personnelles.",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-ink">{title}</h2>
      <div className="mt-2 space-y-2 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations"
        eyebrowIcon="ShieldCheck"
        title="Politique de confidentialite"
        description="La protection de vos donnees est une priorite de l'OIJD - Section CIV."
        breadcrumb={[{ label: "Confidentialite" }]}
      />
      <Section>
        <Container className="max-w-3xl space-y-8">
          <Block title="Responsable du traitement">
            <p>
              L'OIJD - Section CIV est responsable du traitement des donnees
              collectees via cette plateforme.
            </p>
          </Block>
          <Block title="Donnees collectees">
            <p>
              Lors d'une candidature ou d'un message, nous collectons les donnees
              que vous fournissez : identite (nom, prenom ou organisation), email,
              telephone, pays, ville, ainsi que les informations et documents
              joints (CV, lettres, offres, pieces justificatives).
            </p>
          </Block>
          <Block title="Finalites">
            <p>
              Ces donnees servent uniquement a traiter votre candidature ou votre
              demande, a vous repondre, et a assurer le suivi des appels et
              opportunites. Aucune donnee n'est vendue ni cedee a des tiers a des
              fins commerciales.
            </p>
          </Block>
          <Block title="Base legale">
            <p>
              Le traitement repose sur votre consentement (recueilli lors de la
              soumission) et sur l'interet legitime de l'organisation a gerer ses
              appels et candidatures.
            </p>
          </Block>
          <Block title="Acces et confidentialite">
            <p>
              L'acces aux dossiers est strictement reserve aux responsables
              habilites de l'OIJD, selon un systeme de roles et de permissions. Les
              actions sensibles sont journalisees. Les candidats n'ont jamais acces
              aux dossiers d'autres candidats.
            </p>
          </Block>
          <Block title="Securite">
            <p>
              Les mots de passe sont chiffres, les sessions securisees, et les
              documents stockes hors de l'espace public, accessibles uniquement via
              des liens securises et journalises.
            </p>
          </Block>
          <Block title="Duree de conservation">
            <p>
              Les donnees sont conservees le temps necessaire au traitement des
              appels et a la gestion institutionnelle, puis archivees ou supprimees
              selon les regles de l'OIJD.
            </p>
          </Block>
          <Block title="Vos droits">
            <p>
              Vous disposez d'un droit d'acces, de rectification et de suppression
              de vos donnees. Pour l'exercer, ecrivez a{" "}
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
