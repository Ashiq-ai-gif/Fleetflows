import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const vehicles = await db.vehicle.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ vehicles });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const body = await req.json();
  const { model, plateNumber, capacity, type } = body;
  if (!model || !plateNumber || !capacity || !type) return NextResponse.json({ error: "All fields required" }, { status: 400 });

  const existing = await db.vehicle.findUnique({ where: { plateNumber } });
  if (existing) return NextResponse.json({ error: "Plate number already registered" }, { status: 409 });

  const vehicle = await db.vehicle.create({
    data: { tenantId, model, plateNumber, capacity: Number(capacity), type, status: "active" }
  });
  return NextResponse.json({ vehicle }, { status: 201 });
}
