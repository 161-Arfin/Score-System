import { useEffect, useState } from "react";
import { getAssessmentResults } from "@/features/assessment/services/assessment.service";
import type { AssessmentResult } from "@/features/assessment/types";
import AssessmentResultTable from "@/views/components/molecules/Assessment/AssessmentResultTable";

export default function AssessmentResponse() {
  const [rows, setRows] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAssessmentResults = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const result = await getAssessmentResults();
        setRows(result);
      } catch {
        setRows([]);
        setErrorMessage(
          "Data response assessment belum bisa dimuat. Pastikan backend sudah menyediakan endpoint READ assessment.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentResults();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Tabel Response Assessment
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Jawaban anggota pada pertanyaan assesment.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-sm">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Memuat data Response Assessment...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mengambil jawaban assessment anggota yang sudah tersimpan.
          </p>
        </div>
      ) : (
        <AssessmentResultTable rows={rows} />
      )}
    </section>
  );
}
