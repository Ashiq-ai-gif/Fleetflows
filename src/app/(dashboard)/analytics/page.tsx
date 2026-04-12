"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Route, Truck, Users, Clock, ArrowUpRight, ArrowDownRight, Calendar, Map, DollarSign, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

function Bar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className={`w-full rounded-sm ${color} opacity-80 transition-all hover:opacity-100`} style={{ height: `${(v / max) * 100}%`, minHeight: "3px" }} />
        </div>
      ))}
    </div>
  );
}

const weekData = [82, 95, 88, 102, 91, 108, 96];
const performanceData = [92, 88, 95, 91, 94, 96, 93];
const costData = [450, 480, 420, 510, 490, 530, 470];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    totalEmployees: 0,
    totalVehicles: 0,
    estimatedDistance: 0,
    costPerEmployee: 0,
    safetyScore: 0
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/reports/operational");
        if(res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {}
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Operational Reports</h1>
          <p className="text-sm text-slate-400 mt-0.5">Deep insights into trips, distance, and fleet efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Trips", value: stats.totalTrips, change: "+12%", up: true, icon: Route, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Dist. Traveled", value: `${stats.estimatedDistance} KM`, change: "+8%", up: true, icon: Map, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            { label: "Fleet Readiness", value: `${stats.totalVehicles} Vehicles`, change: "+2", up: true, icon: Truck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Safety Score", value: `${stats.safetyScore}/100`, change: "Stable", up: true, icon: Clock, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
            { label: "Cost/Employee", value: `₹${stats.costPerEmployee}`, change: "-5%", up: true, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          ].map(k => (
            <div key={k.label} className={`${k.bg} border rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{k.label}</p>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className="text-xl font-black text-white leading-tight">{k.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {k.up ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-rose-400" />}
                <span className={`text-[10px] font-bold ${k.up ? "text-emerald-400" : "text-rose-400"}`}>{k.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white">Daily Trip Volume</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Trips completed across all shifts</p>
                </div>
             </div>
             <Bar data={weekData} color="bg-blue-600" />
             <div className="flex justify-between mt-4">
                {days.map(d => <span key={d} className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{d}</span>)}
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white">Cost per Employee Trend</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Daily operational cost per seat</p>
                </div>
             </div>
             <Bar data={costData} color="bg-amber-600" />
             <div className="flex justify-between mt-4">
                {days.map(d => <span key={d} className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{d}</span>)}
             </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white tracking-tight">Top Performing Drivers</h3>
                <button className="text-blue-500 text-xs font-bold hover:underline">View Detailed Perf.</button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Driver Name</th>
                    <th className="px-6 py-4">Trips Done</th>
                    <th className="px-6 py-4 text-center">On-Time %</th>
                    <th className="px-6 py-4 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { name: "Rajesh Kumar", trips: 142, ot: "98%", r: "4.9" },
                    { name: "Suresh Nair", trips: 138, ot: "96%", r: "4.8" },
                    { name: "Amit Verma", trips: 145, ot: "95%", r: "4.7" },
                    { name: "Priya Singh", trips: 120, ot: "99%", r: "5.0" },
                  ].map((d, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-200 text-sm">{d.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{d.trips} Trips</td>
                      <td className="px-6 py-4 text-center"><span className="text-sm font-black text-emerald-500">{d.ot}</span></td>
                      <td className="px-6 py-4 text-right"><span className="text-sm font-bold text-amber-500">★ {d.r}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="font-bold text-white tracking-tight">Delay Reports</h3>
              <div className="space-y-4">
                 {[
                   { reason: "Traffic Congestion", count: 24, p: 45, color: "bg-rose-500" },
                   { reason: "Vehicle Maintenance", count: 12, p: 25, color: "bg-amber-500" },
                   { reason: "Driver Latency", count: 8, p: 15, color: "bg-indigo-500" },
                   { reason: "Employee No-show", count: 6, p: 10, color: "bg-slate-500" },
                 ].map(d => (
                   <div key={d.reason} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-slate-400">{d.reason}</span>
                       <span className="text-white">{d.count}</span>
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", d.color)} style={{ width: `${d.p}%` }} />
                     </div>
                   </div>
                 ))}
              </div>
              <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Download Delay Analysis</button>
           </div>
        </div>
      </div>
    </div>
  );
}
