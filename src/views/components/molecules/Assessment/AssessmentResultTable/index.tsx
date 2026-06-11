import { ClipboardList } from "lucide-react";
import { assessmentSections } from "@/features/assessment/constants";
import type { AssessmentResult } from "@/features/assessment/types";
import EmptyState from "@/views/components/atoms/EmptyState";

type AssessmentResultTableProps = {
  rows: AssessmentResult[];
};

const questionColumns = assessmentSections.flatMap((section) =>
  section.questions.map((question) => ({
    id: question.id,
    label: question.id.toUpperCase(),
    description:
      {
        q8: "Sholat Suami",
        q9: "Sholat Istri Anak",
        q10: "Tahfizh Qur'an",
        q11: "Sedekah Rutin",
        q12: "Kajian Keislaman",
        q13: "Puasa Sunnah",
        q14: "Cek Kesehatan",
        q15: "Olahraga",
        q16: "Pola Makan",
        q17: "Tidur Cukup",
        q18: "Mental",
        q19: "Akses Kesehatan",
        q20: "Pendidikan Anak",
        q21: "Belajar Bersama",
        q22: "Literasi",
        q23: "Screen Time",
        q24: "Ortu di Sekolah",
        q25: "Skill Ortu",
        q26: "Progress Anak",
        q27: "Konflik Pasutri",
        q28: "Resolusi Konflik",
        q29: "Quality Time",
        q30: "Komunikasi",
        q31: "Pola Asuh",
        q32: "Hubungan Saudara",
        q33: "Kepuasan Nikah",
        q34: "Income",
        q35: "Utang",
        q36: "Dana Darurat",
        q37: "Catatan Keuangan",
        q38: "Syariah",
        q39: "Aset Produktif",
      }[question.id] ?? question.indicator,
  }))
);

function getAnswerScore(row: AssessmentResult, questionId: string) {
  return (
    row.answers.find((answer) => answer.questionId === questionId)?.score ?? "-"
  );
}

export default function AssessmentResultTable({
  rows,
}: AssessmentResultTableProps) {
  if (!rows.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Data assessment belum tersedia"
        description="Skor jawaban anggota BMT akan muncul setelah peserta mengirim assessment melalui link form atau Chat Bot Whatsapp."
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[2600px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <th className="w-16 px-5 py-3 font-semibold">No</th>
              <th className="px-5 py-3 font-semibold">Nama Kepala Keluarga</th>
              <th className="px-5 py-3 font-semibold">Nama Istri</th>
              <th className="px-5 py-3 font-semibold">Alamat</th>
              <th className="px-5 py-3 font-semibold">No. Whatsapp</th>
              <th className="px-5 py-3 font-semibold">Unit BMT</th>
              <th className="px-5 py-3 font-semibold">Tanggal Submit</th>
              {questionColumns.map((question) => (
                <th
                  key={question.id}
                  className="min-w-28 px-4 py-3 text-center font-semibold"
                >
                  <span className="block text-xs font-bold text-slate-700">
                    {question.label}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold normal-case leading-4 text-slate-500">
                    {question.description}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className="text-slate-700 transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4 font-semibold text-slate-500">
                  {index + 1}
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-slate-950">
                    {row.kepala_keluarga}
                  </p>
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {row.nama_istri}
                </td>
                <td className="px-5 py-4">
                  <p className="max-w-[280px] leading-6 text-slate-600">
                    {row.alamat}
                  </p>
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {row.phone}
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {row.instansi_name}
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {row.submittedAt}
                </td>
                {questionColumns.map((question) => (
                  <td
                    key={`${row.id}-${question.id}`}
                    className="px-4 py-4 text-center font-bold text-slate-950"
                  >
                    {getAnswerScore(row, question.id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
