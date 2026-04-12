"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, User } from "lucide-react";

export default function MobileTabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/driver", icon: Home },
    { name: "Trips", href: "/driver/trips", icon: Map },
    { name: "Profile", href: "/driver/profile", icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col h-[100dvh]">
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Floating Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0d0d18]/90 backdrop-blur-xl border-t border-white/5 px-6 pb-2 pt-2 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto h-full">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${
                  isActive ? "text-violet-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-violet-500/20" : "bg-transparent"}`}>
                  <Icon className={`w-6 h-6 ${isActive ? "fill-violet-500/20" : ""}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-wide ${isActive ? "text-violet-300" : "text-slate-500"}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
