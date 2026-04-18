import { VendorSidebar } from "@/components/VendorSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Ideally, ensure session.user.role === "VENDOR" once Vendor login is fully set
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <VendorSidebar />
      <main className="flex-1 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}
