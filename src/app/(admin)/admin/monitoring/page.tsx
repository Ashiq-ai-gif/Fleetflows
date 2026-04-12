"use client";

import { Activity, Server, Database, Cpu, MemoryStick, Clock, AlertTriangle, CheckCircle, Wifi } from "lucide-react";

function GaugeBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-slate-300">{value}{typeof max === "number" && max === 100 ? "%" : ""}</span>
        <span className={`text-xs font-bold ${pct > 80 ? "text-rose-400" : pct > 60 ? "text-amber-400" : "text-emerald-400"}`}>
          {pct > 80 ? "Critical" : pct > 60 ? "Warning" : "Healthy"}
        </span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${pct > 80 ? "bg-rose-500" : pct > 60 ? "bg-amber-500" : color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const apiEndpoints = [
  { path: "/api/trips", p50: "48ms", p99: "210ms", rpm: "4,820", status: "healthy" },
  { path: "/api/tracking", p50: "22ms", p99: "98ms", rpm: "12,400", status: "healthy" },
  { path: "/api/auth", p50: "85ms", p99: "380ms", rpm: "1,240", status: "warning" },
  { path: "/api/employees", p50: "62ms", p99: "290ms", rpm: "880", status: "healthy" },
  { path: "/api/reports", p50: "240ms", p99: "1,240ms", rpm: "320", status: "critical" },
];

const jobs = [
  { name: "Trip Roster Generator", schedule: "Every 30m", lastRun: "2m ago", status: "completed" },
  { name: "Invoice Generator", schedule: "Daily 00:00", lastRun: "6h ago", status: "completed" },
  { name: "SMS Notification Queue", schedule: "Every 5m", lastRun: "1m ago", status: "running" },
  { name: "Fleet Analytics Aggregator", schedule: "Every 1h", lastRun: "58m ago", status: "completed" },
  { name: "Failed Payment Retry", schedule: "Every 6h", lastRun: "2h ago", status: "failed" },
];

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      <header className="px-8 py-5 border-b border-white/5 sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">System Monitoring</h1>
            <p className="text-sm text-slate-400 mt-0.5">Real-time infrastructure health and performance.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-emerald-400">All Systems Operational</span>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active Users", value: "1,842", icon: Wifi, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            { label: "API Req/min", value: "19,460", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "DB Query Time", value: "12ms", icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Error Rate", value: "0.08%", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-5 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Server Resources */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: "Web Server (Nginx)", host: "edge / VPS (configure in monitoring)", cpu: 38, mem: 52, disk: 41 },
            { title: "App Server (Node.js)", host: "localhost:3000", cpu: 62, mem: 71, disk: 55 },
            { title: "Database (PostgreSQL)", host: "localhost:5432", cpu: 28, mem: 45, disk: 68 },
          ].map(server => (
            <div key={server.title} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Server className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{server.title}</p>
                  <p className="text-xs text-slate-500">{server.host}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> CPU Usage</p>
                  <GaugeBar value={server.cpu} max={100} color="bg-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MemoryStick className="w-3.5 h-3.5" /> Memory</p>
                  <GaugeBar value={server.mem} max={100} color="bg-violet-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Disk</p>
                  <GaugeBar value={server.disk} max={100} color="bg-emerald-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* API Endpoints + Jobs */}
        <div className="grid grid-cols-2 gap-6">
          {/* API Table */}
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-white">API Endpoints</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Endpoint","p50","p99","RPM","Health"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map(ep => (
                  <tr key={ep.path} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-violet-300">{ep.path}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 font-medium">{ep.p50}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 font-medium">{ep.p99}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{ep.rpm}</td>
                    <td className="px-4 py-3">
                      <div className={`w-2 h-2 rounded-full mx-2 ${ep.status === "healthy" ? "bg-emerald-400" : ep.status === "warning" ? "bg-amber-400" : "bg-rose-400"}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Background Jobs */}
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-white">Background Jobs</h3>
            </div>
            <div className="divide-y divide-white/5">
              {jobs.map(job => (
                <div key={job.name} className="px-6 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    job.status === "completed" ? "bg-emerald-400" :
                    job.status === "running" ? "bg-blue-400 animate-pulse" : "bg-rose-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{job.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.schedule}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">{job.lastRun}</p>
                    <p className={`text-xs font-bold capitalize mt-0.5 ${
                      job.status === "completed" ? "text-emerald-400" :
                      job.status === "running" ? "text-blue-400" : "text-rose-400"
                    }`}>{job.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
