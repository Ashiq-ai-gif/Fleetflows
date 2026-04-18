import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Endpoint for the Driver mobile app to push live coordinates
export async function POST(req: Request) {
  try {
    const { driverId, latitude, longitude } = await req.json();

    if (!driverId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const updatedDriver = await db.driver.update({
      where: { id: driverId },
      data: { latitude, longitude }
    });

    return NextResponse.json({ 
      success: true, 
      location: { lat: updatedDriver.latitude, lng: updatedDriver.longitude } 
    });
  } catch (error) {
    console.error("Location Sync Error:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

// Endpoint for the Employee app to quietly pull the current coordinates
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const driverId = searchParams.get("driverId");

    if (!driverId) {
      return NextResponse.json({ error: "Missing driverId" }, { status: 400 });
    }

    const driver = await db.driver.findUnique({
      where: { id: driverId },
      select: { latitude: true, longitude: true, updatedAt: true }
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, location: driver });
  } catch (error) {
    console.error("Location Pull Error:", error);
    return NextResponse.json({ error: "Failed to read location" }, { status: 500 });
  }
}
