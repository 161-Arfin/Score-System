import { useCallback, useEffect, useState } from "react";
import { getAssessmentScoreResults } from "@/features/assessment/services/assessment.service";
import type { AssessmentScoreResult } from "@/features/assessment/types";
import AssessmentScoreTable from "@/views/components/molecules/Assessment/AssessmentScoreTable";

export default function AssessmentScore() {
  const [rows, setRows] = useState<AssessmentScoreResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAssessmentScores = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getAssessmentScoreResults();
      setRows(result);
    } catch {
      setErrorMessage("Data score assessment belum bisa dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadAssessmentScores, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAssessmentScores]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Tabel Score Assessment
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Hasil assesment anggota BMT berdasarkan score per dimensi
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
            Memuat data Score Assessment...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mengambil hasil assessment anggota yang sudah tersimpan.
          </p>
        </div>
      ) : (
        <AssessmentScoreTable rows={rows} />
      )}
    </section>
  );
}
