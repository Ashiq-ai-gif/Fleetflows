import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employees } = await req.json();

    if (!Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json({ error: "No valid employee data provided" }, { status: 400 });
    }

    // Map payload to Prisma schema
    const dataToInsert = employees.map((emp) => ({
      tenantId: session.user.tenantId,
      name: emp.name,
      email: emp.email,
      department: emp.department || "General",
      shift: emp.shift || "General Shift (09:00 AM)",
      pickupLocation: emp.pickupLocation || "Zone 1",
      status: "active"
    }));

    // Perform bulk insertion
    // Use createMany to insert up to limits efficiently
    const result = await db.employee.createMany({
      data: dataToInsert,
      skipDuplicates: true // Will skip users with same email constraints
    });

    // Audit Log
    await db.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: "BULK_UPLOAD_EMPLOYEES",
        details: `Uploaded ${result.count} employees via CSV import.`
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      message: `Successfully registered ${result.count} employees.` 
    }, { status: 201 });

  } catch (error) {
    console.error("Bulk Employee Upload Error:", error);
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 });
  }
}
