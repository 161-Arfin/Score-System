import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
};

export default function StatCard({
  caption,
  icon: Icon,
  label,
  value,
}: StatCardProps) {
  return (
    <article className="flex min-h-[150px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-800/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="min-h-[40px] text-xs font-semibold uppercase leading-5 text-slate-500">
            {label}
          </p>
          <p className="text-3xl font-bold text-cyan-800">{value}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{caption}</p>
    </article>
  );
}
