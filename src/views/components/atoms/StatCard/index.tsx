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
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-800/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{caption}</p>
    </article>
  );
}
