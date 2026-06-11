export default function ChangePasswordPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Ubah Password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Perbarui password akun pengguna yang sedang aktif.
        </p>
      </div>

      <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Password Lama
            </span>
            <input
              type="password"
              name="current_password"
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
              placeholder="Masukkan password lama"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Password Baru
            </span>
            <input
              type="password"
              name="new_password"
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
              placeholder="Masukkan password baru"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Konfirmasi Password Baru
            </span>
            <input
              type="password"
              name="confirm_password"
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
              placeholder="Ulangi password baru"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="h-10 rounded-lg bg-cyan-800 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-900"
          >
            Simpan Password
          </button>
        </div>
      </form>
    </section>
  );
}
