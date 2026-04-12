import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyMobileAuth, unauthenticatedResponse } from "@/lib/mobile-auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyMobileAuth(req);
    if (!user || user.role !== "DRIVER") {
      return unauthenticatedResponse();
    }

    const { action } = await req.json();
    const { id: tripId } = await params;

    // Verify trip belongs to this driver
    const trip = await db.trip.findFirst({
      where: { id: tripId, driverId: user.id }
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    let newStatus = trip.status;
    let driverStatus = "available";

    if (action === "START") {
      newStatus = "EN_ROUTE";
      driverStatus = "on-trip";
    } else if (action === "COMPLETE") {
      newStatus = "COMPLETED";
      driverStatus = "available";
    } else if (action === "CANCEL") {
      newStatus = "CANCELLED";
      driverStatus = "available";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Wrap in transaction for safety
    const [updatedTrip, updatedDriver] = await db.$transaction([
      db.trip.update({
        where: { id: tripId },
        data: { status: newStatus as any }
      }),
      db.driver.update({
        where: { id: user.id },
        data: { status: driverStatus }
      })
    ]);

    // Audit log
    await db.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: `DRIVER_${action}_TRIP`,
        details: `Driver triggered ${action} on trip ${tripId}`
      }
    });

    return NextResponse.json({ success: true, trip: updatedTrip });

  } catch (error) {
    console.error("Trip Action API Error:", error);
    return NextResponse.json({ error: "Failed to update trip status" }, { status: 500 });
  }
}
