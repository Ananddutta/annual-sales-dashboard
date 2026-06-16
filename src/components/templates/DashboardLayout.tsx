import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Direct beginner-friendly minimal header bar */}
      <header className="border-b border-slate-205 py-4 px-6 md:px-8 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white">
            AS
          </div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">
            Annual Sales
          </span>
        </div>
        <div className="text-slate-500 text-xs">
          Interactive Report
        </div>
      </header>

      {/* Simplified, elegant viewport container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
