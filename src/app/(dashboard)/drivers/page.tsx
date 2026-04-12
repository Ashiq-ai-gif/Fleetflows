"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Phone, Star, Shield, X, Loader2, CheckCircle, Edit, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type Driver = { id: string; name: string; phone: string; licenseNumber: string; rating: number; status: string; };

function AddDriverModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", licenseNumber: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/drivers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onSuccess(); onClose();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div><h2 className="font-bold text-white">Onboard Driver</h2><p className="text-xs text-slate-400 mt-0.5">Add a new driver to your fleet</p></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: "Full Name *", key: "name", placeholder: "Rajesh Kumar", type: "text" },
            { label: "Phone Number *", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
            { label: "License Number *", key: "licenseNumber", placeholder: "DL-0120110149646", type: "text" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">{f.label}</label>
              <input required type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
            </div>
          ))}
          {error && <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl"><X className="w-4 h-4 text-rose-400 flex-shrink-0" /><p className="text-sm text-rose-300">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : <><UserPlus className="w-4 h-4" /> Onboard Driver</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchDrivers = async () => {
    setLoading(true);
    try { const res = await fetch("/api/drivers"); const data = await res.json(); setDrivers(data.drivers || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleSuccess = () => { setSuccessMsg("Driver onboarded successfully!"); fetchDrivers(); setTimeout(() => setSuccessMsg(""), 4000); };

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 space-y-6">
      {showModal && <AddDriverModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Driver Fleet</h2>
          <p className="text-slate-400 text-sm">Manage your transport drivers. <span className="text-blue-400 font-semibold">{drivers.length} drivers</span></p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <UserPlus className="w-4 h-4" /> Onboard Driver
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" /><p className="text-sm font-semibold text-emerald-300">{successMsg}</p>
        </div>
      )}

      <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or license..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-600 transition-all" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700"><Filter className="w-3 h-3" />Filter</button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /><span className="ml-3 text-slate-400">Loading drivers...</span></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <UserPlus className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 font-semibold">{search ? "No drivers match your search" : "No drivers yet"}</p>
            {!search && <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all">Onboard First Driver</button>}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Driver</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">License</th><th className="px-6 py-4">Rating</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(driver => (
                <tr key={driver.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-400 text-sm">{driver.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                      <div><p className="text-sm font-bold text-white">{driver.name}</p><span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ID: {driver.id.slice(0, 8)}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-slate-300"><Phone className="w-3.5 h-3.5 text-slate-500" /><span className="text-xs font-medium">{driver.phone}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-slate-500" /><span className="text-xs font-bold text-slate-400">{driver.licenseNumber}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit"><Star className="w-3 h-3 fill-amber-500" /><span className="text-xs font-black">{driver.rating.toFixed(1)}</span></div></td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      driver.status === "available" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      driver.status === "on-trip" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    )}>{driver.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
