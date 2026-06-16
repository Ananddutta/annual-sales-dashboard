import React from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  title,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs";
  
  const variants = {
    primary: "bg-blue-650 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700",
    secondary: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 hover:border-slate-300",
    danger: "bg-rose-600 text-white border-rose-700 hover:bg-rose-700",
    outline: "bg-white text-slate-700 border-slate-250 hover:bg-slate-50 hover:text-slate-900",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wide",
    md: "px-4 py-2 text-sm tracking-tight",
    lg: "px-6 py-3 text-base tracking-normal",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      {...(props as any)}
    >
      {children}
    </button>
  );
}
export default Button;
