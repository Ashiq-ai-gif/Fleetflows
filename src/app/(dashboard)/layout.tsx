import { Sidebar } from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ImpersonationBanner from "@/components/ImpersonationBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-full flex flex-col">
        <ImpersonationBanner />
        {children}
      </main>
    </div>
  );
}
