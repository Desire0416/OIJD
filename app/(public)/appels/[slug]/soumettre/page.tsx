import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseArray, parseObject } from "@/lib/json";
import { OPPORTUNITY_TYPE_META, type OpportunityType } from "@/lib/constants";
import { PageHeader } from "@/components/public/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { DynamicSubmissionForm } from "@/components/forms/dynamic-submission-form";
import { submitDossier } from "./actions";
import type { FormSchema } from "@/lib/submission-types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opp = await prisma.opportunity.findUnique({ where: { slug } });
  return { title: opp ? `Soumettre - ${opp.title}` : "Soumettre un dossier" };
}

export default async function SoumettrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = await prisma.opportunity.findUnique({ where: { slug } });
  if (!opp) notFound();

  const open =
    opp.status === "PUBLISHED" &&
    (!opp.deadline || opp.deadline.getTime() >= Date.now());
  if (!open) redirect(`/appels/${slug}`);

  const typeMeta = OPPORTUNITY_TYPE_META[opp.type as OpportunityType];
  const schema = parseObject<FormSchema>(opp.formSchema, { fields: [] });
  const requiredDocs = parseArray<string>(opp.requiredDocuments);

  return (
    <>
      <PageHeader
        eyebrow={typeMeta?.label ?? "Appel"}
        eyebrowIcon={typeMeta?.icon ?? "FileUp"}
        title={`Soumettre : ${opp.title}`}
        description="Completez le formulaire et joignez les pieces demandees. Vos donnees sont traitees de maniere confidentielle."
        breadcrumb={[
          { label: "Appels", href: "/appels" },
          { label: opp.title.slice(0, 30) + "...", href: `/appels/${slug}` },
          { label: "Soumettre" },
        ]}
      />
      <Section>
        <Container className="max-w-3xl">
          <DynamicSubmissionForm
            slug={slug}
            title={opp.title}
            actionLabel={typeMeta?.actionLabel ?? "Soumettre le dossier"}
            formCategory={typeMeta?.formCategory ?? "CANDIDACY"}
            schema={schema}
            requiredDocs={requiredDocs}
            action={submitDossier}
          />
        </Container>
      </Section>
    </>
  );
}
