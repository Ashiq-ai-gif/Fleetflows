"use client";

import { MapPin, Truck, Users, RefreshCw, AlertCircle } from "lucide-react";

const activeVehicles = [
  { id: "FF-001", driver: "Rajesh Kumar", route: "Sector 18 → DLF Phase 4", employees: 8, lat: "28.6129", lng: "77.2295", eta: "9 min", status: "on-route" },
  { id: "FF-002", driver: "Suresh Nair", route: "Huda City Centre → Gurgaon", employees: 6, lat: "28.4595", lng: "77.0266", eta: "14 min", status: "on-route" },
  { id: "FF-003", driver: "Amit Verma", route: "Noida Sector 62 → Okhla", employees: 12, lat: "28.6280", lng: "77.3649", eta: "22 min", status: "on-route" },
  { id: "FF-004", driver: "Priya Singh", route: "Dwarka → Cyber City", employees: 9, lat: "28.5665", lng: "77.0421", eta: "Arrived", status: "arrived" },
];

export default function LiveMapPage() {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-8 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Live Map</h1>
          <p className="text-sm text-slate-400 mt-0.5">Real-time fleet tracking — <span className="text-emerald-400 font-semibold">4 vehicles active</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">LIVE</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Map Placeholder */}
        <div className="flex-1 relative bg-[#0d1117] flex items-center justify-center">
          {/* Grid background pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Fake roads */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600">
            <line x1="0" y1="300" x2="1000" y2="300" stroke="#475569" strokeWidth="3" />
            <line x1="500" y1="0" x2="500" y2="600" stroke="#475569" strokeWidth="3" />
            <line x1="0" y1="150" x2="1000" y2="450" stroke="#475569" strokeWidth="2" />
            <line x1="0" y1="450" x2="700" y2="100" stroke="#475569" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="600" stroke="#475569" strokeWidth="1.5" />
            <line x1="800" y1="0" x2="800" y2="600" stroke="#475569" strokeWidth="1.5" />
          </svg>

          {/* Vehicle pins */}
          {activeVehicles.map((v, i) => {
            const positions = [
              { top: "35%", left: "30%" },
              { top: "60%", left: "55%" },
              { top: "25%", left: "70%" },
              { top: "55%", left: "22%" },
            ];
            return (
              <div key={v.id} className="absolute group cursor-pointer" style={positions[i]}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 ${v.status === "arrived" ? "bg-emerald-500/90 border-emerald-400" : "bg-blue-600/90 border-blue-400"} animate-bounce`} style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2s" }}>
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <p className="text-white font-bold text-sm">{v.id}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{v.driver}</p>
                  <p className="text-slate-300 text-xs mt-1 truncate">{v.route}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-3 h-3 text-slate-400" /><span className="text-xs text-slate-300">{v.employees} emp</span>
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${v.status === "arrived" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>{v.eta}</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-white absolute -bottom-1 left-1/2 -translate-x-1/2" />
              </div>
            );
          })}

          {/* API notice */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300">Connect <span className="text-amber-400 font-bold">Google Maps API</span> for live satellite view</span>
          </div>
        </div>

        {/* Vehicle List Panel */}
        <div className="w-80 border-l border-slate-800 bg-[#0d1117] flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800">
            <h3 className="font-bold text-white">Active Vehicles</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeVehicles.length} on route right now</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
            {activeVehicles.map(v => (
              <div key={v.id} className="px-5 py-4 hover:bg-slate-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${v.status === "arrived" ? "bg-emerald-500/15" : "bg-blue-500/15"}`}>
                    <Truck className={`w-4 h-4 ${v.status === "arrived" ? "text-emerald-400" : "text-blue-400"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{v.id}</p>
                    <p className="text-xs text-slate-400">{v.driver}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.status === "arrived" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
                    {v.eta}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{v.route}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Users className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{v.employees} employees</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
