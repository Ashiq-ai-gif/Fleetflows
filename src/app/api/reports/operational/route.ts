import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // Aggregate key stats for the tenant
    const totalTrips = await db.trip.count({
      where: { tenantId }
    });

    const completedTrips = await db.trip.count({
      where: { tenantId, status: "COMPLETED" }
    });

    const totalEmployees = await db.employee.count({
      where: { tenantId, status: "active" }
    });

    const totalVehicles = await db.vehicle.count({
      where: { tenantId, status: "active" }
    });

    // We can calculate cost averages dynamically based on business logic
    // For now, we mock some advanced math based on real counts
    const estimatedDistance = completedTrips * 12.5; // Mocking 12.5km avg per trip
    
    return NextResponse.json({
      totalTrips,
      completedTrips,
      totalEmployees,
      totalVehicles,
      estimatedDistance,
      costPerEmployee: totalEmployees > 0 ? ((completedTrips * 150) / totalEmployees).toFixed(2) : 0, // Mocking cost logic
      safetyScore: 98 // Hardcoded till SOS API influences this
    });

  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: "Failed to generate operational report." }, { status: 500 });
  }
}
