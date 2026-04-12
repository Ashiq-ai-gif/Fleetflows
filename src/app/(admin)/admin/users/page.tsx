"use client";

import { Users, Plus, Shield, Edit, Trash2, Check, X } from "lucide-react";

const users = [
  { name: "Ashiq Rahaman", email: "admin@fleetflows.com", role: "Super Admin", status: "Active", lastLogin: "Just now" },
  { name: "Priya Nair", email: "priya@fleetflows.com", role: "Support", status: "Active", lastLogin: "2h ago" },
  { name: "Rahul Mehta", email: "rahul@fleetflows.com", role: "Finance", status: "Active", lastLogin: "Yesterday" },
  { name: "Ananya Singh", email: "ananya@fleetflows.com", role: "Support", status: "Inactive", lastLogin: "5 days ago" },
];

const permissions: Record<string, Record<string, boolean>> = {
  "Super Admin": { companies: true, billing: true, analytics: true, users: true, monitoring: true, audit: true, settings: true },
  "Support": { companies: true, billing: false, analytics: true, users: false, monitoring: true, audit: true, settings: false },
  "Finance": { companies: false, billing: true, analytics: true, users: false, monitoring: false, audit: true, settings: false },
};

const modules = ["companies", "billing", "analytics", "users", "monitoring", "audit", "settings"];

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white">Users & Roles</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage platform users and role-based access control.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-900/30 transition-all active:scale-95 hover:opacity-90">
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </header>

      <div className="p-8 space-y-8">
        {/* Users */}
        <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white">Platform Users</h3>
            <span className="text-xs font-bold text-slate-500">{users.length} users</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["User", "Role", "Status", "Last Active", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center font-bold text-white text-sm border border-white/10">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                      u.role === "Super Admin" ? "bg-violet-500/15 text-violet-300 border-violet-500/30" :
                      u.role === "Finance" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                      "bg-blue-500/15 text-blue-300 border-blue-500/30"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className={`text-xs font-bold ${u.status === "Active" ? "text-emerald-400" : "text-slate-500"}`}>{u.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permissions Matrix */}
        <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <h3 className="font-bold text-white">Permissions Matrix</h3>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest pb-4 pr-8">Module</th>
                  {Object.keys(permissions).map(role => (
                    <th key={role} className="text-center text-xs font-bold pb-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full border ${
                        role === "Super Admin" ? "bg-violet-500/15 text-violet-300 border-violet-500/30" :
                        role === "Finance" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                        "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}>{role}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <tr key={mod} className="border-t border-white/5">
                    <td className="py-3 pr-8 text-sm text-slate-300 font-medium capitalize">{mod}</td>
                    {Object.keys(permissions).map(role => (
                      <td key={role} className="py-3 px-6 text-center">
                        {permissions[role][mod]
                          ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
