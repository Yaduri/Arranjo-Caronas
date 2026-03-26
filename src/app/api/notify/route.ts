import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

export async function GET(req: Request) {
  try {
    // Initialize web-push only at runtime
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        "mailto:yaduri16@gmail.com",
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    } else {
      console.warn("VAPID keys not set. Skipping notification initialization.");
    }

    // Basic auth check for Cron-job.org (optional: secret header)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
       // Allow for now but mention it
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find rides for today
    const rides = await prisma.ride.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        driver: true,
        passengers: {
          include: {
            passenger: true,
          },
        },
      },
    });

    if (rides.length === 0) {
      return NextResponse.json({ message: "No rides today" });
    }

    // @ts-ignore
    const subscriptions = await prisma.pushSubscription.findMany();
    const notifications = [];

    for (const ride of rides) {
      const passengersList = ride.passengers.map((p: any) => p.passenger.name).join(", ");
      const time = new Date(ride.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
      
      const payload = JSON.stringify({
        title: "🚗 Carona de Hoje!",
        body: `Às ${time}: ${ride.driver.name} levando ${passengersList}.`,
      });

      for (const sub of subscriptions) {
        notifications.push(
          webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          ).catch(async (err) => {
            if (err.statusCode === 404 || err.statusCode === 410) {
              // Remove expired subscription
              // @ts-ignore
              await prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
          })
        );
      }
    }

    await Promise.all(notifications);

    return NextResponse.json({ success: true, notificationsSent: notifications.length });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ success: false, error: "Failed to send notifications" }, { status: 500 });
  }
}
