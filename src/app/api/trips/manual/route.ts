import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Must be Company Admin or Super Admin
    if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { startLocation, endLocation, scheduledTime, driverId, vehicleId, employeeIds } = await req.json();

    if (!startLocation || !endLocation || !scheduledTime || !driverId || !vehicleId || !employeeIds || !employeeIds.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tenantId = session.user.tenantId || "super-admin-tenant";

    // Create the trip and link passengers using Prisma transaction
    const newTrip = await db.$transaction(async (prisma) => {
      // 1. Create the Trip
      const trip = await prisma.trip.create({
        data: {
          tenantId: tenantId,
          startLocation,
          endLocation,
          scheduledTime: new Date(scheduledTime),
          status: "SCHEDULED",
          driverId,
          vehicleId
        }
      });

      // 2. Create passenger links
      const passengerData = employeeIds.map((empId: string) => ({
        tenantId: tenantId,
        tripId: trip.id,
        employeeId: empId,
        status: "scheduled"
      }));

      await prisma.tripPassenger.createMany({
        data: passengerData
      });

      // 3. Log Audit
      await prisma.auditLog.create({
        data: {
          tenantId: tenantId,
          userId: session.user.id,
          action: "MANUAL_TRIP_CREATED",
          details: `Manual Trip ${trip.id} created with ${employeeIds.length} employees.`
        }
      });

      return trip;
    });

    return NextResponse.json({ success: true, trip: newTrip });

  } catch (error) {
    console.error("Manual Trip Gen Error:", error);
    return NextResponse.json({ error: "Failed to manually build trip" }, { status: 500 });
  }
}
