"use client";
export const dynamic = 'force-dynamic';

import { StatCard } from "@/components/StatCard";
import { 
  Users, 
  Truck, 
  MapPin, 
  AlertCircle,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between font-sans">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Operations Overview</h2>
          <p className="text-slate-400 text-sm">Welcome back, {session?.user?.name || "Ashiq"}. Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search vehicles, routes..." 
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all w-64"
            />
          </div>
          
          <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900 shadow-lg"></span>
          </button>
          
          <div className="flex items-center gap-4 pl-6 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">Ashiq Rahaman</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">AR</div>
            <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Trips" 
          value="124" 
          trend={{ value: "+12%", isUp: true }}
          icon={MapPin}
          color="bg-blue-600"
        />
        <StatCard 
          label="Live Drivers" 
          value="88" 
          trend={{ value: "Online", isUp: true }}
          icon={Truck}
          color="bg-indigo-600"
        />
        <StatCard 
          label="Total Vehicles" 
          value="95" 
          trend={{ value: "Active", isUp: true }}
          icon={Truck}
          color="bg-violet-600"
        />
        <StatCard 
          label="SOS Alerts" 
          value="3" 
          trend={{ value: "Urgent", isUp: false }}
          icon={AlertCircle}
          color="bg-rose-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map Placeholder */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl h-[540px] overflow-hidden flex flex-col shadow-2xl relative group">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider animate-pulse border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Real-time | Connected
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-[11px] text-slate-400 font-bold uppercase tracking-wider hover:bg-slate-700 hover:text-white transition-all">Vehicle List</button>
              <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-[11px] text-white font-bold uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all">View All</button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-950 relative overflow-hidden">
            {/* Artistic Map-like Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grayscale contrast-125">
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-122.4194,37.7749,12/800x600?access_token=pk.placeholder')] bg-cover"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="space-y-6 max-w-sm glassmorphism p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
                <div className="p-5 rounded-3xl bg-blue-600/20 inline-block border border-blue-600/30">
                  <MapPin className="w-12 h-12 text-blue-500 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white tracking-tight">Live Tracking Engine</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">The tracking module is ready. Please provide your **Google Maps API Key** to enable real-time vehicle movement on this map.</p>
                </div>
                <div className="pt-2">
                  <button className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-900/20">
                    Setup Maps API
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white tracking-tight">Upcoming Trips</h4>
              <button className="text-blue-500 text-xs font-bold hover:underline">See all</button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/50 hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black text-[10px] leading-tight border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      09:00<br/>AM
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Trip #FF-10{i}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Pickup: Warehouse A • 12 stops</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-widest hover:border-slate-600 hover:text-slate-300 transition-all">
              Manage Schedule
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 font-sans">
            <h4 className="font-bold text-white tracking-tight">Safety Monitor</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/10 group cursor-pointer hover:bg-rose-500/[0.05] transition-all">
                <div className="flex items-center gap-2 text-rose-500 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Critical SOS</span>
                </div>
                <p className="text-sm text-slate-200 font-bold tracking-tight">Driver John Smith</p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium italic">"Emergency help needed at Route #44"</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">2 mins ago</span>
                  <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline">Resolve Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
