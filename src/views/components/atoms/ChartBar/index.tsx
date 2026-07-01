type ChartBarProps = {
  label: string;
  value: number;
  max?: number;
  tone?: "primary" | "warning";
};

export default function ChartBar({
  label,
  max = 100,
  tone = "primary",
  value,
}: ChartBarProps) {
  const width = Math.min(100, Math.round((value / max) * 100));
  const color = tone === "warning" ? "bg-amber-500" : "bg-cyan-800";

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-slate-800">{label}</span>
        <span className="shrink-0 font-semibold text-slate-950">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
