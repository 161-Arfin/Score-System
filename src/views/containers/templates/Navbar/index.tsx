import { Menu, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";

type NavbarProps = {
  onOpenMobileSidebar: () => void;
};

export default function Navbar({ onOpenMobileSidebar }: NavbarProps) {
  const { data: session } = useSession();
  const profileName = session?.user?.name ?? "Admin Score System";
  const initials = profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Buka menu"
              aria-label="Buka menu"
              onClick={onOpenMobileSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition duration-200 hover:border-cyan-800/40 hover:bg-cyan-50 hover:text-cyan-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-800/15 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-cyan-800 lg:hidden">
                Score System
              </p>
              <h1 className="truncate text-base font-bold text-slate-950 sm:text-lg lg:text-xl">
                Sakinah Score Dashboard
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title={profileName}
            aria-label="Profil"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-800 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-800 focus:ring-offset-2"
          >
            {initials || <UserRound className="h-4 w-4" strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  );
}
