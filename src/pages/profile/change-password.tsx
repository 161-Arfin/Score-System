import { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Semua field password wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi password baru belum sama.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          old_password: currentPassword,
          new_password: newPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
          confirm_password: confirmPassword,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setErrorMessage(payload?.message ?? "Password belum bisa diubah.");
        return;
      }

      setSuccessMessage(payload?.message ?? "Password berhasil diubah.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("Password belum bisa diubah. Coba ulangi kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Ubah Password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Perbarui password akun pengguna yang sedang aktif.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        {errorMessage ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        ) : null}
        {successMessage ? (
          <div className="mb-5 rounded-lg border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
            {successMessage}
          </div>
        ) : null}
        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Password Lama
            </span>
            <input
              type="password"
              name="current_password"
              value={currentPassword}
              disabled={isSubmitting}
              onChange={(event) => setCurrentPassword(event.target.value)}
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
              value={newPassword}
              disabled={isSubmitting}
              onChange={(event) => setNewPassword(event.target.value)}
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
              value={confirmPassword}
              disabled={isSubmitting}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
              placeholder="Ulangi password baru"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={resetForm}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-cyan-800 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </form>
    </section>
  );
}
