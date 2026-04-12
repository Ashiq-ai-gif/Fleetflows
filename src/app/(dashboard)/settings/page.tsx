"use client";

import { Settings, Bell, Shield, Globe, Save, Zap } from "lucide-react";
import { useState } from "react";

function Toggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className={`relative w-11 h-6 rounded-full transition-all ${on ? "bg-blue-600" : "bg-slate-700"}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export default function TenantSettingsPage() {
  const [name, setName] = useState("Fleet Flows HQ");
  const [email, setEmail] = useState("admin@fleetflows.com");

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <header className="px-8 py-5 border-b border-slate-800 sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Configure your organization and notification preferences.</p>
      </header>

      <div className="p-8 max-w-3xl space-y-6">
        {/* Organization */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white">Organization Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Company Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Admin Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white">Notifications</h3>
          </div>
          <Toggle label="SOS Alert Emails" desc="Get email immediately when an employee triggers an SOS" defaultOn={true} />
          <Toggle label="Trip Completion Reports" desc="Daily summary of all completed trips" defaultOn={true} />
          <Toggle label="Driver Late Alerts" desc="Notify when a driver is >10 minutes late to pickup" defaultOn={false} />
          <Toggle label="Weekly Analytics Digest" desc="Receive weekly fleet performance summary every Monday" defaultOn={true} />
        </div>

        {/* Features */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-violet-400" />
            <h3 className="font-bold text-white">Feature Settings</h3>
          </div>
          <Toggle label="Live GPS Tracking" desc="Show real-time vehicle location on the live map" defaultOn={true} />
          <Toggle label="Employee Self-Booking" desc="Allow employees to book or cancel their own trips" defaultOn={false} />
          <Toggle label="Driver Rating System" desc="Let employees rate their trip after completion" defaultOn={true} />
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/30 hover:opacity-90 transition-all active:scale-95">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
