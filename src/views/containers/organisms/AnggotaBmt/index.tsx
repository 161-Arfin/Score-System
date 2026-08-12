import { useCallback, useEffect, useState } from "react";
import {
  deleteAnggotaBmt,
  getAnggotaBmtList,
} from "@/features/anggota-bmt/services/anggota-bmt.service";
import type { AnggotaBmt } from "@/features/anggota-bmt/types";
import { getPublicUnitBmtList } from "@/features/bmt/services/bmt.service";
import DropdownField from "@/views/components/atoms/DropdownField";
import TableSkeleton from "@/views/components/atoms/TableSkeleton";
import AnggotaBmtDeleteDialog from "@/views/components/molecules/AnggotaBmt/AnggotaBmtDeleteDialog";
import AnggotaBmtTable from "@/views/components/molecules/AnggotaBmt/AnggotaBmtTable";

export default function AnggotaBmtContainer() {
  const [filteredRows, setFilteredRows] = useState<AnggotaBmt[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState("all");
  const [unitOptions, setUnitOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDeleteRow, setSelectedDeleteRow] =
    useState<AnggotaBmt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const loadRows = useCallback(async (unitId: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      // Passes instansi_id parameter to API (ready for backend filtering when API supports it)
      const response = await getAnggotaBmtList({
        instansi_id: unitId !== "all" ? unitId : undefined,
      });

      // Client-side fallback filter so UI instantly works even if API returns all rows
      if (unitId === "all") {
        setFilteredRows(response.data);
      } else {
        setFilteredRows(
          response.data.filter(
            (row) =>
              String(row.instansi_id) === unitId ||
              String(row.instansi_name) === unitId,
          ),
        );
      }
    } catch {
      setErrorMessage("Data Anggota BMT belum bisa dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadRows(selectedUnitId), 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRows, selectedUnitId]);

  const handleDelete = async () => {
    if (!selectedDeleteRow) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAnggotaBmt(selectedDeleteRow.id);
      setSelectedDeleteRow(null);
      await loadRows(selectedUnitId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Data Anggota BMT
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Silahkan kelola data keluarga anggota BMT yang terdaftar pada
            sistem.
          </p>
        </div>
      </div>

      {/* Filter Section (Wadah API Unit BMT) */}
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Filter Unit BMT
            </h2>
            <p className="text-xs text-slate-500">
              Tampilkan data anggota berdasarkan unit BMT
            </p>
          </div>

          <div className="w-full md:w-72">
            <DropdownField
              label=""
              name="anggota_bmt_unit_filter"
              value={selectedUnitId}
              onChange={(value) => setSelectedUnitId(value || "all")}
              options={[{ label: "Semua Unit", value: "all" }, ...unitOptions]}
              placeholder="Semua Unit"
              searchable={false}
            />
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-sm">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <TableSkeleton columns={8} minWidthClassName="min-w-245" />
      ) : (
        <AnggotaBmtTable
          rows={filteredRows}
          onDelete={setSelectedDeleteRow}
        />
      )}

      <AnggotaBmtDeleteDialog
        isDeleting={isDeleting}
        row={selectedDeleteRow}
        onCancel={() => setSelectedDeleteRow(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
