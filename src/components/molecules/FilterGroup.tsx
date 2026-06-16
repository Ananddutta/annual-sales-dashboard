import React, { useState } from "react";
import { Input } from "../atoms/Input.tsx";
import { Button } from "../atoms/Button.tsx";
import { SlidersHorizontal, ArrowRight, RefreshCcw } from "lucide-react";

interface FilterGroupProps {
  currentThreshold: number;
  onApplyThreshold: (value: number) => void;
  isLoading?: boolean;
}

export function FilterGroup({
  currentThreshold,
  onApplyThreshold,
  isLoading = false,
}: FilterGroupProps) {
  const [inputValue, setInputValue] = useState(currentThreshold.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onApplyThreshold(parsed);
    } else {
      onApplyThreshold(0);
    }
  };

  const handleQuickSelect = (value: number) => {
    setInputValue(value.toString());
    onApplyThreshold(value);
  };

  const handleReset = () => {
    setInputValue("0");
    onApplyThreshold(0);
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs md:shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-slate-800" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Global Sales Filters
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <Input
            label="Transaction Sales Threshold ($)"
            type="number"
            min="0"
            max="15000"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 500"
            helperText="Include only order values greater than or equal to this threshold."
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-grow md:flex-none py-2.5 px-5 bg-slate-900 border-slate-900 text-white rounded-lg hover:bg-slate-800"
            variant="primary"
          >
            {isLoading ? "Fetching..." : "Apply Filter"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {currentThreshold > 0 && (
            <Button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              variant="outline"
              title="Reset Filters"
              className="py-2.5 px-3 rounded-lg"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Quick Threshold Presets with Rounded Pills */}
      <div className="mt-4 pt-3.5 border-t border-dashed border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">
          Quick Presets:
        </span>
        {[0, 100, 300, 500, 1000].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleQuickSelect(preset)}
            className={`px-3 py-1 text-xs font-medium border rounded-full transition-all duration-150 ${
              currentThreshold === preset
                ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {preset === 0 ? "Show All Sales" : `≥ $${preset}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterGroup;
