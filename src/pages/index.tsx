import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Score System</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">
          Halaman awal
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Masuk untuk mulai mengakses platform penilaian.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Ke halaman login
        </Link>
      </section>
    </main>
  );
}
