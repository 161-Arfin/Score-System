import type { UnitBmt } from "@/features/bmt/types";

type BmtDeleteDialogProps = {
  unit: UnitBmt | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function BmtDeleteDialog({
  isDeleting,
  onCancel,
  onConfirm,
  unit,
}: BmtDeleteDialogProps) {
  if (!unit) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mt-2 text-xl font-bold text-slate-950">
          Hapus {unit.instansi_name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Apakah Anda yakin ingin menghapus unit ini?
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
