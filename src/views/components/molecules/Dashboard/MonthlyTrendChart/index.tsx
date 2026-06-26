import type { MonthlyTrendItem } from "@/features/dashboard/types";

const chartWidth = 720;
const chartHeight = 280;
const chartPadding = {
  top: 38,
  right: 72,
  bottom: 66,
  left: 48,
};
const quarterPeriods: Record<string, string> = {
  "Kuartal 1": "Januari - Maret",
  "Kuartal 2": "April - Juni",
  "Kuartal 3": "Juli - September",
  "Kuartal 4": "Oktober - Desember",
};

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

function getQuarterNumber(item: MonthlyTrendItem) {
  if (item.quarter) {
    return item.quarter;
  }

  const quarterMatch = item.month.match(/Q([1-4])$/i);

  if (quarterMatch?.[1]) {
    return Number(quarterMatch[1]);
  }

  const labelMatch = item.label.match(/([1-4])$/);

  if (labelMatch?.[1]) {
    return Number(labelMatch[1]);
  }

  return 0;
}

function shouldShowQuarter(item: MonthlyTrendItem) {
  const year = Number(item.month.split("-")[0]);
  const quarter = getQuarterNumber(item);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);

  if (!quarter || quarter < 1 || quarter > 4) {
    return false;
  }

  if (!Number.isFinite(year)) {
    return true;
  }

  if (year < currentYear) {
    return true;
  }

  if (year > currentYear) {
    return false;
  }

  return quarter <= currentQuarter;
}

function getQuarterPeriod(item: Pick<MonthlyTrendItem, "label" | "period">) {
  return item.period ?? quarterPeriods[item.label] ?? "";
}

function getQuarterlyTrends(trends: MonthlyTrendItem[]) {
  const visibleTrends = trends.filter(shouldShowQuarter);
  const groupedTrends = visibleTrends.reduce<
    Record<
      string,
      {
        count: number;
        month: string;
        period?: string;
        quarter: number;
        total: number;
      }
    >
  >((result, item) => {
    const label = getQuarterLabel(item);
    const current = result[label] ?? {
      count: 0,
      month: item.month,
      period: item.period,
      quarter: getQuarterNumber(item),
      total: 0,
    };

    return {
      ...result,
      [label]: {
        count: current.count + 1,
        month: current.month,
        period: current.period ?? item.period,
        quarter: current.quarter,
        total: current.total + item.value,
      },
    };
  }, {});

  return Object.entries(groupedTrends)
    .map(([label, item]) => ({
      label,
      month: item.month,
      period: item.period ?? quarterPeriods[label],
      quarter: item.quarter,
      value: Number((item.total / Math.max(1, item.count)).toFixed(1)),
    }))
    .sort((first, second) => first.quarter - second.quarter);
}

function getScoreDomain(values: number[]) {
  if (!values.length) {
    return { min: 0, max: 100 };
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const rawSpan = maxValue - minValue;
  const span = Math.max(8, rawSpan);
  const padding = span * 0.35;
  const min = Math.max(0, Math.floor(minValue - padding));
  const max = Math.min(100, Math.ceil(maxValue + padding));

  if (max - min < 8) {
    return {
      min: Math.max(0, min - 4),
      max: Math.min(100, max + 4),
    };
  }

  return { min, max };
}

function getScoreTicks(min: number, max: number) {
  const tickCount = 5;
  const step = (max - min) / (tickCount - 1);

  return Array.from({ length: tickCount }, (_, index) =>
    Number((min + step * index).toFixed(1)),
  );
}

function formatScoreLabel(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function MonthlyTrendChart({ trends }: MonthlyTrendChartProps) {
  const selectedYear = trends[0]?.month.split("-")[0] ?? "2026";
  const quarterlyTrends = getQuarterlyTrends(trends);
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const scoreDomain = getScoreDomain(quarterlyTrends.map((item) => item.value));
  const scoreTicks = getScoreTicks(scoreDomain.min, scoreDomain.max);
  const points = quarterlyTrends.map((item, index) => {
    const x =
      chartPadding.left +
      (index * plotWidth) /
        Math.max(1, quarterlyTrends.length - 1);
    const y =
      item.value === null
        ? null
        : chartPadding.top +
          plotHeight -
          ((Math.min(scoreDomain.max, Math.max(scoreDomain.min, item.value)) -
            scoreDomain.min) /
            (scoreDomain.max - scoreDomain.min)) *
            plotHeight;

    return { ...item, x, y };
  });
  const visiblePoints = points.filter(
    (point): point is typeof point & { y: number; value: number } =>
      point.y !== null && point.value !== null,
  );

  const path = visiblePoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath =
    visiblePoints.length > 1
      ? `${path} L ${visiblePoints[visiblePoints.length - 1].x} ${
          chartPadding.top + plotHeight
        } L ${visiblePoints[0].x} ${chartPadding.top + plotHeight} Z`
      : "";

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
          className="h-80 min-w-[720px] rounded-lg bg-gradient-to-br from-slate-50 to-white"
        >
          <defs>
            <linearGradient id="trendLineGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#006D7C" />
            </linearGradient>
            <linearGradient id="trendAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0" />
            </linearGradient>
          </defs>
          {scoreTicks.map((tick) => {
            const y =
              chartPadding.top +
              plotHeight -
              ((tick - scoreDomain.min) /
                (scoreDomain.max - scoreDomain.min)) *
                plotHeight;

            return (
              <g key={tick}>
                <line
                  x1={chartPadding.left}
                  x2={chartWidth - chartPadding.right}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={tick === scoreTicks[0] ? "0" : "4 5"}
                />
                <text
                  x={chartPadding.left - 12}
                  y={y + 4}
                  fontSize="12"
                  textAnchor="end"
                  fill="#64748b"
                >
                  {formatScoreLabel(tick)}
                </text>
              </g>
            );
          })}

          {visiblePoints.map((point) => (
            <line
              key={`${point.label}-guide`}
              x1={point.x}
              x2={point.x}
              y1={chartPadding.top}
              y2={chartPadding.top + plotHeight}
              stroke="#e2e8f0"
              strokeDasharray="3 7"
            />
          ))}

          {areaPath ? (
            <path d={areaPath} fill="url(#trendAreaGradient)" />
          ) : null}

          {path ? (
            <path
              d={path}
              fill="none"
              stroke="url(#trendLineGradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />
          ) : null}

          {visiblePoints.map((point) => (
            <g key={point.label}>
              <rect
                x={point.x - 18}
                y={point.y - 34}
                width="36"
                height="20"
                rx="10"
                fill="#ffffff"
                stroke="#dbeafe"
              />
              <text
                x={point.x}
                y={point.y - 20}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#0f172a"
              >
                {formatScoreLabel(point.value)}
              </text>
              <circle cx={point.x} cy={point.y} r="9" fill="#ffffff" />
              <circle cx={point.x} cy={point.y} r="6" fill="#2E7D32" />
            </g>
          ))}

          {points.map((point) => (
            <g key={point.label}>
              <text
                x={point.x}
                y={chartHeight - 34}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#334155"
              >
                {point.label}
              </text>
              <text
                x={point.x}
                y={chartHeight - 15}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {getQuarterPeriod(point)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
