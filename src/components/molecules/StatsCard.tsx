import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // percentage change value
  icon: React.ReactNode;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  icon,
  loading = false,
}: StatsCardProps) {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <div
      className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs md:shadow-sm hover:shadow-md transition-all duration-250 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {title}
        </span>
        <div className="p-2 border border-slate-100 bg-slate-50 text-slate-600 rounded-lg">
          {icon}
        </div>
      </div>

      {loading ? (
        <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse my-1"></div>
      ) : (
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400 font-sans truncate">
          {subtitle}
        </span>
        
        {change !== undefined && !loading && (
          <div className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            isPositive ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-amber-700 bg-amber-50 border-amber-100"
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 text-emerald-600" /> : <ArrowDownRight className="w-3 h-3 text-amber-600" />}
            <span>{isPositive ? "+" : ""}{change}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
