import { AdminSidebar } from "@/components/AdminSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  // Add role check in production
  // if (session.user.role !== "SUPER_ADMIN") redirect("/");

  return (
    <div className="flex h-screen overflow-hidden bg-[#080810]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}
