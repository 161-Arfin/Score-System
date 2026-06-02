import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/views/containers/templates/Navbar";
import Sidebar from "@/views/containers/templates/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isAuthPage = router.pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
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
