import type { FormEvent } from "react";
import type { UnitBmtPayload } from "@/features/bmt/types";

type BmtFormProps = {
  values: UnitBmtPayload;
  isSubmitting: boolean;
  onChange: (values: UnitBmtPayload) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function BmtForm({
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  values,
}: BmtFormProps) {
  const updateField = (name: keyof UnitBmtPayload, value: string) => {
    onChange({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            Nama Unit BMT
          </label>
          <input
            required
            name="instansi_name"
            type="text"
            value={values.instansi_name}
            placeholder="Unit BMT A"
            onChange={(event) =>
              updateField("instansi_name", event.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">Alamat</label>
          <input
            required
            name="instansi_address"
            type="text"
            value={values.instansi_address}
            placeholder="Alamat lengkap unit BMT"
            onChange={(event) =>
              updateField("instansi_address", event.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            No. Telepon
          </label>
          <input
            required
            name="instansi_phone"
            type="tel"
            pattern="^628[0-9]{7,15}$"
            title="Gunakan format nomor berawalan 628, contoh 6281212345678"
            value={values.instansi_phone}
            placeholder="6281212345678"
            onChange={(event) =>
              updateField("instansi_phone", event.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
          <p className="text-xs text-slate-500">
            Format nomor wajib berawalan 628.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-cyan-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-cyan-800/50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
