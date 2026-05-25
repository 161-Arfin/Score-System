import FormLogin from "@/views/components/molecules/FormLogin";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-8 text-slate-950">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.14)] md:grid-cols-2">
        <div className="relative hidden min-h-[440px] overflow-hidden bg-cyan-800 p-10 text-white md:flex md:flex-col md:justify-between">
          <div className="relative z-10 max-w-sm pt-32">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-cyan-100/80">
              Internal Assessment
            </p>
            <h1 className="text-6xl font-bold leading-tight">Selamat Datang</h1>
            <p className="mt-6 text-sm leading-6 text-cyan-50/85">
              Masuk untuk mulai melakukan assesment dan mengelola data penilaian
              dengan mudah.
            </p>
          </div>

          <p className="relative z-10 text-xs text-cyan-50/70 pt-3">
            &copy; 2026 Score System. All rights reserved.
          </p>

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-600/45" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-950/35" />
          <div className="absolute bottom-12 right-8 h-52 w-52 rounded-full bg-white/10" />
        </div>

        <div className="flex min-h-[440px] items-center justify-center px-7 py-8 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-950">Login</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Selamat datang kembali. Silakan masuk untuk melanjutkan.
              </p>
            </div>

            <FormLogin />
          </div>
        </div>
      </section>
    </main>
  );
}
