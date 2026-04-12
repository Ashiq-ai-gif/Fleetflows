import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyMobileAuth, unauthenticatedResponse } from "@/lib/mobile-auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyMobileAuth(req);
    if (!user || user.role !== "EMPLOYEE") {
      return unauthenticatedResponse();
    }

    const { action } = await req.json();
    const { id: tripId } = await params;

    if (action !== "BOARD" && action !== "NO_SHOW") {
      return NextResponse.json({ error: "Invalid passenger action" }, { status: 400 });
    }

    // Find the mapping
    const passengerLink = await db.tripPassenger.findFirst({
      where: {
        tripId: tripId,
        employeeId: user.id
      }
    });

    if (!passengerLink) {
      return NextResponse.json({ error: "You are not assigned to this trip" }, { status: 404 });
    }

    const newStatus = action === "BOARD" ? "boarded" : "no-show";

    const updatedPassenger = await db.tripPassenger.update({
      where: { id: passengerLink.id },
      data: { status: newStatus }
    });

    // Audit
    await db.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: `EMPLOYEE_${action}`,
        details: `Employee marked as ${newStatus} for trip ${tripId}`
      }
    });

    return NextResponse.json({ success: true, passenger: updatedPassenger });

  } catch (error) {
    console.error("Passenger Action API Error:", error);
    return NextResponse.json({ error: "Failed to update passenger status" }, { status: 500 });
  }
}
