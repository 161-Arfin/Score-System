import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isAuthPage = router.pathname.startsWith("/auth");
  const userRole = normalizeUserRole(session?.user?.role);

  useEffect(() => {
    if (!router.isReady || isAuthPage) {
      return;
    }

    if (!canAccessPath(userRole, router.pathname)) {
      router.replace(ADMIN_FALLBACK_PATH);
    }
  }, [isAuthPage, router, userRole]);

  if (isAuthPage) {
    return <>{children}</>;
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
