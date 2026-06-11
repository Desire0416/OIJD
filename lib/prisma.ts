import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma. Evite d'epuiser les connexions en developpement
 * (hot-reload de Next.js qui re-instancie les modules).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
