import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    const invoices = await db.invoice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    // If no invoices exist (new account), we can mock array for demo or return empty.
    // Given the launch is tomorrow, it is better to return empty and let admin generate them.

    return NextResponse.json({ invoices });

  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

// Company Admin can process a mocked payment via POST
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await req.json();

    const invoice = await db.invoice.update({
      where: { id: invoiceId, tenantId: session.user.tenantId },
      data: { status: "paid", updatedAt: new Date() }
    });

    // Audit logging
    await db.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: "PAID_INVOICE",
        details: `Paid invoice ${invoiceId} for amount ${invoice.amount}`
      }
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
