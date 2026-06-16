import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlySalesData, CategoryContribution } from "../../types.ts";
import { ChartToggle, ChartType } from "../molecules/ChartToggle.tsx";
import { TrendingUp, Award, DollarSign } from "lucide-react";

interface SalesChartProps {
  data: MonthlySalesData[];
  categoryData: CategoryContribution[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  year: number;
}

// Professional, vibrant palette matching the theme
const CATEGORY_COLORS: Record<string, string> = {
  "Electronics": "#3b82f6",       // Vibrant Blue
  "Apparel": "#8b5cf6",           // Purple
  "Home & Kitchen": "#f97316",    // Orange
  "Sports & Outdoors": "#10b981", // Emerald
};

const DEFAULT_COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#10b981", "#f59e0b", "#ec4899"];

export function SalesChart({
  data,
  categoryData,
  chartType,
  onChartTypeChange,
  year,
}: SalesChartProps) {
  
  // Format numbers to currencies
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalMonthlySales = data.reduce((acc, curr) => acc + curr.sales, 0);

  // Custom tooltips matching deep obsidian slate design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 border border-slate-800 font-sans text-xs rounded-lg shadow-md">
          <p className="font-bold mb-1.5 border-b border-slate-800 pb-1 uppercase tracking-wider text-slate-300">
            {label} 
          </p>
          {payload.map((item: any, idx: number) => (
            <p key={idx} className="flex justify-between gap-6 py-0.5">
              <span className="text-slate-400">{item.name}:</span>
              <span className="font-semibold text-white">
                {formatCurrency(item.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 border border-slate-800 font-sans text-xs rounded-lg shadow-md">
          <p className="font-semibold border-b border-slate-800 pb-1 mb-1.5 uppercase tracking-wider text-slate-300">
            {payload[0].name}
          </p>
          <p className="flex justify-between gap-6 py-0.5">
            <span className="text-slate-400">Total:</span>
            <span className="font-semibold text-white">{formatCurrency(dataPoint.sales)}</span>
          </p>
          <p className="flex justify-between gap-6 py-0.5">
            <span className="text-slate-400">Share:</span>
            <span className="font-semibold text-white">{dataPoint.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Render proper chart based on selected state
  const renderChart = () => {
    if (totalMonthlySales === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[350px] bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
          <DollarSign className="w-12 h-12 text-slate-300 stroke-1 mb-3 animate-bounce" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            No sales match current threshold
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            Try adjusting your Transaction Sales Threshold filter to a lower value in the presets panel to view analytical monthly patterns.
          </p>
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-sans)" }} />
              <YAxis
                tickFormatter={(val) => `$${val / 1000}k`}
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-sans)" }}
              />
              <Legend wrapperStyle={{ fontFamily: "var(--font-sans)", fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="sales" name="Sales Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Cost of Goods" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 11, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-sans)" }} />
              <YAxis
                tickFormatter={(val) => `$${val / 1000}k`}
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-sans)" }}
              />
              <Legend wrapperStyle={{ fontFamily: "var(--font-sans)", fontSize: 11, paddingTop: 10 }} />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales Volume"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Cost of Goods"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-sans)" }} />
              <YAxis
                tickFormatter={(val) => `$${val / 1000}k`}
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-sans)" }}
              />
              <Legend wrapperStyle={{ fontFamily: "var(--font-sans)", fontSize: 11, paddingTop: 10 }} />
              <Area
                type="monotone"
                dataKey="sales"
                name="Gross Sales"
                stroke="#3b82f6"
                fill="rgba(59, 130, 246, 0.08)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Operating Expenses"
                stroke="#94a3b8"
                fill="rgba(148, 163, 184, 0.06)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        const pieData = categoryData.filter((c) => c.sales > 0);
        if (pieData.length === 0) {
          return (
            <div className="flex items-center justify-center h-[350px] text-slate-400 text-xs">
              No categories match the current sales minimums.
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={true}
                outerRadius={105}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontFamily: "var(--font-sans)", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs md:shadow-sm flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Sales Chart ({year})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly breakdown of sales and operating expenses.
          </p>
        </div>

        <ChartToggle currentType={chartType} onTypeChange={onChartTypeChange} />
      </div>

      <div className="py-4 relative">{renderChart()}</div>
      
      {/* Category color-key summary info when not visualising pie */}
      {chartType !== "pie" && totalMonthlySales > 0 && (
        <div className="flex flex-wrap gap-4 items-center justify-start border-t border-slate-100 pt-3.5 text-xs font-sans">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Category Distribution:</span>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 block rounded-md" style={{ backgroundColor: color }}></span>
              <span className="text-slate-600 font-medium">{cat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SalesChart;
