import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  getDeletedAnggotaBmtList,
  permanentDeleteAnggotaBmt,
  restoreAnggotaBmt,
} from "@/features/anggota-bmt/services/anggota-bmt.service";
import type { AnggotaBmt } from "@/features/anggota-bmt/types";
import EmptyState from "@/views/components/atoms/EmptyState";
import TableActionButton from "@/views/components/atoms/TableActionButton";
import TableSkeleton from "@/views/components/atoms/TableSkeleton";

export default function AnggotaBmtRecycleBinPage() {
  const [rows, setRows] = useState<AnggotaBmt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");

  const loadRows = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getDeletedAnggotaBmtList();
      setRows(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadRows, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRows]);

  const handleRestore = async (row: AnggotaBmt) => {
    const isConfirmed = window.confirm(
      `Restore ${row.kepala_keluarga} ke daftar Anggota BMT?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setProcessingId(row.id);
      await restoreAnggotaBmt(row.id);
      await loadRows();
    } finally {
      setProcessingId("");
    }
  };

  const handlePermanentDelete = async (row: AnggotaBmt) => {
    const isConfirmed = window.confirm(
      `Hapus permanen ${row.kepala_keluarga}? Data ini tidak bisa dikembalikan.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setProcessingId(row.id);
      await permanentDeleteAnggotaBmt(row.id);
      await loadRows();
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          Recycle Bin Anggota BMT
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Silahkan kelola data anggota BMT yang sudah dihapus sementara.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton columns={6} minWidthClassName="min-w-[900px]" />
      ) : rows.length ? (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="w-16 px-5 py-3 font-semibold">No</th>
                  <th className="px-5 py-3 font-semibold">
                    Nama Kepala Keluarga
                  </th>
                  <th className="px-5 py-3 font-semibold">Nama Istri</th>
                  <th className="px-5 py-3 font-semibold">No. Whatsapp</th>
                  <th className="px-5 py-3 font-semibold">Unit BMT</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, index) => (
                  <tr key={row.id} className="text-slate-700">
                    <td className="px-5 py-4 font-semibold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {row.kepala_keluarga}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {row.nama_istri}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {row.phone}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {row.instansi_name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <TableActionButton
                          title="Restore anggota"
                          aria-label="Restore anggota"
                          disabled={processingId === row.id}
                          onClick={() => handleRestore(row)}
                        >
                          <RotateCcw className="h-4 w-4" strokeWidth={2} />
                        </TableActionButton>
                        <TableActionButton
                          title="Hapus permanen"
                          aria-label="Hapus permanen"
                          tone="danger"
                          disabled={processingId === row.id}
                          onClick={() => handlePermanentDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          icon={Trash2}
          title="Recycle bin anggota masih kosong"
          description=""
        />
      )}
    </div>
  );
}
