"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRide(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const driverId = parseInt(formData.get("driverId") as string);
  const passengerIds = formData.getAll("passengerIds").map((id) => parseInt(id as string));

  if (!dateStr || isNaN(driverId)) return;

  await prisma.ride.create({
    data: {
      date: new Date(dateStr),
      driverId,
      passengers: {
        create: passengerIds.map((pid) => ({
          passengerId: pid,
        })),
      },
    },
  });

  revalidatePath("/");
}

export async function updateRide(rideId: number, formData: FormData) {
  const dateStr = formData.get("date") as string;
  const driverId = parseInt(formData.get("driverId") as string);
  const passengerIds = formData.getAll("passengerIds").map((id) => parseInt(id as string));

  if (!dateStr || isNaN(driverId)) return;

  // Transaction to update ride and its passengers
  await prisma.$transaction([
    prisma.ridePassenger.deleteMany({ where: { rideId } }),
    prisma.ride.update({
      where: { id: rideId },
      data: {
        date: new Date(dateStr),
        driverId,
        passengers: {
          create: passengerIds.map((pid) => ({
            passengerId: pid,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/");
}

export async function deleteRide(rideId: number) {
  await prisma.ridePassenger.deleteMany({
    where: { rideId },
  });
  await prisma.ride.delete({
    where: { id: rideId },
  });
  revalidatePath("/");
}

export async function addParticipant(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string;

  await prisma.participant.create({
    data: { name, role, phone },
  });
  revalidatePath("/participantes");
}

export async function updateParticipant(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string;

  await prisma.participant.update({
    where: { id },
    data: { name, role, phone },
  });
  revalidatePath("/participantes");
  revalidatePath("/"); // Update dashboard cards as well
}

export async function deleteParticipant(id: number) {
  // First delete associated ride data if any (or handle with cascades)
  // Our schema doesn't have cascades yet, so let's be safe
  await prisma.ridePassenger.deleteMany({
    where: { passengerId: id }
  });
  
  await prisma.ride.deleteMany({
    where: { driverId: id }
  });

  await prisma.participant.delete({
    where: { id },
  });
  revalidatePath("/participantes");
  revalidatePath("/");
}

export async function getConfigurations() {
  const configs = await prisma.appSetting.findMany();
  const configMap: Record<string, string> = {};
  configs.forEach((c: { key: string; value: string }) => {
    configMap[c.key] = c.value;
  });
  return configMap;
}

export async function updateConfiguration(key: string, value: string) {
  await prisma.appSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/configuracoes");
}

import { cookies } from "next/headers";

export async function authenticate(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    (await cookies()).set("auth-token", "authenticated", { secure: true, httpOnly: true });
    // Since we're in a server action handling a form submission, we should redirect.
    // However, it's simpler to let Next.js handle revalidation if we just set the cookie.
    // Let's redirect to home.
    // Actually, redirecting from server actions requires next/navigation
    const { redirect } = await import("next/navigation");
    redirect("/");
  } else {
    // Optionally handle error, but for simplicity, we can do nothing or throw.
    throw new Error("Invalid password");
  }
}

export async function logout() {
  (await cookies()).delete("auth-token");
  const { redirect } = await import("next/navigation");
  redirect("/login");
}


