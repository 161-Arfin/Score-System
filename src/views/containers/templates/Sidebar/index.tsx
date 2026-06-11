import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardList,
  ClipboardMinus,
  Menu,
  UserRound,
  X,
  UsersRound,
} from "lucide-react";
import { normalizeUserRole } from "@/lib/auth/permissions";

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggle: () => void;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
];

function SidebarSectionLabel({
  children,
  isCollapsed,
}: {
  children: string;
  isCollapsed: boolean;
}) {
  return (
    <div className={["pt-3", isCollapsed ? "lg:hidden" : ""].join(" ")}>
      <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {children}
      </p>
    </div>
  );
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggle,
}: SidebarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = normalizeUserRole(session?.user?.role);
  const canManageUnitBmt = userRole === "superadmin";
  const isBmtActive = router.pathname.startsWith("/bmt");
  const isAnggotaBmtActive = router.pathname.startsWith("/anggota-bmt");
  const isAssessmentActive =
    router.pathname === "/assessment" ||
    router.pathname === "/assessment/response";
  const isScoreAssessmentActive = router.pathname === "/assessment/score";
  const isProfileActive = router.pathname.startsWith("/profile");
  const [isBmtMenuOpen, setIsBmtMenuOpen] = useState(isBmtActive);
  const [isBmtFlyoutOpen, setIsBmtFlyoutOpen] = useState(false);
  const [isAnggotaBmtMenuOpen, setIsAnggotaBmtMenuOpen] =
    useState(isAnggotaBmtActive);
  const [isAnggotaBmtFlyoutOpen, setIsAnggotaBmtFlyoutOpen] = useState(false);

  const bmtMenuItems = [
    {
      label: "Data BMT",
      href: "/bmt",
    },
    {
      label: "Tambah BMT",
      href: "/bmt/create",
    },
    {
      label: "Recycle Bin",
      href: "/bmt/recycle-bin",
    },
  ];

  const anggotaBmtMenuItems = [
    {
      label: "Data Anggota",
      href: "/anggota-bmt",
    },
    {
      label: "Tambah Anggota",
      href: "/anggota-bmt/create",
    },
    {
      label: "Recycle Bin",
      href: "/anggota-bmt/recycle-bin",
    },
  ];

  const closeFloatingMenus = () => {
    setIsBmtFlyoutOpen(false);
    setIsAnggotaBmtFlyoutOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Tutup menu"
        onClick={() => {
          closeFloatingMenus();
          onCloseMobile();
        }}
        className={[
          "fixed inset-0 z-40 bg-slate-950/35 transition-opacity duration-300 ease-out lg:hidden",
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 transform-gpu overflow-hidden border-r border-slate-200 bg-white shadow-2xl shadow-slate-950/10 transition-[transform,width] duration-300 ease-out will-change-transform lg:sticky lg:top-0 lg:h-screen lg:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-[72px] lg:overflow-visible" : "lg:w-64",
          isBmtFlyoutOpen || isAnggotaBmtFlyoutOpen ? "lg:z-40" : "lg:z-auto",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-16 items-center border-b border-slate-200 transition-[padding] duration-300 ease-out",
            isCollapsed ? "justify-center px-3" : "justify-between px-5",
          ].join(" ")}
        >
          {!isCollapsed ? (
            <div className="overflow-hidden whitespace-nowrap transition-opacity duration-200">
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
            onClick={() => {
              closeFloatingMenus();
              onCloseMobile();
            }}
            title="Tutup menu"
            aria-label="Tutup menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition duration-200 hover:border-cyan-800/40 hover:bg-cyan-50 hover:text-cyan-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-800/15 lg:hidden"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => {
              closeFloatingMenus();
              onToggle();
            }}
            title={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
            aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-800/40 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-800/15 lg:flex"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav
          className={[
            "space-y-2 py-5 transition-[padding] duration-300 ease-out",
            isCollapsed
              ? "overflow-y-auto lg:overflow-visible lg:px-3"
              : "overflow-y-auto px-4",
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
                onClick={() => {
                  closeFloatingMenus();
                  onCloseMobile();
                }}
                title={item.label}
                className={[
                  "flex min-w-max items-center gap-3 overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 ease-out lg:min-w-0",
                  isCollapsed
                    ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                    : "px-3 py-2.5 lg:h-10",
                  isActive
                    ? "bg-cyan-800 text-white shadow-sm"
                    : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                <span
                  className={[
                    "whitespace-nowrap transition-opacity duration-200",
                    isCollapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <SidebarSectionLabel isCollapsed={isCollapsed}>BMT</SidebarSectionLabel>

          {canManageUnitBmt ? (
          <div className="relative min-w-max lg:min-w-0">
            <button
              type="button"
              title="Unit BMT"
              aria-label="Unit BMT"
              aria-expanded={isCollapsed ? isBmtFlyoutOpen : isBmtMenuOpen}
              onClick={() => {
                setIsBmtMenuOpen((current) => !current);
                setIsAnggotaBmtFlyoutOpen(false);
                setIsBmtFlyoutOpen((current) =>
                  isCollapsed ? !current : false,
                );
              }}
              className={[
                "flex w-full min-w-max items-center gap-3 overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 ease-out lg:min-w-0",
                isCollapsed
                  ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                  : "px-3 py-2.5 lg:h-10",
                isBmtActive
                  ? "bg-cyan-800 text-white shadow-sm"
                  : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
              ].join(" ")}
            >
              <Building2
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2}
              />
              <span
                className={[
                  "whitespace-nowrap transition-opacity duration-200",
                  isCollapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
                ].join(" ")}
              >
                Unit BMT
              </span>
              {!isCollapsed ? (
                <ChevronDown
                  className={[
                    "ml-auto h-4 w-4 transition",
                    isBmtMenuOpen ? "rotate-180" : "",
                  ].join(" ")}
                  strokeWidth={2}
                />
              ) : null}
            </button>

            {isBmtMenuOpen ? (
              <div
                className={[
                  "mt-2 space-y-1 border-l border-slate-200 pl-3 transition-all duration-300 ease-out lg:ml-5",
                  isCollapsed ? "lg:hidden" : "",
                ].join(" ")}
              >
                {bmtMenuItems.map((item) => {
                  const isActive = router.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        closeFloatingMenus();
                        onCloseMobile();
                      }}
                      className={[
                        "flex h-9 items-center rounded-md px-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-cyan-50 text-cyan-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {isCollapsed ? (
              <div
                className={[
                  "absolute left-full top-0 z-50 ml-4 hidden w-52 origin-left transform-gpu rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-200 ease-out lg:block",
                  isBmtFlyoutOpen
                    ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-x-1 scale-95 opacity-0",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[7px] top-[22px] h-3.5 w-3.5 rotate-45 border-b border-l border-slate-200 bg-white"
                />
                {/* <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-cyan-800">
                  Unit BMT
                </p> */}
                <div className="space-y-1">
                  {bmtMenuItems.map((item) => {
                    const isActive = router.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          closeFloatingMenus();
                          onCloseMobile();
                        }}
                        className={[
                          "flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition",
                          isActive
                            ? "bg-cyan-50 text-cyan-800"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          ) : null}

          <div className="relative min-w-max lg:min-w-0">
            <button
              type="button"
              title="Anggota BMT"
              aria-label="Anggota BMT"
              aria-expanded={
                isCollapsed ? isAnggotaBmtFlyoutOpen : isAnggotaBmtMenuOpen
              }
              onClick={() => {
                setIsAnggotaBmtMenuOpen((current) => !current);
                setIsBmtFlyoutOpen(false);
                setIsAnggotaBmtFlyoutOpen((current) =>
                  isCollapsed ? !current : false,
                );
              }}
              className={[
                "flex w-full min-w-max items-center gap-3 overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 ease-out lg:min-w-0",
                isCollapsed
                  ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                  : "px-3 py-2.5 lg:h-10",
                isAnggotaBmtActive
                  ? "bg-cyan-800 text-white shadow-sm"
                  : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
              ].join(" ")}
            >
              <UsersRound
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2}
              />
              <span
                className={[
                  "whitespace-nowrap transition-opacity duration-200",
                  isCollapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
                ].join(" ")}
              >
                Anggota BMT
              </span>
              {!isCollapsed ? (
                <ChevronDown
                  className={[
                    "ml-auto h-4 w-4 transition",
                    isAnggotaBmtMenuOpen ? "rotate-180" : "",
                  ].join(" ")}
                  strokeWidth={2}
                />
              ) : null}
            </button>

            {isAnggotaBmtMenuOpen ? (
              <div
                className={[
                  "mt-2 space-y-1 border-l border-slate-200 pl-3 transition-all duration-300 ease-out lg:ml-5",
                  isCollapsed ? "lg:hidden" : "",
                ].join(" ")}
              >
                {anggotaBmtMenuItems.map((item) => {
                  const isActive = router.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        closeFloatingMenus();
                        onCloseMobile();
                      }}
                      className={[
                        "flex h-9 items-center rounded-md px-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-cyan-50 text-cyan-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {isCollapsed ? (
              <div
                className={[
                  "absolute left-full top-0 z-50 ml-4 hidden w-52 origin-left transform-gpu rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-200 ease-out lg:block",
                  isAnggotaBmtFlyoutOpen
                    ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-x-1 scale-95 opacity-0",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[7px] top-[22px] h-3.5 w-3.5 rotate-45 border-b border-l border-slate-200 bg-white"
                />
                <div className="space-y-1">
                  {anggotaBmtMenuItems.map((item) => {
                    const isActive = router.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          closeFloatingMenus();
                          onCloseMobile();
                        }}
                        className={[
                          "flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition",
                          isActive
                            ? "bg-cyan-50 text-cyan-800"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <SidebarSectionLabel isCollapsed={isCollapsed}>
            Assessment
          </SidebarSectionLabel>

          <Link
            href="/assessment/response"
            onClick={() => {
              closeFloatingMenus();
              onCloseMobile();
            }}
            title="Response Assessment"
            className={[
              "flex min-w-max items-center gap-3 overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 ease-out lg:min-w-0",
              isCollapsed
                ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                : "px-3 py-2.5 lg:h-10",
              isAssessmentActive
                ? "bg-cyan-800 text-white shadow-sm"
                : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
            ].join(" ")}
          >
            <ClipboardList
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={2}
            />
            <span
              className={[
                "whitespace-nowrap transition-opacity duration-200",
                isCollapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
              ].join(" ")}
            >
              Response Assessment
            </span>
          </Link>

          <Link
            href="/assessment/score"
            onClick={() => {
              closeFloatingMenus();
              onCloseMobile();
            }}
            title="Score Assessment"
            className={[
              "flex min-w-max items-center gap-3 overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 ease-out lg:min-w-0",
              isCollapsed
                ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                : "px-3 py-2.5 lg:h-10",
              isScoreAssessmentActive
                ? "bg-cyan-800 text-white shadow-sm"
                : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
            ].join(" ")}
          >
            <ClipboardMinus
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={2}
            />
            <span
              className={[
                "whitespace-nowrap transition-opacity duration-200",
                isCollapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
              ].join(" ")}
            >
              Score Assessment
            </span>
          </Link>

          <SidebarSectionLabel isCollapsed={isCollapsed}>
            User
          </SidebarSectionLabel>

          <Link
            href="/profile"
            onClick={() => {
              closeFloatingMenus();
              onCloseMobile();
            }}
            title="Profile User"
            className={[
              "flex min-w-max items-center gap-3 overflow-hidden rounded-lg text-sm font-semibold transition-all duration-300 ease-out lg:min-w-0",
              isCollapsed
                ? "lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                : "px-3 py-2.5 lg:h-10",
              isProfileActive
                ? "bg-cyan-800 text-white shadow-sm"
                : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800",
            ].join(" ")}
          >
            <UserRound
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={2}
            />
            <span
              className={[
                "whitespace-nowrap transition-opacity duration-200",
                isCollapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
              ].join(" ")}
            >
              Profile User
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
