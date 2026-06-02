import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  getDeletedUnitBmtList,
  permanentDeleteUnitBmt,
  restoreUnitBmt,
} from "@/features/bmt/services/bmt.service";
import type { UnitBmt } from "@/features/bmt/types";
import EmptyState from "@/views/components/atoms/EmptyState";
import TableActionButton from "@/views/components/atoms/TableActionButton";

export default function BmtRecycleBinPage() {
  const [rows, setRows] = useState<UnitBmt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");

  const loadRows = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getDeletedUnitBmtList();
      setRows(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadRows, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRows]);

  const handleRestore = async (row: UnitBmt) => {
    const isConfirmed = window.confirm(
      `Restore ${row.instansi_name} ke daftar Unit BMT?`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setProcessingId(row.id);
      await restoreUnitBmt(row.id);
      await loadRows();
    } finally {
      setProcessingId("");
    }
  };

  const handlePermanentDelete = async (row: UnitBmt) => {
    const isConfirmed = window.confirm(
      `Hapus permanen ${row.instansi_name}? Data ini tidak bisa dikembalikan.`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setProcessingId(row.id);
      await permanentDeleteUnitBmt(row.id);
      await loadRows();
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          Recycle Bin Unit BMT
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Silahkan kelola data unit BMT yang sudah dihapus sementara.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Memuat recycle bin...
          </p>
        </div>
      ) : rows.length ? (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="w-16 px-5 py-3 font-semibold">No</th>
                  <th className="px-5 py-3 font-semibold">Nama Unit BMT</th>
                  <th className="px-5 py-3 font-semibold">Alamat</th>
                  <th className="px-5 py-3 font-semibold">No Telepon</th>
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
                      {row.instansi_name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {row.instansi_address}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {row.instansi_phone}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <TableActionButton
                          title="Restore unit"
                          aria-label="Restore unit"
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
          title="Recycle bin masih kosong"
          description=""
        />
      )}
    </div>
  );
}
