import { useEffect, useState } from "react";
import { getAssessmentResults } from "@/features/assessment/services/assessment.service";
import type { AssessmentResult } from "@/features/assessment/types";
import AssessmentResultTable from "@/views/components/molecules/Assessment/AssessmentResultTable";

export default function AssessmentResponse() {
  const [rows, setRows] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    const loadAssessmentResults = async () => {
      const result = await getAssessmentResults();
      setRows(result);
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

      <AssessmentResultTable rows={rows} />
    </section>
  );
}
