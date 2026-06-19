import { useCallback, useEffect, useState } from "react";
import {
  deleteUnitBmt,
  getUnitBmtList,
} from "@/features/bmt/services/bmt.service";
import type { UnitBmt } from "@/features/bmt/types";
import BmtDeleteDialog from "@/views/components/molecules/Bmt/BmtDeleteDialog";
import BmtTable from "@/views/components/molecules/Bmt/BmtTable";

export default function Bmt() {
  const [rows, setRows] = useState<UnitBmt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDeleteUnit, setSelectedDeleteUnit] = useState<UnitBmt | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getUnitBmtList();

      setRows(response.data);
    } catch {
      setErrorMessage("Data Unit BMT belum bisa dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadRows();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRows]);

  const handleDelete = async () => {
    if (!selectedDeleteUnit) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUnitBmt(selectedDeleteUnit.id);
      setSelectedDeleteUnit(null);
      await loadRows();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Data Unit BMT</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Silahkan kelola data unit BMT yang terdaftar pada sistem.
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
            Memuat data Unit BMT...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mengambil daftar unit yang terhubung dengan dashboard.
          </p>
        </div>
      ) : (
        <BmtTable rows={rows} onDelete={setSelectedDeleteUnit} />
      )}

      <BmtDeleteDialog
        isDeleting={isDeleting}
        unit={selectedDeleteUnit}
        onCancel={() => setSelectedDeleteUnit(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
