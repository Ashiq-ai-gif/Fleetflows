import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyMobileAuth, unauthenticatedResponse } from "@/lib/mobile-auth";

export async function GET(req: Request) {
  try {
    // 1. Authenticate the Mobile Request via Bearer Token
    const user = verifyMobileAuth(req);
    if (!user) {
      return unauthenticatedResponse();
    }

    // 2. Fetch the corresponding scheduled trips for the day based on Role
    let trips: any[] = [];

    // Setup date boundaries for "Today"
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (user.role === "DRIVER") {
      trips = await db.trip.findMany({
        where: {
          driverId: user.id,
          // For MVP, pulling recent instead of strict 'today' just to show data
          // Make sure tenant matches securely
          tenantId: user.tenantId 
        },
        orderBy: { scheduledTime: "asc" },
        include: {
          vehicle: true,
          passengers: {
            include: { employee: true }
          }
        }
      });
    } else if (user.role === "EMPLOYEE") {
      // Find trips where this employee is a passenger
      trips = await db.trip.findMany({
        where: {
          tenantId: user.tenantId,
          passengers: {
            some: { employeeId: user.id }
          }
        },
        orderBy: { scheduledTime: "asc" },
        include: {
          driver: true,
          vehicle: true,
          passengers: true
        }
      });
    } else {
      return NextResponse.json({ error: "Invalid role for mobile trips" }, { status: 403 });
    }

    // Return the secure trip payload specifically formatted for the React Native App
    return NextResponse.json({
      success: true,
      data: trips
    });

  } catch (error) {
    console.error("Mobile Trips API Error:", error);
    return NextResponse.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}
