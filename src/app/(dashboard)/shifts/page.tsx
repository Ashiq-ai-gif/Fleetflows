"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, Users, Calendar, X, Loader2, CheckCircle, Search, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  employeeCount: number;
};

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([
    { id: "1", name: "Morning Shift", startTime: "06:00 AM", endTime: "02:00 PM", employeeCount: 124 },
    { id: "2", name: "General Shift", startTime: "09:00 AM", endTime: "05:00 PM", employeeCount: 450 },
    { id: "3", name: "Night Shift", startTime: "10:00 PM", endTime: "06:00 AM", employeeCount: 82 },
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Shift Management</h2>
          <p className="text-slate-400 text-sm">Configure timings and assign employees to operational shifts.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <Plus className="w-4 h-4" /> Create Shift
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shifts.map((shift) => (
          <div key={shift.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all group relative">
             <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-600/20 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">{shift.name}</h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <Calendar className="w-4 h-4" />
              <span>{shift.startTime} — {shift.endTime}</span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-300">{shift.employeeCount} Employees</span>
              </div>
              <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Assign</button>
            </div>
          </div>
        ))}
      </div>

      {/* Roster Assignment View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white tracking-tight">Shift Roster</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search roster..." className="bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-600 transition-all" />
            </div>
          </div>
        </div>
        <div className="p-20 text-center space-y-4">
           <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto">
             <Plus className="w-8 h-8 text-slate-600" />
           </div>
           <div>
             <p className="text-slate-400 font-medium">Select a shift above to view and manage assignments.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
