import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
};

export default function Button({
  children,
  className = "",
  disabled,
  isLoading = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        "inline-flex h-11 w-full items-center justify-center rounded-md bg-cyan-800 px-4 text-sm font-semibold text-white shadow-sm transition",
        "hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-800 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:bg-cyan-800/45 disabled:shadow-none",
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          Memproses
        </span>
      ) : (
        children
      )}
    </button>
  );
}
