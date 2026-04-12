import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { getMobileJwtSecret } from "@/lib/auth-secret";
import { verifyDriverCredential, verifyEmployeeCredential } from "@/lib/driver-employee-auth";

export async function POST(req: Request) {
  try {
    const { role, identifier, pin } = await req.json();

    if (!role || !identifier || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let userObj: { id: string; role: string; tenantId: string; name: string } | null = null;

    if (role === "DRIVER") {
      const driver = await db.driver.findFirst({
        where: { phone: identifier }
      });

      if (!driver || !(await verifyDriverCredential(driver, pin))) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      userObj = {
        id: driver.id,
        role: "DRIVER",
        tenantId: driver.tenantId,
        name: driver.name
      };
    } else if (role === "EMPLOYEE") {
      const employee = await db.employee.findUnique({
        where: { email: identifier }
      });

      if (!employee || !(await verifyEmployeeCredential(employee, pin))) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      userObj = {
        id: employee.id,
        role: "EMPLOYEE",
        tenantId: employee.tenantId,
        name: employee.name
      };
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!userObj) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Sign a fresh JWT token that is completely independent of NextAuth cookies
    const token = jwt.sign(
      {
        id: userObj.id,
        role: userObj.role,
        tenantId: userObj.tenantId
      },
      getMobileJwtSecret(),
      { expiresIn: "30d" } // Long lived token for native mobile
    );

    return NextResponse.json({
      success: true,
      token,
      user: userObj
    });

  } catch (error) {
    console.error("Mobile Auth Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
