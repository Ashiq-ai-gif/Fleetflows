import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const drivers = await db.driver.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ drivers });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const body = await req.json();
  const { name, phone, licenseNumber } = body;
  if (!name || !phone || !licenseNumber) return NextResponse.json({ error: "Name, phone and license required" }, { status: 400 });

  const existing = await db.driver.findUnique({ where: { licenseNumber } });
  if (existing) return NextResponse.json({ error: "License number already registered" }, { status: 409 });

  const driver = await db.driver.create({
    data: { tenantId, name, phone, licenseNumber, rating: 5.0, status: "available" }
  });
  return NextResponse.json({ driver }, { status: 201 });
}
