"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, FileText, Download, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Shield, Zap, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TenantBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch("/api/billing");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchBilling();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Billing & Expenses</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your subscription and track transport overheads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
            <Zap className="w-4 h-4" /> Upgrade Plan
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Tier Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white w-fit mb-6">Current Plan</div>
                <h2 className="text-4xl font-black text-white mb-2">Premium Tier</h2>
                <p className="text-blue-100 text-sm mb-8 leading-relaxed">Your plan is active and renews on **Apr 28, 2026**.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>Usage: 450/500 Employees</span>
                    <span>90%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>
                <button className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl active:scale-95">Manage Subscription</button>
              </div>
           </div>

           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                 <div>
                   <div className="flex items-center justify-between mb-4">
                     <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500"><DollarSign className="w-6 h-6" /></div>
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Estimated Cost</span>
                   </div>
                   <h3 className="text-3xl font-black text-white leading-tight">₹1,24,500 <span className="text-xs text-slate-500 font-bold tracking-normal uppercase">Current Month</span></h3>
                 </div>
                 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-400 decoration-emerald-500/30 underline-offset-4 decoration-dotted underline">8% higher than last month</span>
                 </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                 <div>
                   <div className="flex items-center justify-between mb-4">
                     <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500"><FileText className="w-6 h-6" /></div>
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Next Invoice</span>
                   </div>
                   <h3 className="text-3xl font-black text-white leading-tight">₹45,000 <span className="text-xs text-slate-500 font-bold tracking-normal uppercase">Due Apr 28</span></h3>
                 </div>
                 <button className="text-xs font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest text-left pt-4 border-t border-slate-800/50 w-full flex items-center justify-between group">
                   Update Payment Method <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden min-h-[300px] flex flex-col">
           <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
             <h3 className="font-bold text-white tracking-tight">Recent Invoices</h3>
             <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Export All History</button>
           </div>
           
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
               <p className="text-sm text-slate-500">Loading billing records...</p>
             </div>
           ) : invoices.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-slate-500" /></div>
               <div>
                  <h4 className="font-bold text-white">No Invoices Yet</h4>
                  <p className="text-sm text-slate-500">You don't have any billing history for this billing cycle.</p>
               </div>
             </div>
           ) : (
             <table className="w-full text-left">
                <thead className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {invoices.map((inv, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4"><span className="text-sm font-bold text-slate-200">INV-{inv.id.substring(0,8)}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><span className="text-sm font-black text-white">₹{inv.amount.toLocaleString()}</span></td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border",
                          inv.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                           <Download className="w-4 h-4" />
                         </button>
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
