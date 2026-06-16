import React, { useState, useEffect } from "react";
import { SalesAPIResponse } from "../../types.ts";
import { DashboardLayout } from "../templates/DashboardLayout.tsx";
import { FilterGroup } from "../molecules/FilterGroup.tsx";
import { StatsCard } from "../molecules/StatsCard.tsx";
import { SalesChart } from "../organisms/SalesChart.tsx";
import { SalesTable } from "../organisms/SalesTable.tsx";
import { ChartType } from "../molecules/ChartToggle.tsx";
import { DollarSign, Percent, TrendingUp, ShoppingCart, Sliders, Calendar, ChevronDown, Sparkles } from "lucide-react";

export function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [threshold, setThreshold] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [salesResponse, setSalesResponse] = useState<SalesAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time metrics from the server-side Express API
  const fetchSalesData = async (year: number, currentThreshold: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sales?year=${year}&threshold=${currentThreshold}`);
      if (!response.ok) {
        throw new Error(`Failed to contact sales repository API (HTTP ${response.status})`);
      }
      const text = await response.text();
      const parsed: SalesAPIResponse = JSON.parse(text);
      setSalesResponse(parsed);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(err.message || "An unexpected error occurred while processing sales data streams.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData(selectedYear, threshold);
  }, [selectedYear, threshold]);

  // High-precision currency display formatters
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApplyThreshold = (value: number) => {
    setThreshold(value);
  };

  return (
    <DashboardLayout>
      {/* Top Welcome Title & Segment Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Sales Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse active metrics and transactions instantly.
          </p>
        </div>

        {/* Calendar Year Tabs Selector - Styled with rounded elements */}
        <div className="flex bg-slate-100 border border-slate-200/60 p-1 rounded-xl select-none self-start md:self-center shadow-xs">
          {[2024, 2023, 2022].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-4 py-2 font-sans text-xs font-bold transition-all duration-150 rounded-lg ${
                selectedYear === yr
                  ? "bg-white text-blue-600 border border-slate-250/30 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Fiscal {yr}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl font-sans text-sm">
          <h4 className="font-bold uppercase tracking-wider mb-2">Network Connection Fault</h4>
          <p>{error}</p>
          <button
            onClick={() => fetchSalesData(selectedYear, threshold)}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
          >
            Retry Connection Protocol
          </button>
        </div>
      ) : (
        <>
          {/* Filtering Group Molecules */}
          <FilterGroup
            currentThreshold={threshold}
            onApplyThreshold={handleApplyThreshold}
            isLoading={isLoading}
          />

          {/* Quick Metrics KPI Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard
              title={`Total Sales ${selectedYear}`}
              value={salesResponse ? formatUSD(salesResponse.summary.totalSales) : "$0"}
              subtitle={
                threshold > 0
                  ? `Filtered from ${formatUSD(salesResponse?.summary.unfilteredTotalSales || 0)}`
                  : `Gross revenue volume`
              }
              change={salesResponse?.summary.yearOverYearGrowth}
              icon={<DollarSign className="w-5 h-5 text-blue-500" />}
              loading={isLoading}
            />

            <StatsCard
              title="Retained Margin"
              value={salesResponse ? formatUSD(salesResponse.summary.totalProfit) : "$0"}
              subtitle="Estimated 28% profit index"
              change={salesResponse?.summary.yearOverYearGrowth}
              icon={<Percent className="w-5 h-5 text-purple-500" />}
              loading={isLoading}
            />

            <StatsCard
              title="Checkout Counts"
              value={salesResponse ? salesResponse.summary.totalOrders : "0"}
              subtitle={
                threshold > 0
                  ? `With amounts ≥ $${threshold}`
                  : "Gross checkout count"
              }
              icon={<ShoppingCart className="w-5 h-5 text-emerald-500" />}
              loading={isLoading}
            />

            <StatsCard
              title="Average Basket Size"
              value={salesResponse ? formatUSD(salesResponse.summary.averageOrderValue) : "$0"}
              subtitle="Orders value/frequency ratio"
              icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
              loading={isLoading}
            />
          </div>

          {/* Analytics Visualisers Organisms */}
          <div className="grid grid-cols-1 gap-6">
            <SalesChart
              data={salesResponse?.monthly || []}
              categoryData={salesResponse?.categoryBreakdown || []}
              chartType={chartType}
              onChartTypeChange={(t) => setChartType(t)}
              year={selectedYear}
            />

            <SalesTable
              transactions={salesResponse?.transactions || []}
              threshold={threshold}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
