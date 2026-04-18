import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  // Only Super Admins can impersonate
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId, exit } = await req.json();

  // EXIT IMPERSONATION – restore the original Super Admin context
  if (exit) {
    return NextResponse.json({
      success: true,
      sessionUpdate: {
        tenantId: (session.user as any).originalTenantId || null,
        tenantName: "Super Admin",
        role: "SUPER_ADMIN",
        isImpersonating: false,
        originalTenantId: undefined,
      },
      redirectUrl: "/admin",
    });
  }

  if (!companyId) {
    return NextResponse.json({ error: "Company ID required" }, { status: 400 });
  }

  // Find the target company
  const company = await db.tenant.findUnique({
    where: { id: companyId },
    include: { users: { where: { role: "ADMIN" }, take: 1 } },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  // Return the values the client will inject via session.update()
  return NextResponse.json({
    success: true,
    sessionUpdate: {
      tenantId: company.id,
      tenantName: company.name,
      role: "ADMIN",
      isImpersonating: true,
      originalTenantId: (session.user as any).tenantId || null,
    },
    redirectUrl: "/",
  });
}
