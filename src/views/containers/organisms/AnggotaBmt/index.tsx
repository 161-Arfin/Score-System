import { useCallback, useEffect, useState } from "react";
import {
  deleteAnggotaBmt,
  getAnggotaBmtList,
} from "@/features/anggota-bmt/services/anggota-bmt.service";
import type { AnggotaBmt } from "@/features/anggota-bmt/types";
import AnggotaBmtDeleteDialog from "@/views/components/molecules/AnggotaBmt/AnggotaBmtDeleteDialog";
import AnggotaBmtTable from "@/views/components/molecules/AnggotaBmt/AnggotaBmtTable";

export default function AnggotaBmtContainer() {
  const [rows, setRows] = useState<AnggotaBmt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDeleteRow, setSelectedDeleteRow] = useState<AnggotaBmt | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getAnggotaBmtList();
      setRows(response.data);
    } catch {
      setErrorMessage("Data Anggota BMT belum bisa dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadRows, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRows]);

  const handleDelete = async () => {
    if (!selectedDeleteRow) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAnggotaBmt(selectedDeleteRow.id);
      setSelectedDeleteRow(null);
      await loadRows();
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
        {/* <Link
          href="/anggota-bmt/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah Anggota
        </Link> */}
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-sm">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Memuat data Anggota BMT...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mengambil daftar keluarga yang terhubung dengan unit BMT.
          </p>
        </div>
      ) : (
        <AnggotaBmtTable rows={rows} onDelete={setSelectedDeleteRow} />
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
