import { useCallback, useEffect, useState } from "react";
import { getAssessmentResults } from "@/features/assessment/services/assessment.service";
import type { AssessmentResult } from "@/features/assessment/types";
import { getPublicUnitBmtList } from "@/features/bmt/services/bmt.service";
import DropdownField from "@/views/components/atoms/DropdownField";
import TableSkeleton from "@/views/components/atoms/TableSkeleton";
import AssessmentResultTable from "@/views/components/molecules/Assessment/AssessmentResultTable";

export default function AssessmentResponse() {
  const [filteredRows, setFilteredRows] = useState<AssessmentResult[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState("all");
  const [unitOptions, setUnitOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Load Unit BMT dropdown options on mount
  useEffect(() => {
    async function loadUnits() {
      try {
        const response = await getPublicUnitBmtList();
        const options = response.data.map((unit) => ({
          label: unit.instansi_name,
          value: String(unit.id),
        }));
        setUnitOptions(options);
      } catch {
        // Fallback if units endpoint fails
      }
    }
    loadUnits();
  }, []);

  const loadAssessmentResults = useCallback(async (unitId: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getAssessmentResults({
        instansi_id: unitId !== "all" ? unitId : undefined,
      });

      // Client-side fallback filter so UI instantly works even if API returns all rows
      if (unitId === "all") {
        setFilteredRows(result);
      } else {
        const selectedOption = unitOptions.find((opt) => opt.value === unitId);
        const selectedName = selectedOption?.label.toLowerCase();

        setFilteredRows(
          result.filter(
            (row) =>
              (selectedName &&
                row.instansi_name.toLowerCase() === selectedName) ||
              String((row as unknown as Record<string, unknown>).instansi_id) ===
                unitId,
          ),
        );
      }
    } catch {
      setFilteredRows([]);
      setErrorMessage(
        "Data response assessment belum bisa dimuat. Pastikan backend sudah menyediakan endpoint READ assessment.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [unitOptions]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => loadAssessmentResults(selectedUnitId),
      0,
    );

    return () => window.clearTimeout(timeoutId);
  }, [loadAssessmentResults, selectedUnitId]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Tabel Response Assessment
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Jawaban anggota pada pertanyaan assesment.
          </p>
        </div>

        <div className="w-full sm:w-64 shrink-0">
          <DropdownField
            label=""
            name="assessment_response_unit_filter"
            value={selectedUnitId}
            onChange={(value) => setSelectedUnitId(value || "all")}
            options={[{ label: "Semua Unit", value: "all" }, ...unitOptions]}
            placeholder="Semua Unit"
            searchable={false}
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-sm">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <TableSkeleton columns={8} minWidthClassName="min-w-[1100px]" />
      ) : (
        <AssessmentResultTable rows={filteredRows} />
      )}
    </section>
  );
}
