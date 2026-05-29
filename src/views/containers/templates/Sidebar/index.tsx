import Link from "next/link";
import { useRouter } from "next/router";
import {
  BarChart3,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  UsersRound,
} from "lucide-react";

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    label: "BMT",
    href: "/bmt",
    icon: Building2,
  },
  {
    label: "Anggota BMT",
    href: "/anggota-bmt",
    icon: UsersRound,
  },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();

  return (
    <aside
      className={[
        "border-b border-slate-200 bg-white transition-all duration-200 lg:min-h-screen lg:border-b-0 lg:border-r",
        isCollapsed ? "lg:w-[72px]" : "lg:w-64",
      ].join(" ")}
    >
      <div
        className={[
          "hidden h-16 items-center border-b border-slate-200 lg:flex",
          isCollapsed ? "justify-center px-3" : "justify-between px-5",
        ].join(" ")}
      >
        {!isCollapsed ? (
          <div>
            <p className="text-xs font-semibold uppercase text-cyan-800">
              Score System
            </p>
            <h2 className="mt-0.5 text-base font-bold text-slate-950">
              Sakinah Score
            </h2>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          title={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
          aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-800/40 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-800/15"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" strokeWidth={2} />
          ) : (
            <PanelLeftClose className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>

      <nav
        className={[
          "flex gap-2 overflow-x-auto px-4 py-3 lg:block lg:space-y-2 lg:overflow-visible lg:py-5",
          isCollapsed ? "lg:px-3" : "lg:px-4",
        ].join(" ")}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? router.pathname === "/"
              : router.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={[
                "flex min-w-max items-center gap-3 rounded-lg text-sm font-semibold transition lg:min-w-0",
                isCollapsed
                  ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:px-0"
                  : "px-3 py-2.5 lg:h-10",
                isActive
                  ? "bg-cyan-800 text-white shadow-sm"
                  : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
              ].join(" ")}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className={isCollapsed ? "lg:hidden" : ""}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
