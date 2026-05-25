import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
};

export default function Input({
  className = "",
  endAdornment,
  error,
  id,
  label,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold text-slate-500"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={[
            "h-11 w-full rounded-md border bg-white px-3.5 text-sm text-slate-900 outline-none transition",
            "placeholder:text-slate-400 focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10",
            error ? "border-red-400" : "border-slate-300",
            className,
          ].join(" ")}
          {...props}
        />
        {endAdornment}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
