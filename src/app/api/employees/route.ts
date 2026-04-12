import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const employees = await db.employee.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ employees });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const body = await req.json();
  
  // Handle Bulk Upload
  if (Array.isArray(body)) {
    const results = await db.employee.createMany({
      data: body.map(e => ({
        tenantId,
        name: e.name,
        email: e.email,
        department: e.department || "General",
        pickupLocation: e.pickupLocation || "Office HQ",
        shift: e.shift || "GENERAL",
        status: "active"
      })),
      skipDuplicates: true
    });
    return NextResponse.json({ success: true, count: results.count }, { status: 201 });
  }

  // Handle Single Creation
  const { name, email, department, pickupLocation, shift } = body;
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  const existing = await db.employee.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Employee email already exists" }, { status: 409 });

  const employee = await db.employee.create({
    data: { tenantId, name, email, department, pickupLocation, shift, status: "active" }
  });
  return NextResponse.json({ employee }, { status: 201 });
}
