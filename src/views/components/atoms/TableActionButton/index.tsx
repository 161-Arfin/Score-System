import type { ButtonHTMLAttributes, ReactNode } from "react";

type TableActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "default" | "danger";
};

export default function TableActionButton({
  children,
  className = "",
  tone = "default",
  type = "button",
  ...props
}: TableActionButtonProps) {
  const toneClassName =
    tone === "danger"
      ? "text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:ring-red-500/15"
      : "text-slate-600 hover:border-cyan-800/30 hover:bg-cyan-50 hover:text-cyan-800 focus:ring-cyan-800/15";

  return (
    <button
      type={type}
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition focus:outline-none focus:ring-2",
        toneClassName,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
