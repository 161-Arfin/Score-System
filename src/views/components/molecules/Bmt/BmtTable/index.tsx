import Link from "next/link";
import { Edit3, Trash2, Building2 } from "lucide-react";
import type { UnitBmt } from "@/features/bmt/types";
import EmptyState from "@/views/components/atoms/EmptyState";
import TableActionButton from "@/views/components/atoms/TableActionButton";

type BmtTableProps = {
  rows: UnitBmt[];
  onDelete: (unit: UnitBmt) => void;
};

export default function BmtTable({ onDelete, rows }: BmtTableProps) {
  if (!rows.length) {
    return (
      <EmptyState
        icon={Building2}
        title="Unit BMT belum ditemukan"
        description="Ubah kata kunci pencarian atau tambahkan unit baru untuk mulai mengelola data."
      />
    );
  }

  return (
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
              <tr
                key={row.id}
                className="text-slate-700 transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4 font-semibold text-slate-500">
                  {index + 1}
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-slate-950">{row.instansi_name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="max-w-[360px] leading-6 text-slate-600">
                    {row.instansi_address}
                  </p>
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {row.instansi_phone}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/bmt/${row.id}/edit`}
                      title="Edit unit"
                      aria-label="Edit unit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-slate-600 transition hover:border-cyan-800/30 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-800/15"
                    >
                      <Edit3 className="h-4 w-4" strokeWidth={2} />
                    </Link>
                    <TableActionButton
                      title="Hapus unit"
                      aria-label="Hapus unit"
                      tone="danger"
                      onClick={() => onDelete(row)}
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
  );
}
