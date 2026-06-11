import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ALLOWED_UPLOAD_MIME } from "@/lib/constants";
import { slugify } from "@/lib/utils";

/**
 * Stockage de fichiers (hors dossier public ; servis via /api/uploads/[id]).
 *
 * Providers :
 *  - "local"        : disque local (developpement).
 *  - "vercel-blob"  : Vercel Blob (production serverless). Necessite la variable
 *                     BLOB_READ_WRITE_TOKEN (fournie automatiquement quand un
 *                     store Blob est connecte au projet Vercel).
 */

const ROOT = process.cwd();
const LOCAL_DIR = process.env.STORAGE_LOCAL_DIR || "storage/uploads";
const MAX_MB = Number(process.env.MAX_UPLOAD_MB || "10");
const PROVIDER = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
const USE_BLOB = PROVIDER === "vercel-blob" || PROVIDER === "blob";

export type SavedFile = {
  storageKey: string;
  name: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url?: string;
};

export class UploadError extends Error {}

function storageBase(): string {
  return path.isAbsolute(LOCAL_DIR) ? LOCAL_DIR : path.join(ROOT, LOCAL_DIR);
}

export function isAllowedMime(mime: string): boolean {
  return Boolean(ALLOWED_UPLOAD_MIME[mime]);
}

function isRemote(storageKey: string): boolean {
  return /^https?:\/\//i.test(storageKey);
}

export async function saveFile(file: File): Promise<SavedFile> {
  const sizeBytes = file.size;
  if (sizeBytes <= 0) throw new UploadError("Fichier vide.");
  if (sizeBytes > MAX_MB * 1024 * 1024)
    throw new UploadError(`Fichier trop volumineux (max ${MAX_MB} Mo).`);
  const mimeType = file.type || "application/octet-stream";
  if (!isAllowedMime(mimeType))
    throw new UploadError(
      "Type de fichier non autorise (PDF, DOC, DOCX, PNG, JPG).",
    );

  const ext = ALLOWED_UPLOAD_MIME[mimeType] || path.extname(file.name) || "";
  const now = new Date();
  const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const safeBase = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "fichier";
  const fileName = `${randomUUID()}-${safeBase}${ext}`;
  const storageKey = `${sub}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (USE_BLOB) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`oijd/${storageKey}`, buffer, {
        access: "public",
        contentType: mimeType,
        addRandomSuffix: true,
      });
      // L'URL Blob (token aleatoire non devinable) sert de cle de stockage ;
      // le fichier reste servi via la route securisee qui le recupere cote serveur.
      return {
        storageKey: blob.url,
        name: fileName,
        originalName: file.name,
        mimeType,
        sizeBytes,
        url: blob.url,
      };
    } catch (err) {
      throw new UploadError(
        "Stockage des fichiers indisponible (Vercel Blob non configure).",
      );
    }
  }

  // Stockage local
  await fs.mkdir(path.join(storageBase(), sub), { recursive: true });
  await fs.writeFile(path.join(storageBase(), storageKey), buffer);
  return {
    storageKey,
    name: fileName,
    originalName: file.name,
    mimeType,
    sizeBytes,
  };
}

/** Resout un storageKey local en chemin absolu (anti traversee). */
function resolveKey(storageKey: string): string {
  const base = storageBase();
  const full = path.resolve(base, storageKey);
  if (!full.startsWith(path.resolve(base))) {
    throw new UploadError("Chemin de fichier invalide.");
  }
  return full;
}

export async function readFile(storageKey: string): Promise<Buffer> {
  if (isRemote(storageKey)) {
    const res = await fetch(storageKey);
    if (!res.ok) throw new UploadError("Fichier distant indisponible.");
    return Buffer.from(await res.arrayBuffer());
  }
  return fs.readFile(resolveKey(storageKey));
}

export async function deleteFile(storageKey: string): Promise<void> {
  try {
    if (isRemote(storageKey)) {
      const { del } = await import("@vercel/blob");
      await del(storageKey);
      return;
    }
    await fs.unlink(resolveKey(storageKey));
  } catch {
    /* le fichier peut deja avoir ete supprime */
  }
}
