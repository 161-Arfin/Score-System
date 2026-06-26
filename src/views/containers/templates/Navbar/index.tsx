import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LockKeyhole, LogOut, Menu, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

type NavbarProps = {
  constrained?: boolean;
  onOpenMobileSidebar?: () => void;
  showMobileMenu?: boolean;
  showProfileMenu?: boolean;
  title?: string;
};

export default function Navbar({
  constrained = false,
  onOpenMobileSidebar,
  showMobileMenu = true,
  showProfileMenu = true,
  title = "Sakinah Score Dashboard",
}: NavbarProps) {
  const { data: session } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileName = session?.user?.name ?? "Admin Score System";
  const initials = profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div
        className={[
          "flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          constrained ? "mx-auto max-w-[1600px]" : "",
        ].join(" ")}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {showMobileMenu ? (
              <button
                type="button"
                title="Buka menu"
                aria-label="Buka menu"
                onClick={onOpenMobileSidebar}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition duration-200 hover:border-cyan-800/40 hover:bg-cyan-50 hover:text-cyan-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-800/15 lg:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={2} />
              </button>
            ) : null}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800 lg:hidden">
                Score System
              </p>
              <h1 className="truncate text-base font-bold leading-tight text-slate-950 sm:text-lg lg:text-xl">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {showProfileMenu ? (
          <div ref={profileMenuRef} className="relative flex items-center gap-2">
            <button
              type="button"
              title={profileName}
              aria-label="Buka menu profil"
              aria-expanded={isProfileMenuOpen}
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-800 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-800 focus:ring-offset-2"
            >
              {initials || <UserRound className="h-4 w-4" strokeWidth={2} />}
            </button>

            <div
              className={[
                "absolute right-0 top-12 z-30 w-56 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-150",
                isProfileMenuOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-95 opacity-0",
              ].join(" ")}
            >
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-bold text-slate-950">
                  {profileName}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Administrator
                </p>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800"
                >
                  <UserRound className="h-4 w-4" strokeWidth={2} />
                  Profile
                </Link>
                <Link
                  href="/profile/change-password"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800"
                >
                  <LockKeyhole className="h-4 w-4" strokeWidth={2} />
                  Ubah Password
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2} />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
