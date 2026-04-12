"use client";

import {
  Building2, CreditCard, Users, Truck, Route, TrendingUp,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle,
  Clock, MoreHorizontal, Zap, Bell, RefreshCw
} from "lucide-react";

const statCards = [
  { label: "Total Companies", value: "284", change: "+12", trend: "up", icon: Building2, color: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-400", border: "border-violet-500/20" },
  { label: "Active vs Suspended", value: "278/6", change: "-2", trend: "down", icon: AlertCircle, color: "from-rose-500/20 to-rose-600/5", iconColor: "text-rose-400", border: "border-rose-500/20" },
  { label: "Total Employees", value: "18,420", change: "+340", trend: "up", icon: Users, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", border: "border-emerald-500/20" },
  { label: "Active Vehicles", value: "3,812", change: "+56", trend: "up", icon: Truck, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400", border: "border-amber-500/20" },
  { label: "Total Trips (Monthly)", value: "245K", change: "+14%", trend: "up", icon: Route, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400", border: "border-blue-500/20" },
  { label: "Monthly Revenue", value: "₹48.2L", change: "+18.4%", trend: "up", icon: TrendingUp, color: "from-indigo-500/20 to-indigo-600/5", iconColor: "text-indigo-400", border: "border-indigo-500/20" },
];

const recentActivity = [
  { type: "company", text: "TechCorp India signed up on Premium plan", time: "2m ago", icon: Building2, color: "text-violet-400" },
  { type: "payment", text: "Infosys paid ₹84,000 (Annual Enterprise)", time: "14m ago", icon: CreditCard, color: "text-emerald-400" },
  { type: "alert", text: "Failed payment — Wipro (₹12,000 overdue)", time: "1h ago", icon: AlertCircle, color: "text-rose-400" },
  { type: "company", text: "SmartMove Logistics joined on Basic plan", time: "3h ago", icon: Building2, color: "text-violet-400" },
  { type: "payment", text: "HCL Technologies renewed Premium subscription", time: "5h ago", icon: CheckCircle, color: "text-emerald-400" },
  { type: "alert", text: "Server latency spike (API p99: 1240ms)", time: "6h ago", icon: AlertCircle, color: "text-amber-400" },
];

const alerts = [
  { title: "Failed Payment", desc: "Wipro Ltd — ₹12,000 overdue for 3 days", sev: "high" },
  { title: "High API Latency", desc: "p99 response time above 1s threshold", sev: "med" },
  { title: "Trial Expiring Soon", desc: "8 companies on trial expiring this week", sev: "low" },
];

const revenueData = [22, 28, 24, 32, 38, 35, 42, 39, 48, 52, 49, 58];
const tripData = [85, 92, 78, 95, 88, 102, 96, 110, 88, 105, 98, 115];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className={`w-full rounded-sm ${color} opacity-80 transition-all`}
            style={{ height: `${(v / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const w = 280; const h = 64;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16 overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={pts} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      {/* Top bar */}
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Platform Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back, Ashiq. Here's your live platform snapshot.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <div className="relative">
            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
              <Bell className="w-5 h-5 text-slate-300" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold flex items-center justify-center">3</span>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-6 gap-4">
          {statCards.map((c) => (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} border ${c.border} rounded-2xl p-5 space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{c.label}</span>
                <c.icon className={`w-4 h-4 ${c.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {c.trend === "up"
                    ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    : <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
                  <span className={`text-xs font-bold ${c.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>{c.change} this month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white">Monthly Revenue</h3>
                <p className="text-sm text-slate-400 mt-0.5">₹48.2L this month — <span className="text-emerald-400 font-semibold">▲ 18.4%</span></p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">2026</span>
            </div>
            <MiniLineChart data={revenueData} color="#8b5cf6" />
            <div className="flex justify-between mt-2">
              {months.map(m => <span key={m} className="text-[9px] text-slate-600 font-medium">{m}</span>)}
            </div>
          </div>

          {/* Onboarding Chart */}
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white">Company Onboarding</h3>
                <p className="text-sm text-slate-400 mt-0.5">28 new companies this month — <span className="text-emerald-400 font-semibold">▲ 12%</span></p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Monthly Trend</span>
            </div>
            <MiniBarChart data={tripData} color="bg-emerald-500" />
            <div className="flex justify-between mt-2">
              {months.map(m => <span key={m} className="text-[9px] text-slate-600 font-medium">{m}</span>)}
            </div>
          </div>
        </div>

        {/* Activity + Alerts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="col-span-2 bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Recent Activity</h3>
              <button className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <a.icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">{a.text}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap font-medium mt-0.5">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">System Alerts</h3>
              <span className="w-5 h-5 bg-rose-500/20 border border-rose-500/30 rounded-full text-[10px] font-bold text-rose-400 flex items-center justify-center">3</span>
            </div>
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className={`p-4 rounded-xl border ${
                  a.sev === "high" ? "bg-rose-500/5 border-rose-500/20" :
                  a.sev === "med" ? "bg-amber-500/5 border-amber-500/20" :
                  "bg-blue-500/5 border-blue-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={`w-3.5 h-3.5 ${a.sev === "high" ? "text-rose-400" : a.sev === "med" ? "text-amber-400" : "text-blue-400"}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${a.sev === "high" ? "text-rose-400" : a.sev === "med" ? "text-amber-400" : "text-blue-400"}`}>{a.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-white/5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h4>
              <div className="space-y-2">
                {["Add New Company", "Generate Invoice", "View All Logs"].map(a => (
                  <button key={a} className="w-full text-left text-sm text-slate-300 hover:text-white px-3 py-2 hover:bg-white/5 rounded-lg transition-all font-medium flex items-center justify-between group">
                    {a} <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>;
}
