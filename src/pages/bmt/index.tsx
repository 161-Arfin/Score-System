export default function BmtPage() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-800">
            Data Master
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">BMT</h1>
          <p className="mt-2 text-sm text-slate-500">
            Table dan form CRUD BMT akan ditempatkan di halaman ini.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-cyan-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900"
        >
          Tambah BMT
        </button>
      </div>
    </section>
  );
}
