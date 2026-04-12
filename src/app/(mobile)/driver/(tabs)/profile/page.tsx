"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserCircle, Car, Settings, HelpCircle, LogOut } from "lucide-react";

export default function DriverProfile() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/driver/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black tracking-tight mb-8 mt-4">Profile</h1>

      {/* Profile Card */}
      <div className="bg-[#0d0d18] border border-white/10 rounded-3xl p-6 flex items-center gap-5 mb-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <UserCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{session.user.name}</h2>
          <p className="text-slate-400 font-medium mt-0.5">{session.user.email}</p>
          <div className="inline-block mt-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 tracking-wider uppercase">
            {session.user.tenantName}
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white/5 rounded-3xl p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Vehicle</p>
            <p className="text-white font-bold">Toyota HiAce (Van)</p>
            <p className="text-slate-400 text-sm mt-0.5">DL-8C-AA-2345</p>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="bg-[#0d0d18] border border-white/10 rounded-3xl overflow-hidden mb-8">
        {[
          { icon: Settings, label: "Account Settings" },
          { icon: HelpCircle, label: "Support & Help" }
        ].map((item, i) => (
          <button 
            key={i}
            className="w-full flex items-center gap-4 p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-left"
          >
            <item.icon className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-200 text-[15px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="w-full h-14 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>

      <p className="text-center text-slate-600 text-xs font-semibold mt-8">Fleet Flows Driver App v1.0</p>
    </div>
  );
}
