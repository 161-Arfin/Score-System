import type { UnitPerformanceRow } from "@/features/dashboard/types";

type UnitPerformanceTableProps = {
  rows: UnitPerformanceRow[];
};

export default function UnitPerformanceTable({
  rows,
}: UnitPerformanceTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Performance Per Unit BMT
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Ringkasan performa cabang
          </h2>
        </div>
        <span className="text-sm font-semibold text-cyan-800">Table</span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-3 pr-4 font-semibold">Unit BMT</th>
              <th className="px-4 py-3 font-semibold">Keluarga</th>
              <th className="px-4 py-3 font-semibold">Avg Score</th>
              <th className="px-4 py-3 font-semibold">Agama</th>
              <th className="px-4 py-3 font-semibold">Ekonomi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.unitId} className="text-slate-700">
                <td className="py-3 pr-4 font-semibold text-slate-950">
                  {row.unitName}
                </td>
                <td className="px-4 py-3">{row.families}</td>
                <td className="px-4 py-3 font-semibold text-cyan-800">
                  {row.average}
                </td>
                <td className="px-4 py-3">{row.religion}</td>
                <td className="px-4 py-3">{row.economy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
