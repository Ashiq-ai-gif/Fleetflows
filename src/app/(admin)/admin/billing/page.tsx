"use client";

import React from "react";
import { CreditCard, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, FileText, ChevronDown } from "lucide-react";

const plans = [
  { name: "Free", price: "₹0", color: "from-slate-500/10 to-slate-600/5", border: "border-slate-500/20", badge: "text-slate-400", companies: 25, features: ["Up to 50 employees", "10 vehicles", "Basic reporting", "Email support"] },
  { name: "Basic", price: "₹8,000/mo", color: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20", badge: "text-emerald-400", companies: 84, features: ["Up to 500 employees", "50 vehicles", "Advanced analytics", "Priority support"] },
  { name: "Premium", price: "₹24,000/mo", color: "from-blue-500/10 to-blue-600/5", border: "border-blue-500/20", badge: "text-blue-400", companies: 112, features: ["Up to 2000 employees", "200 vehicles", "Live tracking", "Dedicated manager"] },
  { name: "Enterprise", price: "Custom", color: "from-violet-500/10 to-violet-600/5", border: "border-violet-500/20", badge: "text-violet-400", companies: 63, features: ["Unlimited employees", "Unlimited vehicles", "Custom API", "SLA guarantee"] },
];

const invoices = [
  { company: "TCS", amount: "₹4,12,000", status: "Paid", date: "Mar 31, 2026", plan: "Enterprise" },
  { company: "Infosys Ltd", amount: "₹2,40,000", status: "Paid", date: "Mar 31, 2026", plan: "Enterprise" },
  { company: "HCL Technologies", amount: "₹72,000", status: "Paid", date: "Mar 30, 2026", plan: "Premium" },
  { company: "Wipro Technologies", amount: "₹84,000", status: "Failed", date: "Mar 28, 2026", plan: "Premium" },
  { company: "Tech Mahindra", amount: "₹18,000", status: "Paid", date: "Mar 25, 2026", plan: "Basic" },
  { company: "Nexus Corp", amount: "₹48,000", status: "Pending", date: "Apr 01, 2026", plan: "Premium" },
  { company: "SmartMove Logistics", amount: "₹8,000", status: "Failed", date: "Mar 15, 2026", plan: "Basic" },
];

const statusIcon: Record<string, React.ReactNode> = {
  Paid: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  Failed: <XCircle className="w-4 h-4 text-rose-400" />,
  Pending: <Clock className="w-4 h-4 text-amber-400" />,
};
const statusText: Record<string, string> = {
  Paid: "text-emerald-400",
  Failed: "text-rose-400",
  Pending: "text-amber-400",
};

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      <header className="px-8 py-5 border-b border-white/5 sticky top-0 z-10 bg-[#080810]/95 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-white tracking-tight">Subscriptions & Billing</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage plans, invoices, and revenue across all tenants.</p>
      </header>

      <div className="p-8 space-y-8">
        {/* Revenue Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Monthly Revenue", value: "₹48.2L", sub: "▲ 18.4% vs last month", color: "text-emerald-400" },
            { label: "Paid Invoices", value: "238", sub: "This month", color: "text-blue-400" },
            { label: "Failed Payments", value: "12", sub: "₹2.1L outstanding", color: "text-rose-400" },
            { label: "Pending Renewals", value: "8", sub: "Due this week", color: "text-amber-400" },
          ].map(c => (
            <div key={c.label} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{c.label}</p>
              <p className="text-3xl font-black text-white mt-2 tracking-tight">{c.value}</p>
              <p className={`text-xs font-semibold mt-1 ${c.color}`}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div>
          <h2 className="text-base font-bold text-white mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-4 gap-4">
            {plans.map(p => (
              <div key={p.name} className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-2xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-black uppercase tracking-widest ${p.badge}`}>{p.name}</span>
                  <span className="text-xs text-slate-500 font-semibold">{p.companies} companies</span>
                </div>
                <p className="text-xl font-black text-white mb-4">{p.price}</p>
                <ul className="space-y-2 mb-4">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors border border-white/10">
                  Configure Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Recent Invoices</h2>
            <button className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Export All
            </button>
          </div>
          <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Company", "Plan", "Amount", "Status", "Date", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white text-sm">{inv.company}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{inv.plan}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {statusIcon[inv.status]}
                        <span className={`text-xs font-bold ${statusText[inv.status]}`}>{inv.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors">Download</button>
                    </td>
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
