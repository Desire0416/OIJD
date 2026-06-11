import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/constants";

const COOKIE_NAME = "oijd_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function getSecret() {
  const secret = process.env.AUTH_SECRET || "dev-secret-oijd-change-me";
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  role: Role;
  name: string;
  email: string;
  departmentId?: string | null;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: {
  id: string;
  role: string;
  name: string;
  email: string;
  departmentId?: string | null;
}) {
  const token = await signSession({
    sub: user.id,
    role: user.role as Role,
    name: user.name,
    email: user.email,
    departmentId: user.departmentId ?? null,
  });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * Utilisateur courant (mise en cache par requete via React cache()).
 * Verifie le jeton ET recharge l'utilisateur depuis la base (statut/role frais).
 */
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload?.sub) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { department: true },
  });
  if (!user || user.status !== "ACTIVE") return null;
  return user;
});

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;
