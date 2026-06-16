import React, { useState, useMemo } from "react";
import { Transaction } from "../../types.ts";
import { Badge } from "../atoms/Badge.tsx";
import { Search, ArrowUpDown, Calendar, ShoppingBag, ShieldAlert } from "lucide-react";

interface SalesTableProps {
  transactions: Transaction[];
  threshold: number;
}

type SortField = "date" | "amount" | "quantity";
type SortOrder = "asc" | "desc";

export function SalesTable({ transactions, threshold }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Handle category Badge matching
  const getBadgeVariant = (cat: string) => {
    switch (cat) {
      case "Electronics":
        return "electronics";
      case "Apparel":
        return "apparel";
      case "Home & Kitchen":
        return "home";
      case "Sports & Outdoors":
        return "sports";
      default:
        return "neutral";
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Full in-memory search and clean filtering for transactions list
  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.productName.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term) ||
          t.region.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = a.date.localeCompare(b.date);
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "quantity") {
        comparison = a.quantity - b.quantity;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, selectedCategory, sortField, sortOrder]);

  const uniqueCategories = ["All", "Electronics", "Apparel", "Home & Kitchen", "Sports & Outdoors"];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs md:shadow-sm flex flex-col gap-4">
      {/* Table Header and Control Panels */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Transactions List
          </h3>
          <p className="text-xs text-slate-450 mt-0.5">
            Detailed list of recent sales transactions. Showing {filteredAndSorted.length} items of {transactions.length} total.
          </p>
        </div>

        {/* Real-time search/filters inside the Ledger */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-full sm:w-60 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-xs font-sans rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-sans focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 rounded-l-lg">Order ID</th>
              <th className="py-3 px-4">
                <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-slate-900 focus:outline-none font-bold">
                  Date
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4">Product Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Region</th>
              <th className="py-3 px-4 text-right">
                <button onClick={() => handleSort("quantity")} className="flex items-center gap-1 ml-auto hover:text-slate-900 focus:outline-none font-bold">
                  Qty
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4 text-right rounded-r-lg">
                <button onClick={() => handleSort("amount")} className="flex items-center gap-1 ml-auto hover:text-slate-900 focus:outline-none font-bold">
                  Total Sold
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-mono">
                  <div className="flex flex-col items-center justify-center p-4">
                    <ShieldAlert className="w-8 h-8 text-slate-350 mb-2" />
                    <span className="font-sans text-xs">No matching records located in this search cluster.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((t, idx) => {
                const isHighValue = t.amount >= 1000;
                return (
                  <tr
                    key={t.id}
                    className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-bold">{t.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-450 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {t.date}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-800 font-semibold">{t.productName}</td>
                    <td className="py-3.5 px-4 animate-fadeIn">
                      <Badge variant={getBadgeVariant(t.category)}>{t.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600 font-medium">{t.region}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 font-semibold">{t.quantity}</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap text-sm ${
                      isHighValue ? "text-blue-600" : "text-slate-900"
                    }`}>
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesTable;
