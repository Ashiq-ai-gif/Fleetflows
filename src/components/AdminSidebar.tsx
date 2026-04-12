"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Building2, CreditCard, BarChart3,
  Users, Settings, Activity, FileText, LogOut,
  ChevronRight, Shield, Bell, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Building2, label: "Companies", href: "/admin/companies" },
  { icon: CreditCard, label: "Subscriptions & Plans", href: "/admin/billing" },
  { icon: BarChart3, label: "Platform Analytics", href: "/admin/analytics" },
  { icon: Users, label: "Users & Roles", href: "/admin/users" },
  { icon: Activity, label: "System Monitoring", href: "/admin/monitoring" },
  { icon: FileText, label: "Audit Logs", href: "/admin/audit" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0a0a0f] text-slate-300 flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-violet-900/30">
          F
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">Fleet Flows</h1>
          <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-widest">Super Admin</p>
        </div>
      </div>

      {/* Badge */}
      <div className="mx-4 mt-4 mb-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-[11px] font-bold text-violet-300">Platform Control</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-blue-600/10 text-white border border-violet-500/20"
                  : "hover:bg-white/5 hover:text-white text-slate-400"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Ashiq Rahaman</p>
            <p className="text-xs text-violet-400 font-medium">Super Admin</p>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
