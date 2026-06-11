import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { can, isDepartmentScoped } from "@/lib/permissions";
import {
  OPPORTUNITY_TYPE_META,
  SUBMISSION_STATUS_META,
  type OpportunityType,
  type SubmissionStatus,
} from "@/lib/constants";

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "submissions.view"))
    return new NextResponse("Acces refuse", { status: 403 });

  const appel = req.nextUrl.searchParams.get("appel");
  const where: Record<string, unknown> = {};
  if (isDepartmentScoped(user.role) && user.departmentId)
    where.opportunity = { departmentId: user.departmentId };
  if (appel) where.opportunityId = appel;

  const rows = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { opportunity: { select: { title: true, type: true } } },
  });

  const header = [
    "Reference",
    "Nom",
    "Organisation",
    "Email",
    "Telephone",
    "Pays",
    "Ville",
    "Appel",
    "Type",
    "Statut",
    "Score",
    "Complet",
    "Date",
  ];
  const lines = rows.map((r) =>
    [
      r.reference,
      [r.firstName, r.lastName].filter(Boolean).join(" "),
      r.organizationName ?? "",
      r.email,
      r.phone ?? "",
      r.country ?? "",
      r.city ?? "",
      r.opportunity.title,
      OPPORTUNITY_TYPE_META[r.opportunity.type as OpportunityType]?.label ?? r.opportunity.type,
      SUBMISSION_STATUS_META[r.status as SubmissionStatus]?.label ?? r.status,
      r.score ?? "",
      r.complete ? "Oui" : "Non",
      r.createdAt.toISOString().slice(0, 10),
    ]
      .map(csvCell)
      .join(","),
  );

  const csv = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dossiers-oijd.csv"`,
    },
  });
}
