import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "success" | "warning" | "info" | "electronics" | "apparel" | "home" | "sports";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border tracking-wider uppercase";
  
  const variants = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-250",
    
    // Custom category mappings to look great inside a polished corporate dashboard
    electronics: "bg-indigo-50 text-indigo-700 border-indigo-200",
    apparel: "bg-violet-50 text-violet-700 border-violet-200",
    home: "bg-rose-50 text-rose-700 border-rose-200",
    sports: "bg-emerald-50 text-emerald-705 border-emerald-200",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
