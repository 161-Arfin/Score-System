import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function EmptyState({
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <h2 className="mt-4 text-base font-bold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
