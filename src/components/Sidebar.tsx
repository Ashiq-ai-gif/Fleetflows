"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Truck, 
  AlertTriangle, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText,
  Clock,
  BrainCircuit,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Employees", href: "/employees" },
  { icon: Truck, label: "Drivers", href: "/drivers" },
  { icon: Truck, label: "Vehicles", href: "/vehicles" },
  { icon: Clock, label: "Shifts", href: "/shifts" },
  { icon: BrainCircuit, label: "Trip Planning", href: "/trips" },
  { icon: Map, label: "Live Tracking", href: "/live-map" },
  { icon: TrendingUp, label: "Reports", href: "/analytics" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: AlertTriangle, label: "SOS Alerts", href: "/alerts" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-64 min-h-screen bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">F</div>
        <h1 className="text-xl font-bold text-white tracking-tight">Fleet Flows</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group hover:bg-slate-900",
                isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate pr-2">{session?.user?.name || "Loading..."}</p>
              <p className="text-xs text-slate-500 capitalize">{session?.user?.role?.toLowerCase().replace("_", " ") || "Admin"}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center gap-2 px-3 py-2.5 w-full bg-rose-500/10 text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
