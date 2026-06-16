/**
 * Shared Type Definitions for the Atomic Sales Dashboard
 */

export interface Transaction {
  id: string;
  date: string;
  productName: string;
  category: 'Electronics' | 'Apparel' | 'Home & Kitchen' | 'Sports & Outdoors';
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America';
  amount: number;
  quantity: number;
  year: number;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
  orders: number;
  expenses: number;
  categoryBreakdown: {
    Electronics: number;
    Apparel: number;
    HomeKitchen: number;
    SportsOutdoors: number;
  };
}

export interface RegionContribution {
  name: string;
  value: number;
  sales: number;
}

export interface CategoryContribution {
  name: string;
  value: number;
  sales: number;
}

export interface SalesAPIResponse {
  year: number;
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    totalProfit: number;
    yearOverYearGrowth: number;
    unfilteredTotalSales: number;
  };
  monthly: MonthlySalesData[];
  categoryBreakdown: CategoryContribution[];
  regionBreakdown: RegionContribution[];
  transactions: Transaction[];
  threshold: number;
}
