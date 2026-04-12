import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

// GET all tenants
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenants = await db.tenant.findMany({
      include: {
        _count: {
          select: { users: true, employees: true, vehicles: true, trips: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tenants });
  } catch (error) {
    console.error("[ADMIN_COMPANIES_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create new company + admin user
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, domain, plan, adminName, adminEmail, adminPassword } = body;

    if (!companyName || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Create tenant
    const tenant = await db.tenant.create({
      data: {
        name: companyName,
        domain: domain || null,
        plan: plan || "BASIC",
        status: "active",
      },
    });

    // Create admin user for the tenant
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = await db.user.create({
      data: {
        tenantId: tenant.id,
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      tenant: { id: tenant.id, name: tenant.name, plan: tenant.plan },
      admin: { id: adminUser.id, email: adminUser.email, name: adminUser.name },
    }, { status: 201 });

  } catch (error) {
    console.error("[ADMIN_COMPANIES_POST]", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
