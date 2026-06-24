import type { MonthlyTrendItem } from "@/features/dashboard/types";

const chartWidth = 560;
const chartHeight = 220;
const padding = 36;
const minScore = 50;
const maxScore = 100;
const scoreTicks = [50, 60, 70, 80, 90, 100];

type MonthlyTrendChartProps = {
  trends: MonthlyTrendItem[];
};

function getQuarterLabel(item: MonthlyTrendItem) {
  const quarterMatch = item.month.match(/Q([1-4])$/i);

  if (quarterMatch?.[1]) {
    return `Kuartal ${quarterMatch[1]}`;
  }

  const monthNumber = Number(item.month.split("-")[1]);

  if (Number.isFinite(monthNumber) && monthNumber >= 1) {
    return `Kuartal ${Math.ceil(monthNumber / 3)}`;
  }

  return item.label;
}

function getQuarterlyTrends(trends: MonthlyTrendItem[]) {
  const groupedTrends = trends.reduce<
    Record<string, { count: number; month: string; total: number }>
  >((result, item) => {
    const label = getQuarterLabel(item);
    const current = result[label] ?? {
      count: 0,
      month: item.month,
      total: 0,
    };

    return {
      ...result,
      [label]: {
        count: current.count + 1,
        month: current.month,
        total: current.total + item.value,
      },
    };
  }, {});

  return [1, 2, 3, 4].map((quarter) => {
    const label = `Kuartal ${quarter}`;
    const item = groupedTrends[label];

    return {
      label,
      month: item?.month ?? `${trends[0]?.month.split("-")[0] ?? "2026"}-Q${quarter}`,
      value: item ? Math.round(item.total / Math.max(1, item.count)) : null,
    };
  });
}

export default function MonthlyTrendChart({ trends }: MonthlyTrendChartProps) {
  const selectedYear = trends[0]?.month.split("-")[0] ?? "2026";
  const quarterlyTrends = getQuarterlyTrends(trends);
  const points = quarterlyTrends.map((item, index) => {
    const x =
      padding +
      (index * (chartWidth - padding * 2)) /
        Math.max(1, quarterlyTrends.length - 1);
    const y =
      item.value === null
        ? null
        : chartHeight -
          padding -
          ((Math.min(maxScore, Math.max(minScore, item.value)) - minScore) /
            (maxScore - minScore)) *
            (chartHeight - padding * 2);

    return { ...item, x, y };
  });
  const visiblePoints = points.filter(
    (point): point is typeof point & { y: number; value: number } =>
      point.y !== null && point.value !== null,
  );

  const path = visiblePoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Trend Sakinah Score Per Kuartal
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Pergerakan rata-rata score
          </h2>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
          {selectedYear}
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Grafik trend score kuartalan"
          className="h-64 min-w-[520px] rounded-lg bg-slate-50"
        >
          {scoreTicks.map((tick) => {
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

          {path ? (
            <path d={path} fill="none" stroke="#1B5E20" strokeWidth="3" />
          ) : null}

          {visiblePoints.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5" fill="#2E7D32" />
            </g>
          ))}

          {points.map((point) => (
            <g key={point.label}>
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
