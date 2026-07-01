import type { DimensionScoreItem } from "@/features/dashboard/types";
import ChartBar from "@/views/components/atoms/ChartBar";

type DimensionScoreChartProps = {
  scores: DimensionScoreItem[];
};

const dimensionLabelMap: Record<string, string> = {
  "Ad-Din": "Spiritual (Keagamaan)",
  "An-Nasl": "Kesehatan Lingkungan",
  "Al-Mal": "Ekonomi (Kemandirian)",
  "An-Nafs": "Kesehatan Mental",
  "Al-Aql": "Pendidikan & Sosial",
};

export default function DimensionScoreChart({
  scores,
}: DimensionScoreChartProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-800">
          Skor Rata-rata per 5 Dimensi
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {scores.map((dimension) => {
          const value = Number(dimension.value.toFixed(1));

          return (
            <ChartBar
              key={dimension.label}
              label={dimensionLabelMap[dimension.label] ?? dimension.label}
              tone={value < 65 ? "warning" : "primary"}
              value={value}
            />
          );
        })}
      </div>
    </section>
  );
}
