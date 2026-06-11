import { useSession } from "next-auth/react";
import { UserRound } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const profileName = session?.user?.name ?? "Admin Score System";
  const profileEmail = session?.user?.email ?? "admin@sakinahscore.local";

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Profile User</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Informasi akun pengguna yang sedang aktif pada sistem.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
            <UserRound className="h-8 w-8" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-950">{profileName}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Administrator
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Nama
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {profileName}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Email
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {profileEmail}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Role
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Admin Score System
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Status
            </p>
            <p className="mt-2 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
              Aktif
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
