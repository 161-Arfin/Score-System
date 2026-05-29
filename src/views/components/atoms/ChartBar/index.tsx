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
    <div className="grid grid-cols-[72px_1fr_36px] items-center gap-3 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}
