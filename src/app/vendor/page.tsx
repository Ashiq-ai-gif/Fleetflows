import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Truck, Users, DollarSign } from "lucide-react";

export default async function VendorDashboardPage() {
  const session = await auth();
  
  // Right now, this simulates the dashboard for the first available vendor 
  const firstVendor = await db.vendor.findFirst();
  const vendorId = firstVendor?.id;

  const vehicleCount = await db.vehicle.count({ where: { vendorId } });
  const driverCount = await db.driver.count({ where: { vendorId } });
  
  const earnings = await db.trip.aggregate({
    where: { vendorId, status: "COMPLETED" },
    _sum: { vendorCost: true }
  });
  
  const totalEarnings = earnings._sum.vendorCost || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Vendor Overview</h1>
          <p className="text-slate-400 mt-1">Manage your Fleet Partner operations securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">My Vehicles</h3>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{vehicleCount}</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">My Drivers</h3>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{driverCount}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">Pending Earnings</h3>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">${totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
      </div>
    </div>
  );
}
