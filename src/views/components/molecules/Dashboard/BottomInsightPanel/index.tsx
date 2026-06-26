import type { FocusDimensionItem } from "@/features/dashboard/types";

type BottomInsightPanelProps = {
  focusDimensions: FocusDimensionItem[];
  riskTotal: number;
  bronzeTotal: number;
  redTotal: number;
};

export default function BottomInsightPanel({
  bronzeTotal,
  focusDimensions,
  redTotal,
  riskTotal,
}: BottomInsightPanelProps) {
  const sortedDimensions = [...focusDimensions].sort(
    (first, second) => second.value - first.value,
  );

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Dimensi Prioritas
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">
          Area yang perlu pendampingan
        </h2>

        <div className="mt-6 divide-y divide-slate-100">
          {sortedDimensions.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <p className="text-base font-medium text-slate-700">
                {item.label}
              </p>
              <p className="min-w-12 text-right text-lg font-bold text-slate-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Scorecard Risiko
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">
          Keluarga prioritas bulan ini
        </h2>

        <div className="mt-6 rounded-lg bg-slate-50 p-5">
          <p className="text-4xl font-bold text-slate-950">{riskTotal}</p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Keluarga berada di tier Perunggu dan Merah.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-xs font-semibold uppercase text-orange-700">
                Perunggu
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-800">
                {bronzeTotal}
              </p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold uppercase text-red-700">
                Merah
              </p>
              <p className="mt-1 text-2xl font-bold text-red-800">
                {redTotal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
