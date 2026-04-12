import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  
  // Only Super Admins can impersonate
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await req.json();
  if (!companyId) return NextResponse.json({ error: "Company ID required" }, { status: 400 });

  // Get the company details
  const company = await db.tenant.findUnique({
    where: { id: companyId },
  });

  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  // In a real app, you'd update the session or set a cookie.
  // For this implementation, we will return the target URL and the tenant info.
  // The frontend can then handle the redirect.
  
  return NextResponse.json({ 
    success: true, 
    redirectUrl: `/`, 
    tenantName: company.name 
  });
}
