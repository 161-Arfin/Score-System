import type { FocusDimensionItem } from "@/features/dashboard/types";
import ChartBar from "@/views/components/atoms/ChartBar";

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
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Dimensi Prioritas
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">
          Area yang perlu pendampingan
        </h2>

        <div className="mt-6 space-y-4">
          {focusDimensions.map((item) => (
            <ChartBar
              key={item.label}
              label={item.label}
              max={20}
              tone="warning"
              value={item.value}
            />
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
