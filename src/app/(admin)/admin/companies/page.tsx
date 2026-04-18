"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Building2, Edit, Trash2, LogIn, Ban,
  X, Eye, EyeOff, CheckCircle, Loader2, ShieldCheck
} from "lucide-react";

type Company = {
  id: string;
  name: string;
  domain: string | null;
  plan: string;
  status: string;
  createdAt: string;
  _count: { users: number; employees: number; vehicles: number };
};

const planBadge: Record<string, string> = {
  ENTERPRISE: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  PREMIUM: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  BASIC: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  FREE: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const planLabel: Record<string, string> = {
  ENTERPRISE: "Enterprise", PREMIUM: "Premium", BASIC: "Basic", FREE: "Free"
};

function AddCompanyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    companyName: "", domain: "", plan: "BASIC",
    adminName: "", adminEmail: "", adminPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create company");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0d0d18] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-violet-500/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="font-bold text-white">Add New Company</h2>
              <p className="text-xs text-slate-500">Create a new tenant organization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Details */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Company Details</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Company Name *</label>
                <input
                  required
                  value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                  placeholder="e.g. Acme Technologies Pvt Ltd"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Domain</label>
                  <input
                    value={form.domain}
                    onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                    placeholder="acme.com"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Subscription Plan *</label>
                  <select
                    value={form.plan}
                    onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/60 transition-all"
                  >
                    <option value="FREE" className="bg-[#0d0d18]">Free</option>
                    <option value="BASIC" className="bg-[#0d0d18]">Basic – ₹8,000/mo</option>
                    <option value="PREMIUM" className="bg-[#0d0d18]">Premium – ₹24,000/mo</option>
                    <option value="ENTERPRISE" className="bg-[#0d0d18]">Enterprise – Custom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Account */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Admin Account</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Admin Full Name *</label>
                <input
                  required
                  value={form.adminName}
                  onChange={e => setForm(f => ({ ...f, adminName: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Admin Email *</label>
                <input
                  required
                  type="email"
                  value={form.adminEmail}
                  onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                  placeholder="admin@acme.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Temporary Password *</label>
                <div className="relative">
                  <input
                    required
                    type={showPw ? "text" : "password"}
                    value={form.adminPassword}
                    onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))}
                    placeholder="Min. 8 characters"
                    minLength={8}
                    className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 rounded-xl shadow-lg shadow-violet-900/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Company</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default function CompaniesPage() {
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [impersonating, setImpersonating] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/companies");
      const data = await res.json();
      setCompanies(data.tenants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSuccess = () => {
    setSuccessMsg("Company created successfully!");
    fetchCompanies();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedPlan === "All" || c.plan === selectedPlan)
  );

  const totals = {
    all: companies.length,
    active: companies.filter(c => c.status === "active").length,
    suspended: companies.filter(c => c.status === "suspended").length,
  };

  const handleImpersonate = async (companyId: string, companyName: string) => {
    setImpersonating(companyId);
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to impersonate");

      // 🔑 This is the key fix: update the JWT session cookie in-place
      await updateSession(data.sessionUpdate);

      setSuccessMsg(`✅ Switched to ${companyName} — redirecting to their dashboard...`);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to switch companies");
    } finally {
      setImpersonating(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      {showModal && <AddCompanyModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}

      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Companies</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage all tenant organizations on the platform.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-900/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </header>

      <div className="p-8 space-y-6">
        {/* Success Toast */}
        {successMsg && (
          <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-300">{successMsg}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total", value: totals.all, color: "text-white" },
            { label: "Active", value: totals.active, color: "text-emerald-400" },
            { label: "Suspended", value: totals.suspended, color: "text-rose-400" },
            { label: "Trial", value: totals.all - totals.active - totals.suspended, color: "text-amber-400" },
          ].map(c => (
            <div key={c.label} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-5 text-center">
              <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            {[["All", "All"], ["ENTERPRISE", "Enterprise"], ["PREMIUM", "Premium"], ["BASIC", "Basic"], ["FREE", "Free"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSelectedPlan(val)}
                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                  selectedPlan === val
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              <span className="ml-3 text-slate-400 font-medium">Loading companies...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Building2 className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-slate-400 font-semibold">No companies found</p>
              <p className="text-slate-600 text-sm mt-1">Add your first company to get started</p>
              <button onClick={() => setShowModal(true)} className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-all">
                <Plus className="w-4 h-4" /> Add Company
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Company", "Plan", "Employees", "Vehicles", "Users", "Status", "Created", "Actions"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center border border-white/10 font-bold text-violet-300 text-sm">
                          {c.name[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-white text-sm block">{c.name}</span>
                          {c.domain && <span className="text-xs text-slate-500">{c.domain}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${planBadge[c.plan] || planBadge.BASIC}`}>
                        {planLabel[c.plan] || c.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">{c._count.employees}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">{c._count.vehicles}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">{c._count.users}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                        <span className={`text-xs font-bold capitalize ${c.status === "active" ? "text-emerald-400" : "text-rose-400"}`}>{c.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          title="Login as Company" 
                          onClick={() => handleImpersonate(c.id, c.name)}
                          disabled={impersonating === c.id}
                          className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {impersonating === c.id 
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <LogIn className="w-4 h-4" />}
                        </button>
                        <button title="Edit" className="p-1.5 text-slate-400 hover:bg-white/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button title="Suspend" className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"><Ban className="w-4 h-4" /></button>
                        <button title="Delete" className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
