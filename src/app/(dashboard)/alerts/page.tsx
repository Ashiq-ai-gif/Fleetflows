"use client";

import { AlertTriangle, Phone, MapPin, Clock, CheckCircle, XCircle, Siren } from "lucide-react";
import { useState } from "react";

const alerts = [
  { id: "SOS-001", employee: "Meera Kapoor", driver: "Rajesh Kumar", vehicle: "FF-001", location: "NH-48, near Manesar Toll", time: "09:14 AM", status: "active", type: "SOS" },
  { id: "SOS-002", employee: "Arun Patel", driver: "Suresh Nair", vehicle: "FF-002", location: "MG Road, Gurgaon", time: "08:52 AM", status: "resolved", type: "SOS" },
  { id: "ALT-003", employee: null, driver: "Amit Verma", vehicle: "FF-003", location: "Noida Expressway", time: "08:30 AM", status: "acknowledged", type: "BREAKDOWN" },
  { id: "ALT-004", employee: "Sunita Rao", driver: "Priya Singh", vehicle: "FF-004", location: "Dwarka Expressway", time: "Yesterday 06:45 PM", status: "resolved", type: "LATE" },
];

export default function AlertsPage() {
  const [alerts2, setAlerts2] = useState(alerts);

  const resolve = (id: string) => setAlerts2(a => a.map(x => x.id === id ? { ...x, status: "resolved" } : x));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Siren className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SOS Alerts</h1>
            <p className="text-sm text-slate-400 mt-0.5">Emergency and safety monitoring.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm font-bold text-rose-400">1 Active SOS</span>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Active SOS first */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts2.filter(a => a.status === "active").map(alert => (
              <div key={alert.id} className="bg-rose-500/5 border-2 border-rose-500/30 rounded-2xl p-6 animate-pulse-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 text-xs font-black bg-rose-500 text-white rounded-full">{alert.type}</span>
                      <span className="text-xs text-slate-500 font-medium">{alert.id}</span>
                    </div>
                    <p className="text-white font-bold text-lg">{alert.employee || alert.driver} needs help!</p>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{alert.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>Driver: {alert.driver}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white text-sm font-bold rounded-xl transition-all">
                      <Phone className="w-4 h-4" /> Call Driver
                    </button>
                    <button onClick={() => resolve(alert.id)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold rounded-xl transition-all">
                      <CheckCircle className="w-4 h-4" /> Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Alert History</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
            {alerts2.filter(a => a.status !== "active").map(alert => (
              <div key={alert.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${alert.status === "resolved" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                  {alert.status === "resolved" ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{alert.type} — {alert.employee || alert.driver}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.location} · {alert.time}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${
                  alert.status === "resolved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>{alert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
