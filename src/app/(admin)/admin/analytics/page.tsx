"use client";

import { BarChart3, TrendingUp, Route, Truck, Users, Calendar, Filter } from "lucide-react";

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
          <div className={`w-full rounded-md ${color}`} style={{ height: `${(v / max) * 100}%`, minHeight: "4px" }} />
        </div>
      ))}
    </div>
  );
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data); const min = Math.min(...data);
  const w = 200; const h = 48;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

const kpis = [
  { label: "Vehicle Utilization", value: "78.4%", trend: "+4.2%", up: true, data: [65,70,68,72,75,74,78], color: "#8b5cf6" },
  { label: "Route Efficiency", value: "91.2%", trend: "+1.8%", up: true, data: [85,87,86,89,90,91,91], color: "#3b82f6" },
  { label: "Cost per Employee", value: "₹1,240", trend: "-3.1%", up: false, data: [1400,1380,1360,1320,1290,1260,1240], color: "#10b981" },
  { label: "Avg Trip Duration", value: "42 min", trend: "-2m", up: true, data: [48,46,46,44,44,43,42], color: "#f59e0b" },
];

const tripsByCompany = [4200, 3100, 2800, 2400, 1900, 1600, 1200, 900];
const companyNames = ["TCS", "Infosys", "Wipro", "HCL", "Tech M.", "Nexus", "Pioneer", "Others"];
const weeklyData = [8200, 8900, 9100, 8700, 9500, 9200, 9800, 9230];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white">Platform Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Global insights across all tenants and fleets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" /> All Companies
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* KPI Cards with Sparklines */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{k.label}</p>
              <div className="flex items-end justify-between mt-2 mb-3">
                <p className="text-2xl font-black text-white">{k.value}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${k.up ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"}`}>{k.trend}</span>
              </div>
              <SparkLine data={k.data} color={k.color} />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-1">Trips Over Time</h3>
            <p className="text-sm text-slate-400 mb-5">Daily trips across the entire platform — last 8 weeks</p>
            <BarChart data={weeklyData} color="bg-violet-500" />
            <div className="flex justify-between mt-2">
              {["W1","W2","W3","W4","W5","W6","W7","W8"].map(w => (
                <span key={w} className="text-[10px] text-slate-600 font-medium">{w}</span>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-1">Trips by Company</h3>
            <p className="text-sm text-slate-400 mb-5">Top 8 tenants by total trip volume</p>
            <div className="space-y-3">
              {companyNames.map((name, i) => {
                const pct = Math.round((tripsByCompany[i] / 4200) * 100);
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium w-16 text-right">{name}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white w-12">{tripsByCompany[i].toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: "Fleet Utilization by Type", items: [{ label: "SUVs", pct: 84, color: "bg-violet-500" }, { label: "Sedans", pct: 72, color: "bg-blue-500" }, { label: "Vans", pct: 61, color: "bg-emerald-500" }, { label: "Buses", pct: 45, color: "bg-amber-500" }] },
            { title: "Peak Hours Traffic", items: [{ label: "7–9 AM", pct: 95, color: "bg-rose-500" }, { label: "12–2 PM", pct: 45, color: "bg-amber-500" }, { label: "5–8 PM", pct: 88, color: "bg-orange-500" }, { label: "Other", pct: 22, color: "bg-slate-600" }] },
            { title: "Route Completion Rate", items: [{ label: "On Time", pct: 78, color: "bg-emerald-500" }, { label: "Delayed (<15m)", pct: 14, color: "bg-amber-500" }, { label: "Delayed (>15m)", pct: 6, color: "bg-orange-500" }, { label: "Cancelled", pct: 2, color: "bg-rose-500" }] },
          ].map(section => (
            <div key={section.title} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-5">{section.title}</h3>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-300 font-medium">{item.label}</span>
                      <span className="text-sm font-bold text-white">{item.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
