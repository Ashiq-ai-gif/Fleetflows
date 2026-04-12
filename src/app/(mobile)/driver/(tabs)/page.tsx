import { Car, Clock, MapPin, Power, ShieldAlert, Navigation } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DriverDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DRIVER") {
    redirect("/driver/login");
  }

  // MVP: Hardcoded state, soon to be hooked up to DB
  const isOnline = true;

  return (
    <div className="p-6">
      {/* Header & Status Toggle */}
      <div className="flex items-center justify-between mt-6 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Good Morning,</h1>
          <p className="text-slate-400 font-medium">{session.user.name}</p>
        </div>
        
        {/* Huge Status Toggle */}
        <button 
          className={`relative w-36 h-14 rounded-full p-1.5 transition-all outline-none ${
            isOnline ? "bg-emerald-500/20 shadow-lg shadow-emerald-500/20" : "bg-white/10"
          }`}
        >
          <div className={`absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOnline ? "right-1.5 bg-emerald-500 shadow-md shadow-emerald-900/50" : "left-1.5 bg-slate-500"
          }`}>
            <Power className="w-5 h-5 text-white" />
          </div>
          <span className={`absolute top-1/2 -translate-y-1/2 font-bold text-sm tracking-wide ${
            isOnline ? "left-5 text-emerald-400" : "right-5 text-slate-400"
          }`}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </button>
      </div>

      {/* Next Trip Card */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Next Assigned Trip</h2>
        
        {isOnline ? (
          <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl p-6 shadow-2xl shadow-violet-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            
            <div className="flex items-center justify-between mb-5 relative z-10">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                Trip #1042
              </span>
              <div className="flex items-center gap-1.5 text-white/90">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">09:00 AM</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-between py-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  <div className="w-0.5 h-6 bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]" />
                </div>
                <div>
                  <div className="mb-3">
                    <p className="text-white font-bold text-[17px]">Tech Park Sector 4</p>
                    <p className="text-white/70 text-sm">Pickup • 5 Employees</p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[17px]">Central Station</p>
                    <p className="text-white/70 text-sm">Drop-off</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-white text-violet-600 hover:bg-white/90 h-14 rounded-2xl font-black text-[17px] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Navigation className="w-5 h-5 fill-violet-600" /> Start Navigation
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Power className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-white font-bold text-lg mb-1">You are Offline</p>
            <p className="text-slate-400 text-sm">Go Online to receive trip assignments and start tracking.</p>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Today's Trips</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">4</span>
            <span className="text-sm font-semibold text-slate-500">/ 6 Done</span>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Distance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">42</span>
            <span className="text-sm font-semibold text-slate-500">km</span>
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <button className="w-full h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-3xl font-black text-[17px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
        <ShieldAlert className="w-6 h-6" /> EMERGENCY S.O.S
      </button>

    </div>
  );
}
