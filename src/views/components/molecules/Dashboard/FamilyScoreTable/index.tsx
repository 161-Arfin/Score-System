import type { FamilyScoreRow } from "@/features/dashboard/types";
import ScoreBadge from "@/views/components/atoms/ScoreBadge";

type FamilyScoreTableProps = {
  rows: FamilyScoreRow[];
};

export default function FamilyScoreTable({ rows }: FamilyScoreTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Detail Score Per Keluarga
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Daftar keluarga terukur
          </h2>
        </div>
        <span className="text-sm font-semibold text-cyan-800">Table</span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-3 pr-4 font-semibold">Nama</th>
              <th className="px-4 py-3 font-semibold">Unit</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Score</th>
              <th className="px-4 py-3 font-semibold">Tier</th>
              <th className="px-4 py-3 font-semibold">Ad-Din</th>
              <th className="px-4 py-3 font-semibold">Al-Mal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-slate-700">
                <td className="py-3 pr-4 font-semibold text-slate-950">
                  {row.name}
                </td>
                <td className="px-4 py-3">{row.unitName}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3 font-semibold text-cyan-800">
                  {row.score}
                </td>
                <td className="px-4 py-3">
                  <ScoreBadge tier={row.tier} />
                </td>
                <td className="px-4 py-3">{row.adDin}</td>
                <td className="px-4 py-3">{row.alMal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
