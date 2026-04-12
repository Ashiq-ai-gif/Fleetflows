"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, Play, Clock, MapPin, Users, Truck, ChevronRight, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TripPlanningPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripsGenerated, setTripsGenerated] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [shift, setShift] = useState("Morning Shift (06:00 AM)");
  
  // Stats
  const [employeeCount, setEmployeeCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      const data = await res.json();
      if (res.ok && data.length > 0) {
        setTrips(data);
        setTripsGenerated(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats fetch for now, to be replaced by actual aggregations
      setEmployeeCount(150);
      setVehicleCount(12);
      setDriverCount(10);
    } catch (e) {}
  };

  useEffect(() => {
    fetchTrips();
    fetchStats();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shift,
          date: new Date().toISOString().split("T")[0],
          strategy: "Shortest Distance"
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setTrips(data.trips || []);
        setTripsGenerated(true);
      } else {
        alert("Failed to generate: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("System error during mathematical route generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Trip Planning Engine</h2>
          <p className="text-slate-400 text-sm">Automated route optimization and vehicle allocation via Math Engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-2xl font-bold text-sm border border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            + Manual Schedule
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
            {isGenerating ? "Computing Routes..." : "Generate Today's Trips"}
          </button>
        </div>
      </div>

      {/* Manual Schedule Modal placeholder logic */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Config & Filters */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
             <h3 className="font-bold text-white flex items-center gap-2">
               <BrainCircuit className="w-5 h-5 text-blue-500" />
               Generation Constraints
             </h3>
             
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Target Shift</label>
                 <select 
                   value={shift} 
                   onChange={(e) => setShift(e.target.value)} 
                   className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-600"
                 >
                   <option>Morning Shift (06:00 AM)</option>
                   <option>General Shift (09:00 AM)</option>
                   <option>Night Shift (10:00 PM)</option>
                 </select>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Optimization Strategy</label>
                 <div className="grid grid-cols-1 gap-2">
                    {["Shortest Distance", "Least Vehicles", "Balanced Load"].map((s, i) => (
                      <button key={s} className={cn("px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all", i === 1 ? "bg-blue-600/10 border-blue-600/50 text-white" : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700")}>
                        {s}
                      </button>
                    ))}
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
             <h3 className="font-bold text-white mb-4">Live Operational Status</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Users className="w-4 h-4" /></div>
                    <span className="text-sm font-medium text-slate-300">Employees Available</span>
                  </div>
                  <span className="text-sm font-bold text-white">{employeeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Truck className="w-4 h-4" /></div>
                    <span className="text-sm font-medium text-slate-300">Vehicles Ready</span>
                  </div>
                  <span className="text-sm font-bold text-white">{vehicleCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="w-4 h-4" /></div>
                    <span className="text-sm font-medium text-slate-300">Drivers On-call</span>
                  </div>
                  <span className="text-sm font-bold text-white">{driverCount}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Results Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
          {!tripsGenerated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
               <div className="w-24 h-24 bg-blue-600/5 rounded-[40px] flex items-center justify-center border border-blue-600/10">
                 <BrainCircuit className="w-10 h-10 text-blue-500/40" />
               </div>
               <div className="max-w-xs mx-auto">
                 <h4 className="text-lg font-bold text-white mb-2">Mathematical Routing</h4>
                 <p className="text-sm text-slate-500 leading-relaxed">The system will dynamically group your available employees logically into vehicles up to total capacities.</p>
               </div>
               <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all">
                 Initialize Math Engine
               </button>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div>
                  <h3 className="font-bold text-white">Algorithm Output</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{trips.length} active trips dispatched to mobile apps</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">Active Tracking</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                      <th className="px-6 py-4">Trip ID</th>
                      <th className="px-6 py-4">Status & Time</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4">Capacity Load</th>
                      <th className="px-6 py-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {trips.map((trip: any) => (
                      <tr key={trip.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-blue-500">FF-T{trip.id.substring(0,6)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-medium ${trip.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>{trip.status}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{new Date(trip.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </td>
                        <td className="px-6 py-4"><span className="text-xs text-slate-300 font-bold">{trip.vehicle?.plateNumber}</span></td>
                        <td className="px-6 py-4"><span className="text-xs font-bold text-slate-300">{trip.driver?.name}</span></td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black">{trip.passengers?.length || 0} / {trip.vehicle?.capacity} Filled</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-500 hover:text-blue-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
