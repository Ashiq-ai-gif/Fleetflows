"use client";

import { Settings, Shield, Bell, Globe, Lock, Save, RefreshCw, Smartphone, Mail, Sliders } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      <header className="px-8 py-5 border-b border-white/5 sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-400 mt-0.5">Control global configurations and system-wide defaults.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </header>

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-3 gap-8">
           {/* Sidebar Links */}
           <div className="space-y-1">
              {[
                { icon: Globe, label: "General", active: true },
                { icon: Shield, label: "Security & Auth" },
                { icon: Bell, label: "Notifications" },
                { icon: Mail, label: "Email SMTP" },
                { icon: Smartphone, label: "Mobile Apps" },
                { icon: Sliders, label: "Feature Toggles" },
              ].map(item => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? "bg-white/10 text-white border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
           </div>

           {/* Content */}
           <div className="col-span-2 space-y-8">
              <div className="bg-[#0d0d18] border border-white/5 rounded-3xl p-8 space-y-6">
                 <div>
                   <h3 className="text-lg font-bold text-white mb-1">General Platform Info</h3>
                   <p className="text-xs text-slate-500">Public facing platform branding and details.</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Platform Name</label>
                      <input defaultValue="Fleet Flows ETMS" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-600/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Support Email</label>
                      <input defaultValue="support@fleetflows.io" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-600/50 transition-all" />
                    </div>
                 </div>
              </div>

              <div className="bg-[#0d0d18] border border-white/5 rounded-3xl p-8 space-y-6">
                 <div>
                   <h3 className="text-lg font-bold text-white mb-1">Global System Configuration</h3>
                   <p className="text-xs text-slate-500">Fine-tune system behaviors and defaults for all tenants.</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                       <div>
                         <p className="text-sm font-bold text-slate-200">New Tenant Auto-Activation</p>
                         <p className="text-xs text-slate-500">Automatically activate companies after signup.</p>
                       </div>
                       <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                          <div className="absolute right-1 w-4 h-4 bg-white rounded-full" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                       <div>
                         <p className="text-sm font-bold text-slate-200">Maintenance Mode</p>
                         <p className="text-xs text-slate-500">Disable platform access for all non-admin users.</p>
                       </div>
                       <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-pointer">
                          <div className="absolute left-1 w-4 h-4 bg-slate-500 rounded-full" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-8">
                 <h3 className="text-lg font-bold text-rose-400 mb-1">Danger Zone</h3>
                 <p className="text-xs text-rose-500/60 mb-6">Irreversible actions that affect the entire platform.</p>
                 <button className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-rose-500/20 transition-all">Reset All System Logs</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
