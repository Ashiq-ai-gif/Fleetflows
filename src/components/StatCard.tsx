"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  icon: any;
  color: string;
}

export function StatCard({ label, value, trend, icon: Icon, color }: StatProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg hover:border-slate-700 transition-colors">
      <div className="space-y-2">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {trend && (
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
              trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-4 rounded-xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
