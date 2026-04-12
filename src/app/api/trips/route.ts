import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trips = await db.trip.findMany({
      where: {
        tenantId: session.user.tenantId,
        scheduledTime: {
          gte: today
        }
      },
      include: {
        vehicle: true,
        driver: true,
        passengers: {
          include: {
            employee: true
          }
        }
      },
      orderBy: { scheduledTime: 'asc' }
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Trips GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}
