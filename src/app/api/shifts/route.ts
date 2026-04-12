import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shifts = await db.shift.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error("Shifts GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch shifts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, startTime, endTime } = await req.json();

    if (!name || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shift = await db.shift.create({
      data: {
        tenantId: session.user.tenantId,
        name,
        startTime,
        endTime
      }
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error("Shifts POST Error:", error);
    return NextResponse.json({ error: "Failed to create shift" }, { status: 500 });
  }
}
