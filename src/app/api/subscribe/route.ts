import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    // @ts-ignore
    const savedSubscription = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    return NextResponse.json({ success: true, id: savedSubscription.id });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json({ success: false, error: "Failed to save subscription" }, { status: 500 });
  }
}
