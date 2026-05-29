import type { DimensionScoreItem } from "@/features/dashboard/types";
import ChartBar from "@/views/components/atoms/ChartBar";

type DimensionScoreChartProps = {
  scores: DimensionScoreItem[];
};

export default function DimensionScoreChart({
  scores,
}: DimensionScoreChartProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">
          Avg Score Per Dimensi
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">
          Kekuatan penilaian utama
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {scores.map((dimension) => (
          <ChartBar key={dimension.label} {...dimension} />
        ))}
      </div>
    </section>
  );
}
