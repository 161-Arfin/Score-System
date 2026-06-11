import { ClipboardList } from "lucide-react";
import type { AssessmentScoreResult } from "@/features/assessment/types";
import EmptyState from "@/views/components/atoms/EmptyState";

type AssessmentScoreTableProps = {
  rows: AssessmentScoreResult[];
};

const columns: Array<{
  key: keyof AssessmentScoreResult;
  label: string;
  align?: "left" | "center";
}> = [
  // { key: "timestamp", label: "Timestamp" },
  { key: "kepala_keluarga", label: "Nama Kepala Keluarga" },
  { key: "nama_istri", label: "Nama Istri" },
  { key: "phone", label: "No WhatsApp" },
  { key: "instansi_name", label: "Unit BMT" },
  { key: "tanggal_assessment", label: "Tanggal Assessment" },
  { key: "hifzAdDinScore", label: "Hifz Ad-Din Score", align: "center" },
  { key: "hifzAnNafsScore", label: "Hifz An-Nafs Score", align: "center" },
  { key: "hifzAlAqlScore", label: "Hifz Al-Aql Score", align: "center" },
  { key: "hifzAnNaslScore", label: "Hifz An-Nasl Score", align: "center" },
  { key: "hifzAlMalScore", label: "Hifz Al-Mal Score", align: "center" },
  { key: "totalSakinahScore", label: "TOTAL SAKINAH SCORE", align: "center" },
  { key: "tier", label: "TIER", align: "center" },
  { key: "statusAdDin", label: "Status Ad-Din" },
  { key: "statusAnNafs", label: "Status An-Nafs" },
  { key: "statusAlAql", label: "Status Al-Aql" },
  { key: "statusAnNasl", label: "Status An-Nasl" },
  { key: "statusAlMal", label: "Status Al-Mal" },
  { key: "dimensiTertinggi", label: "Dimensi Tertinggi" },
  { key: "dimensiTerendah", label: "Dimensi Terendah" },
];

function getTierClassName(tier: string) {
  if (tier === "Berlian") return "bg-purple-50 text-purple-700";
  if (tier === "Emas") return "bg-yellow-50 text-yellow-700";
  if (tier === "Perak") return "bg-slate-100 text-slate-700";
  if (tier === "Perunggu") return "bg-orange-50 text-orange-700";

  return "bg-red-50 text-red-700";
}

export default function AssessmentScoreTable({
  rows,
}: AssessmentScoreTableProps) {
  if (!rows.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Hasil assessment belum tersedia"
        description="Tabel hasil assessment anggota akan muncul setelah peserta mengirim assessment."
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[2500px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "px-4 py-3 font-semibold leading-5",
                    column.align === "center" ? "text-center" : "text-left",
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="text-slate-700 transition hover:bg-slate-50/80"
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  const isTierColumn = column.key === "tier";
                  const isTotalScoreColumn =
                    column.key === "totalSakinahScore";

                  return (
                    <td
                      key={`${row.id}-${column.key}`}
                      className={[
                        "px-4 py-4 align-middle",
                        column.align === "center" ? "text-center" : "",
                        isTotalScoreColumn
                          ? "font-bold text-slate-950"
                          : "font-medium text-slate-700",
                      ].join(" ")}
                    >
                      {isTierColumn ? (
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                            getTierClassName(String(value)),
                          ].join(" ")}
                        >
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
