import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-sans">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2 bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none placeholder-slate-400 font-sans text-sm rounded-lg transition-all ${
            error ? "border-rose-300 focus:border-rose-500" : ""
          } ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs font-sans text-rose-600 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs font-sans text-slate-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
