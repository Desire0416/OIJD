"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { destroySession } from "@/lib/auth/session";
import { getActor } from "@/lib/dash-auth";

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function markAllNotificationsRead() {
  const user = await getActor();
  if (!user) return;
  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard");
}
