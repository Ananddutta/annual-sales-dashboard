import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Transaction, MonthlySalesData, CategoryContribution, RegionContribution, SalesAPIResponse } from "./src/types.js";

// Helper for CJS compilation if needed, or simple absolute paths
const app = express();
const PORT = 3000;

// Deterministic mock database representing full Kaggle superstore data
const PRODUCTS = {
  Electronics: [
    { name: "Quantum UltraBook 15", price: 1200 },
    { name: "VividPro 4K Monitor", price: 450 },
    { name: "SoundSphere ANC Headphones", price: 250 },
    { name: "AeroCharge Wireless Dock", price: 80 },
    { name: "ApexCore Mechanical Keyboard", price: 150 },
  ],
  Apparel: [
    { name: "Vanguard Waterproof Parka", price: 320 },
    { name: "AeroFit Breathable Tracksuit", price: 110 },
    { name: "ThermaStride Premium Boots", price: 190 },
    { name: "ActivePacer Running Shorts", price: 40 },
    { name: "LuxeMerino Wool Sweater", price: 145 },
  ],
  "Home & Kitchen": [
    { name: "BrewMaster Espresso Machine", price: 650 },
    { name: "PureAir H13 Smart Purifier", price: 280 },
    { name: "GourmetPro Damascus Knife Kit", price: 175 },
    { name: "Nordic Ceramic Dinner Set", price: 210 },
    { name: "Econome Thermal Pitcher", price: 55 },
  ],
  "Sports & Outdoors": [
    { name: "Horizon Alpine 2-Person Tent", price: 290 },
    { name: "CarbonTrail Anti-Shock Pole", price: 90 },
    { name: "HydroPeak 40oz Temp Flask", price: 35 },
    { name: "Explorer Pro 35L Daypack", price: 115 },
    { name: "Summit Ridge Snow Goggles", price: 130 },
  ],
};

const REGIONS = ["North America", "Europe", "Asia-Pacific", "Latin America"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Seed transactions deterministically
function generateSeededTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  let orderCounter = 10001;

  // Let's create reproducible data by utilizing a simple custom LCG random generator
  let seed = 42;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const years = [2022, 2023, 2024];

  // Distribution scales per year to simulate realistic annual growth (Kaggle Retail Index)
  const scaleByYear: Record<number, number> = {
    2022: 1.0,  // Recovery Baseline
    2023: 1.25, // Steady Growth
    2024: 1.65, // High Performance Boom
  };

  // Base monthly fluctuations to mimic real seasonal shopping curves (high in Q4, dip in Q1)
  const monthCurves: Record<string, number> = {
    Jan: 0.7, Feb: 0.75, Mar: 0.9, Apr: 0.85, May: 0.95, Jun: 1.1,
    Jul: 1.0, Aug: 1.05, Sep: 1.15, Oct: 1.25, Nov: 1.45, Dec: 1.7
  };

  years.forEach((year) => {
    const yearScale = scaleByYear[year];

    MONTHS.forEach((month, monthIndex) => {
      const monthScale = monthCurves[month];
      
      // Generate multiple realistic sales per month
      const salesCount = Math.floor(10 + random() * 12 * yearScale * monthScale);

      for (let i = 0; i < salesCount; i++) {
        // Pick Category
        const categoryKeys = Object.keys(PRODUCTS) as Array<keyof typeof PRODUCTS>;
        const category = categoryKeys[Math.floor(random() * categoryKeys.length)];

        // Pick Product
        const productsList = PRODUCTS[category];
        const baseProduct = productsList[Math.floor(random() * productsList.length)];

        // Price fluctuation (+/- 15%)
        const priceVariance = 0.85 + random() * 0.3;
        const finalPrice = Math.round(baseProduct.price * priceVariance);

        // Quantity (1 to 5)
        const quantity = Math.floor(1 + random() * 5);
        const amount = finalPrice * quantity;

        // Region selection
        const region = REGIONS[Math.floor(random() * REGIONS.length)];

        // Day of month selection
        const day = Math.floor(1 + random() * 28);
        const formattedDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        transactions.push({
          id: `TX-${orderCounter++}`,
          date: formattedDate,
          productName: baseProduct.name,
          category: category as any,
          region: region as any,
          amount,
          quantity,
          year,
        });
      }
    });
  });

  return transactions;
}

const DATABASE_TRANSACTIONS = generateSeededTransactions();

// API endpoint to serve dynamic aggregated sales statistics
app.get("/api/sales", (req, res) => {
  try {
    const requestedYear = parseInt(req.query.year as string) || 2024;
    const threshold = parseFloat(req.query.threshold as string) || 0;

    // Filter database by selected year
    const yearTransactions = DATABASE_TRANSACTIONS.filter((t) => t.year === requestedYear);
    const unfilteredTotalSales = yearTransactions.reduce((acc, curr) => acc + curr.amount, 0);

    // Apply the "user specified custom sales threshold filter" (on transaction item level)
    const filteredTransactions = yearTransactions.filter((t) => t.amount >= threshold);

    // Summary calculation
    const totalSales = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalOrders = filteredTransactions.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const totalProfit = Math.round(totalSales * 0.28); // Standard retail profit margins (28%)

    // Analyze YoY Growth rates of unfiltered sales
    const prevYearTransactions = DATABASE_TRANSACTIONS.filter((t) => t.year === requestedYear - 1);
    const prevYearSales = prevYearTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const yearOverYearGrowth = prevYearSales > 0 ? Math.round(((unfilteredTotalSales - prevYearSales) / prevYearSales) * 100) : 0;

    // Monthly Aggregation
    const monthlyDataMap: Record<string, { sales: number; orders: number; expenses: number; categories: Record<string, number> }> = {};

    MONTHS.forEach((m) => {
      monthlyDataMap[m] = {
        sales: 0,
        orders: 0,
        expenses: 0,
        categories: {
          Electronics: 0,
          Apparel: 0,
          "Home & Kitchen": 0,
          "Sports & Outdoors": 0,
        },
      };
    });

    filteredTransactions.forEach((t) => {
      // Find month from parsed date
      const monthIndex = parseInt(t.date.split("-")[1]) - 1;
      const m = MONTHS[monthIndex];
      if (monthlyDataMap[m]) {
        monthlyDataMap[m].sales += t.amount;
        monthlyDataMap[m].orders += 1;
        monthlyDataMap[m].expenses += Math.round(t.amount * 0.72); // cost of goods sold = 72%
        if (monthlyDataMap[m].categories[t.category] !== undefined) {
          monthlyDataMap[m].categories[t.category] += t.amount;
        }
      }
    });

    const monthly: MonthlySalesData[] = MONTHS.map((m) => {
      const entry = monthlyDataMap[m];
      return {
        month: m,
        sales: entry.sales,
        orders: entry.orders,
        expenses: entry.expenses,
        categoryBreakdown: {
          Electronics: entry.categories["Electronics"] || 0,
          Apparel: entry.categories["Apparel"] || 0,
          HomeKitchen: entry.categories["Home & Kitchen"] || 0,
          SportsOutdoors: entry.categories["Sports & Outdoors"] || 0,
        },
      };
    });

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    Object.keys(PRODUCTS).forEach((cat) => {
      categoryTotals[cat] = 0;
    });

    filteredTransactions.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const categoryBreakdown: CategoryContribution[] = Object.entries(categoryTotals).map(([name, sales]) => ({
      name,
      sales,
      value: totalSales > 0 ? parseFloat(((sales / totalSales) * 100).toFixed(1)) : 0,
    }));

    // Region breakdown
    const regionTotals: Record<string, number> = {};
    REGIONS.forEach((r) => {
      regionTotals[r] = 0;
    });

    filteredTransactions.forEach((t) => {
      regionTotals[t.region] = (regionTotals[t.region] || 0) + t.amount;
    });

    const regionBreakdown: RegionContribution[] = Object.entries(regionTotals).map(([name, sales]) => ({
      name,
      sales,
      value: totalSales > 0 ? parseFloat(((sales / totalSales) * 100).toFixed(1)) : 0,
    }));

    // Return newest top 35 filtered transactions to display beautifully in UI
    const sortedTransactions = [...filteredTransactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 35);

    const apiResponse: SalesAPIResponse = {
      year: requestedYear,
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue,
        totalProfit,
        yearOverYearGrowth,
        unfilteredTotalSales,
      },
      monthly,
      categoryBreakdown,
      regionBreakdown,
      transactions: sortedTransactions,
      threshold,
    };

    res.json(apiResponse);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to compile sales intelligence", message: err.message });
  }
});

// Configure Vite or Static Directory serving
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with dist/ assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dynamic Atomic Dashboard Server launched on http://0.0.0.0:${PORT}`);
  });
}

configureServer().catch((err) => {
  console.error("Critical error starting Express configuration layer:", err);
});
