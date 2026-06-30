import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  ADMIN_FALLBACK_PATH,
  canAccessPath,
  normalizeUserRole,
} from "@/lib/auth/permissions";
import Navbar from "@/views/containers/templates/Navbar";
import Sidebar from "@/views/containers/templates/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBrowserSessionChecked, setIsBrowserSessionChecked] = useState(false);
  const isAuthPage = router.pathname.startsWith("/auth");
  const userRole = normalizeUserRole(session?.user?.role);

  useEffect(() => {
    if (!router.isReady || isAuthPage) {
      setIsBrowserSessionChecked(true);
      return;
    }

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    const hasActiveBrowserSession =
      window.sessionStorage.getItem("score-system-session-active") === "true";

    if (!hasActiveBrowserSession) {
      signOut({ redirect: false }).finally(() => {
        router.replace("/auth/login");
      });
      return;
    }

    setIsBrowserSessionChecked(true);
  }, [isAuthPage, router, status]);

  useEffect(() => {
    if (
      !router.isReady ||
      isAuthPage ||
      status !== "authenticated" ||
      !isBrowserSessionChecked
    ) {
      return;
    }

    if (!canAccessPath(userRole, router.pathname)) {
      router.replace(ADMIN_FALLBACK_PATH);
    }
  }, [isAuthPage, isBrowserSessionChecked, router, status, userRole]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (status === "loading" || !isBrowserSessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 text-sm font-semibold text-slate-500">
        Memuat sesi...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!canAccessPath(userRole, router.pathname)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-slate-950 lg:flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
