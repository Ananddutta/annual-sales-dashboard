import React from "react";
import { BarChart, LineChart, AreaChart, PieChart } from "lucide-react";

export type ChartType = "bar" | "line" | "area" | "pie";

interface ChartToggleProps {
  currentType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

export function ChartToggle({ currentType, onTypeChange }: ChartToggleProps) {
  const options = [
    { type: "bar" as const, label: "Bar Chart", icon: BarChart },
    { type: "line" as const, label: "Line Chart", icon: LineChart },
    { type: "area" as const, label: "Area Chart", icon: AreaChart },
    { type: "pie" as const, label: "Pie Chart", icon: PieChart },
  ];

  return (
    <div className="flex border border-slate-200 bg-slate-100 p-1 rounded-lg select-none self-start">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = currentType === opt.type;
        return (
          <button
            key={opt.type}
            onClick={() => onTypeChange(opt.type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-bold transition-all duration-150 rounded-md ${
              isActive
                ? "bg-white text-blue-600 border border-slate-200/60 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ChartToggle;
