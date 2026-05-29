import type { MonthlyTrendItem } from "@/features/dashboard/types";

const chartWidth = 560;
const chartHeight = 220;
const padding = 36;
const minScore = 55;
const maxScore = 85;

type MonthlyTrendChartProps = {
  trends: MonthlyTrendItem[];
};

export default function MonthlyTrendChart({ trends }: MonthlyTrendChartProps) {
  const points = trends.map((item, index) => {
    const x =
      padding +
      (index * (chartWidth - padding * 2)) / Math.max(1, trends.length - 1);
    const y =
      chartHeight -
      padding -
      ((item.value - minScore) / (maxScore - minScore)) *
        (chartHeight - padding * 2);

    return { ...item, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Trend Sakinah Score Per Bulan
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Pergerakan rata-rata score
          </h2>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
          {trends[0]?.label ?? "-"} - {trends[trends.length - 1]?.label ?? "-"} 2026
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Grafik trend score bulanan"
          className="h-64 min-w-[520px] rounded-lg bg-slate-50"
        >
          {[60, 65, 70, 75, 80].map((tick) => {
            const y =
              chartHeight -
              padding -
              ((tick - minScore) / (maxScore - minScore)) *
                (chartHeight - padding * 2);

            return (
              <g key={tick}>
                <line
                  x1={padding}
                  x2={chartWidth - padding}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                />
                <text x={10} y={y + 4} fontSize="12" fill="#64748b">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={path} fill="none" stroke="#1B5E20" strokeWidth="3" />

          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5" fill="#2E7D32" />
              <text
                x={point.x}
                y={chartHeight - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#475569"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
