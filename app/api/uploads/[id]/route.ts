import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { readFile } from "@/lib/storage";
import { logAudit } from "@/lib/audit";

/**
 * Telechargement securise des fichiers (hors dossier public).
 * - Documents PUBLIC : accessibles a tous.
 * - Autres : authentification + capacite requise + journalisation.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return new NextResponse("Document introuvable", { status: 404 });

  if (doc.visibility !== "PUBLIC") {
    const user = await getCurrentUser();
    if (!user) return new NextResponse("Authentification requise", { status: 401 });
    if (!can(user.role, "submissions.view") && !can(user.role, "documents.manage"))
      return new NextResponse("Acces refuse", { status: 403 });
    await logAudit({
      userId: user.id,
      action: "DOCUMENT_DOWNLOAD",
      entityType: "Document",
      entityId: id,
    });
  }

  try {
    const buffer = await readFile(doc.storageKey);
    await prisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.originalName)}"`,
      },
    });
  } catch {
    return new NextResponse("Fichier indisponible", { status: 404 });
  }
}
