import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Footer from "@/views/containers/templates/Footer";
import Navbar from "@/views/containers/templates/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
