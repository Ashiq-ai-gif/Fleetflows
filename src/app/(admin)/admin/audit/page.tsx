"use client";

import { FileText, Search, Filter, Download, LogIn, Edit, Settings, Trash2, AlertTriangle, User } from "lucide-react";

const logs = [
  { user: "Ashiq Rahaman", role: "Super Admin", action: "LOGIN", detail: "Logged in from 103.21.44.0", time: "00:38:12", date: "Apr 1, 2026", type: "auth" },
  { user: "Ashiq Rahaman", role: "Super Admin", action: "COMPANY_SUSPENDED", detail: "Suspended SmartMove Logistics (ID: 006)", time: "00:12:04", date: "Apr 1, 2026", type: "admin" },
  { user: "Priya Nair", role: "Support", action: "LOGIN_AS_TENANT", detail: "Impersonated TCS (tenant_id: tcs-001)", time: "23:54:00", date: "Mar 31, 2026", type: "critical" },
  { user: "Rahul Mehta", role: "Finance", action: "INVOICE_GENERATED", detail: "Generated invoice INV-2026-284 for Wipro", time: "23:40:18", date: "Mar 31, 2026", type: "billing" },
  { user: "System", role: "Auto", action: "PAYMENT_FAILED", detail: "Payment failed — Wipro Technologies ₹84,000", time: "23:00:00", date: "Mar 31, 2026", type: "alert" },
  { user: "Ashiq Rahaman", role: "Super Admin", action: "PLAN_UPDATED", detail: "HCL Technologies upgraded from Basic → Premium", time: "22:30:44", date: "Mar 31, 2026", type: "admin" },
  { user: "System", role: "Auto", action: "NEW_COMPANY_REGISTERED", detail: "TechCorp India registered (plan: Premium)", time: "22:01:55", date: "Mar 31, 2026", type: "system" },
  { user: "Priya Nair", role: "Support", action: "SETTINGS_MODIFIED", detail: "Changed notification config — rate limit 100→120", time: "21:30:12", date: "Mar 31, 2026", type: "admin" },
];

const actionColors: Record<string, string> = {
  auth: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  admin: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  critical: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  billing: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  alert: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  system: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white">Audit Logs</h1>
          <p className="text-sm text-slate-400 mt-0.5">Complete activity trail across the entire platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </header>

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input placeholder="Search logs..." className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <select className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none">
            <option>All Users</option>
            <option>Ashiq Rahaman</option>
            <option>Priya Nair</option>
            <option>Rahul Mehta</option>
          </select>
          <select className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none">
            <option>All Actions</option>
            <option>Auth Events</option>
            <option>Admin Actions</option>
            <option>Billing Events</option>
            <option>System Events</option>
          </select>
          <select className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        {/* Log Timeline */}
        <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Time", "User", "Action", "Details", "Type"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-white">{log.time}</p>
                    <p className="text-xs text-slate-500">{log.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {log.user === "System" ? "S" : log.user[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{log.user}</p>
                        <p className="text-xs text-slate-500">{log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold text-slate-200 bg-white/5 rounded-xl border border-white/10">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs">{log.detail}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${actionColors[log.type]}`}>{log.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
