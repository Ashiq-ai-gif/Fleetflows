"use client";

import { useState, useEffect } from "react";
import { Plus, Truck, Users, Settings, MoreHorizontal, X, Loader2, CheckCircle, Search, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Vehicle = { id: string; model: string; plateNumber: string; capacity: number; type: string; status: string; };

function AddVehicleModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ model: "", plateNumber: "", capacity: "", type: "sedan" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
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
          <div><h2 className="font-bold text-white">Add Vehicle</h2><p className="text-xs text-slate-400 mt-0.5">Register a new vehicle to your fleet</p></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Vehicle Model *</label>
            <input required value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="Toyota Innova Crysta" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Plate Number *</label>
            <input required value={form.plateNumber} onChange={e => setForm(f => ({ ...f, plateNumber: e.target.value }))} placeholder="DL 01 AB 1234" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Capacity *</label>
              <input required type="number" min="1" max="60" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="7" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/60 transition-all">
                {["sedan", "suv", "van", "bus", "tempo"].map(t => <option key={t} value={t} className="bg-slate-900 capitalize">{t.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl"><X className="w-4 h-4 text-rose-400 flex-shrink-0" /><p className="text-sm text-rose-300">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : <><Plus className="w-4 h-4" />Add Vehicle</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchVehicles = async () => {
    setLoading(true);
    try { const res = await fetch("/api/vehicles"); const data = await res.json(); setVehicles(data.vehicles || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleSuccess = () => { setSuccessMsg("Vehicle registered successfully!"); fetchVehicles(); setTimeout(() => setSuccessMsg(""), 4000); };

  const filtered = vehicles.filter(v => v.model.toLowerCase().includes(search.toLowerCase()) || v.plateNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 space-y-6">
      {showModal && <AddVehicleModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Vehicles</h2>
          <p className="text-slate-400 text-sm">Manage your vehicle registry and capacity. <span className="text-blue-400 font-semibold">{vehicles.length} vehicles</span></p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <Plus className="w-4 h-4" /> Add Vehicle
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by model or plate number..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-600 transition-all" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /><span className="ml-3 text-slate-400">Loading vehicles...</span></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Truck className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">{search ? "No vehicles match your search" : "No vehicles registered yet"}</p>
          {!search && <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all">Add First Vehicle</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(vehicle => (
            <div key={vehicle.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-600/20"><Truck className="w-6 h-6" /></div>
                  <div><h4 className="text-lg font-bold text-white leading-tight">{vehicle.model}</h4><p className="text-xs font-black uppercase tracking-widest text-slate-500">{vehicle.plateNumber}</p></div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Users className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase tracking-wider">Capacity</span></div>
                  <p className="text-sm font-bold text-white">{vehicle.capacity} Seats</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Settings className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase tracking-wider">Type</span></div>
                  <p className="text-sm font-bold text-white uppercase">{vehicle.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", vehicle.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20")}>{vehicle.status}</span>
                <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Service History</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
