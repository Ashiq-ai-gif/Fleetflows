import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MapPin, CheckCircle2, Navigation, Phone, UserRound } from "lucide-react";

export default async function DriverTrips() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DRIVER") {
    redirect("/driver/login");
  }

  // MVP: Mocking daily trips for UI demonstration
  const trips = [
    {
      id: "1042",
      status: "EN_ROUTE",
      time: "09:00 AM",
      pickup: "Tech Park Sector 4",
      dropoff: "Central Station",
      passengers: 5,
    },
    {
      id: "1043",
      status: "SCHEDULED",
      time: "01:30 PM",
      pickup: "Central Station",
      dropoff: "Office HQ",
      passengers: 3,
    },
    {
      id: "1041",
      status: "COMPLETED",
      time: "06:00 AM",
      pickup: "Office HQ",
      dropoff: "Tech Park Sector 4",
      passengers: 4,
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black tracking-tight mb-2 mt-4">Today's Itinerary</h1>
      <p className="text-slate-400 font-medium mb-8">You have {trips.length} trips assigned for today.</p>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div 
            key={trip.id}
            className={`border rounded-3xl p-5 transition-all ${
              trip.status === "EN_ROUTE" 
                ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-900/20" 
                : trip.status === "COMPLETED"
                ? "bg-white/5 border-white/5 opacity-60"
                : "bg-[#0d0d18] border-white/10"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">{trip.time}</span>
                <span className="text-slate-500 text-xs font-bold tracking-wider uppercase mt-1">Trip #{trip.id}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                trip.status === "EN_ROUTE" ? "bg-emerald-500/20 text-emerald-400" :
                trip.status === "COMPLETED" ? "bg-slate-500/20 text-slate-400" :
                "bg-amber-500/20 text-amber-400"
              }`}>
                {trip.status.replace("_", " ")}
              </div>
            </div>

            {/* Route */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center justify-between py-1.5 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${trip.status === "COMPLETED" ? "bg-slate-500" : "bg-emerald-400"}`} />
                <div className={`w-0.5 h-6 ${trip.status === "COMPLETED" ? "bg-slate-700" : "bg-white/20"}`} />
                <div className={`w-2.5 h-2.5 rounded-full ${trip.status === "COMPLETED" ? "bg-slate-500" : "bg-rose-400"}`} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className={`font-bold ${trip.status === "COMPLETED" ? "text-slate-400" : "text-white"}`}>
                    {trip.pickup}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-semibold">
                    <UserRound className="w-3.5 h-3.5" />
                    <span>{trip.passengers} Pickups</span>
                  </div>
                </div>
                <div>
                  <p className={`font-bold ${trip.status === "COMPLETED" ? "text-slate-400" : "text-white"}`}>
                    {trip.dropoff}
                  </p>
                  <p className="text-slate-500 text-xs font-semibold mt-1">Drop-off Point</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {trip.status === "EN_ROUTE" && (
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/5">
                <button className="h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all">
                  <Phone className="w-4 h-4 text-slate-400" /> Support
                </button>
                <button className="h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-white shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]">
                  <CheckCircle2 className="w-4 h-4" /> End Trip
                </button>
              </div>
            )}
            {trip.status === "SCHEDULED" && (
              <button className="w-full mt-6 h-12 bg-violet-600 hover:opacity-90 rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-white shadow-lg shadow-violet-900/30 transition-all active:scale-[0.98]">
                <Navigation className="w-4 h-4" /> Start Navigating
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
