import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateTripRoute } from "@/lib/routing";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    const tenantRecord = await db.tenant.findUnique({ where: { id: tenantId }, select: { ratePerKm: true } });
    const tenantRate = tenantRecord?.ratePerKm || 0;

    const { shift, date, strategy } = await req.json();

    if (!shift || !date) {
      return NextResponse.json({ error: "Shift and date are required" }, { status: 400 });
    }

    // 1. Fetch Employees pending for this shift
    const employees = await db.employee.findMany({
      where: {
        tenantId,
        status: "active",
        shift: shift,
        // In a real production system, we'd also check if they already have a trip today
      }
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: "No employees available for this shift" }, { status: 400 });
    }

    // 2. Fetch Available Vehicles & Drivers
    const vehicles = await db.vehicle.findMany({
      where: { tenantId, status: "active" },
      orderBy: { capacity: 'desc' },
      include: { vendor: true }
    });

    const drivers = await db.driver.findMany({
      where: { tenantId, status: "available" }
    });

    if (vehicles.length === 0 || drivers.length === 0) {
      return NextResponse.json({ error: "Not enough vehicles or drivers available" }, { status: 400 });
    }

    // 3. Mathematical Route/Trip Generation (Basic Capacity Filling)
    const generatedTrips = [];
    let employeeIndex = 0;
    let resourceIndex = 0;

    // We'll map the shift string to a scheduled time
    const shiftTimeMap: Record<string, string> = {
      "Morning Shift (06:00 AM)": "06:00:00",
      "General Shift (09:00 AM)": "09:00:00",
      "Night Shift (10:00 PM)": "22:00:00"
    };

    const timeString = shiftTimeMap[shift] || "09:00:00";
    const scheduledDateTime = new Date(`${date}T${timeString}Z`);

    // In a real map-based system, we would group employees by `latitude` and `longitude`.
    // For this tier, we fill vehicles by capacity.
    while (employeeIndex < employees.length && resourceIndex < vehicles.length && resourceIndex < drivers.length) {
      const vehicle = vehicles[resourceIndex];
      const driver = drivers[resourceIndex];

      const passengersForTrip = employees.slice(employeeIndex, employeeIndex + vehicle.capacity);
      
      if (passengersForTrip.length > 0) {
        let routePolyline = "";
        let distanceInKm: number | null = null;
        let vendorCost: number | null = null;
        let tenantBilling: number | null = null;

        let orderedPassengers: any[] = passengersForTrip.map((emp: any, index: number) => ({
          employeeId: emp.id,
          status: "pending",
          sequenceIndex: index + 1,
          estimatedPickupTime: scheduledDateTime
        }));

        try {
          // Fallback coordinate: Assuming the OfficeHQ is roughly 0,0 locally if absent.
          // Real system enforces coordinate presence on Employee onboarding
          const waypoints = passengersForTrip.map((emp: any) => ({ lat: emp.latitude || 0, lng: emp.longitude || 0 }));
          const hasCoords = waypoints.every((wp: any) => wp.lat !== 0 && wp.lng !== 0);

          if (hasCoords) {
             const routeData = await calculateTripRoute("Office HQ", `Zone ${resourceIndex + 1}`, waypoints, scheduledDateTime);
             routePolyline = routeData.polyline || "";
             distanceInKm = routeData.distanceInKm || null;
             
             if (distanceInKm) {
                // @ts-ignore
                vendorCost = parseFloat((distanceInKm * (vehicle.vendor?.ratePerKm || 0)).toFixed(2));
                tenantBilling = parseFloat((distanceInKm * tenantRate).toFixed(2));
             }
             
             orderedPassengers = passengersForTrip.map((emp: any, index: number) => {
               const seq = routeData.waypointOrder.indexOf(index) + 1;
               return {
                 employeeId: emp.id,
                 status: "pending",
                 sequenceIndex: seq,
                 estimatedPickupTime: routeData.estimatedTimes[index] || scheduledDateTime
               };
             });
          }
        } catch (error) {
          console.error("Routing engine optimization omitted due to error", error);
        }

        // Create the Trip
        const newTrip = await db.trip.create({
          data: {
            tenantId,
            driverId: driver.id,
            vehicleId: vehicle.id,
            scheduledTime: scheduledDateTime,
            status: "SCHEDULED",
            startLocation: "Office HQ",
            endLocation: `Zone ${resourceIndex + 1}`, // Mocking route zone
            routePolyline: routePolyline !== "" ? routePolyline : null,
            distanceInKm,
            vendorCost,
            tenantBilling,
            passengers: {
              create: orderedPassengers
            }
          },
          include: {
            vehicle: true,
            driver: true,
            passengers: { include: { employee: true } }
          }
        });

        // Update Driver Status
        await db.driver.update({
          where: { id: driver.id },
          data: { status: "on-trip" }
        });

        // Audit Logging
        await db.auditLog.create({
          data: {
            tenantId,
            userId: session.user.id,
            action: "GENERATED_TRIP",
            details: `Auto-generated Trip ${newTrip.id} for shift ${shift}`
          }
        });

        generatedTrips.push(newTrip);
        employeeIndex += vehicle.capacity;
      }
      
      resourceIndex++;
    }

    if (employeeIndex < employees.length) {
      // Partial completion
      return NextResponse.json({ 
        message: `Generated ${generatedTrips.length} trips, but left ${employees.length - employeeIndex} employees unassigned due to limited fleet capacity.`,
        trips: generatedTrips 
      }, { status: 206 });
    }

    return NextResponse.json({ message: "Successfully generated trips", trips: generatedTrips }, { status: 201 });

  } catch (error) {
    console.error("Trip Generation Error:", error);
    return NextResponse.json({ error: "Mathematical engine failure" }, { status: 500 });
  }
}
