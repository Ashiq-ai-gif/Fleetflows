"use client";

import { useState, useEffect, useRef } from "react";
import { Search, UserPlus, Mail, MapPin, Filter, MoreHorizontal, X, Loader2, CheckCircle, Edit, Trash2, Download } from "lucide-react";
import Papa from "papaparse";

type Employee = { id: string; name: string; email: string; department: string | null; pickupLocation: string | null; shift: string | null; status: string; };

function AddEmployeeModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", department: "", pickupLocation: "", shift: "Morning" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onSuccess(); onClose();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div><h2 className="font-bold text-white">Add Employee</h2><p className="text-xs text-slate-400 mt-0.5">Register a new employee to the transport roster</p></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Priya Sharma" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="priya@company.com" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Department</label>
              <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/60 transition-all">
                <option value="">Select...</option>
                {["Engineering", "Product", "Design", "HR", "Finance", "Sales", "Marketing", "Operations"].map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Shift</label>
              <select value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/60 transition-all">
                {["Morning", "Afternoon", "Night", "General"].map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Pickup Location</label>
              <input value={form.pickupLocation} onChange={e => setForm(f => ({ ...f, pickupLocation: e.target.value }))} placeholder="e.g. Sector 18, Noida" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all" />
            </div>
          </div>
          {error && <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl"><X className="w-4 h-4 text-rose-400 flex-shrink-0" /><p className="text-sm text-rose-300">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : <><UserPlus className="w-4 h-4" /> Add Employee</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/employees/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employees: results.data })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          
          setSuccessMsg(data.message || "Bulk upload successful!");
          fetchEmployees();
          setTimeout(() => setSuccessMsg(""), 5000);
        } catch (error: any) {
          alert(error.message || "Failed to upload CSV");
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        alert("Error parsing CSV file");
        setIsUploading(false);
      }
    });
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try { const res = await fetch("/api/employees"); const data = await res.json(); setEmployees(data.employees || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSuccess = () => { setSuccessMsg("Employee added successfully!"); fetchEmployees(); setTimeout(() => setSuccessMsg(""), 4000); };

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 space-y-6">
      {showModal && <AddEmployeeModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Employee Directory</h2>
          <p className="text-slate-400 text-sm">Manage your corporate transport roster. <span className="text-blue-400 font-semibold">{employees.length} employees</span></p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl font-bold text-sm hover:text-white transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isUploading ? "Uploading..." : "Bulk Upload"}
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" /><p className="text-sm font-semibold text-emerald-300">{successMsg}</p>
        </div>
      )}

      <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by name or email..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-600 transition-all" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700"><Filter className="w-3 h-3" /> Filter</button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /><span className="ml-3 text-slate-400">Loading employees...</span></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <UserPlus className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 font-semibold">{search ? "No employees match your search" : "No employees yet"}</p>
            {!search && <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all">Add First Employee</button>}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Employee</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Pickup Location</th><th className="px-6 py-4">Shift</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center font-bold text-blue-400 text-xs">{emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                      <div><p className="text-sm font-bold text-white">{emp.name}</p><div className="flex items-center gap-1 text-slate-500"><Mail className="w-3 h-3" /><span className="text-xs">{emp.email}</span></div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[11px] font-bold">{emp.department || "—"}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-slate-300"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span className="text-xs font-medium">{emp.pickupLocation || "—"}</span></div></td>
                  <td className="px-6 py-4"><span className="text-xs font-bold text-slate-400">{emp.shift || "—"}</span></td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${emp.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"}`}>{emp.status}</span></td>
                  <td className="px-6 py-4 text-right">
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
