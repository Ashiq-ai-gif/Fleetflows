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
import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

export default function Home() {
  const { data: session } = useSession();
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch('/api/drivers');
        const data = await res.json();
        setDrivers(data.drivers || []);
      } catch (e) {}
    };
    if (session?.user) {
      fetchDrivers();
      const int = setInterval(fetchDrivers, 15000);
      return () => clearInterval(int);
    }
  }, [session]);

  const activeDrivers = drivers.filter((d: any) => d.latitude && d.longitude);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

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
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                zoom={activeDrivers.length > 0 ? 12 : 9}
                center={activeDrivers.length > 0 ? { lat: activeDrivers[0].latitude, lng: activeDrivers[0].longitude } : { lat: 37.7749, lng: -122.4194 }}
                options={{
                  disableDefaultUI: true,
                  styles: [
                    { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
                    { "elementType": "labels.text.fill", "stylers": [{ "color": "#8b9cb5" }] },
                    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f8fafc" }] },
                    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
                    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
                    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
                    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
                    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
                    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
                    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
                    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#475569" }] },
                    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
                    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
                    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
                    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
                    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
                  ]
                }}
              >
                 {activeDrivers.map((d: any) => (
                   <Marker 
                     key={d.id} 
                     position={{ lat: d.latitude, lng: d.longitude }} 
                     title={`${d.name} (${d.status})`} 
                     icon={{
                       url: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%233b82f6' viewBox='0 0 24 24' stroke-width='1.5' stroke='white' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' /%3E%3C/svg%3E",
                       scaledSize: new window.google.maps.Size(40, 40)
                     }}
                   />
                 ))}
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="animate-pulse flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Initializing Telemetry Engine...</p>
                 </div>
              </div>
            )}
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
