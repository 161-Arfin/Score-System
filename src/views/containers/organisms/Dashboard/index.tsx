import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { defaultDashboardFilters } from "@/features/dashboard/constants";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import type { DashboardData } from "@/features/dashboard/types";
import { normalizeUserRole } from "@/lib/auth/permissions";
import BottomInsightPanel from "@/views/components/molecules/Dashboard/BottomInsightPanel";
import DashboardFilters from "@/views/components/molecules/Dashboard/DashboardFilters";
import DashboardSummary from "@/views/components/molecules/Dashboard/DashboardSummary";
import DimensionScoreChart from "@/views/components/molecules/Dashboard/DimensionScoreChart";
import FamilyScoreTable from "@/views/components/molecules/Dashboard/FamilyScoreTable";
import MonthlyTrendChart from "@/views/components/molecules/Dashboard/MonthlyTrendChart";
import TierDistribution from "@/views/components/molecules/Dashboard/TierDistribution";
import UnitPerformanceTable from "@/views/components/molecules/Dashboard/UnitPerformanceTable";

export default function Dashboard() {
  const { data: session } = useSession();
  const userRole = normalizeUserRole(session?.user?.role);
  const isSuperAdmin = userRole === "superadmin";
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getDashboardData(defaultDashboardFilters, {
          role: userRole,
          instansiId: session?.user?.instansi_id,
        });

        if (isMounted) {
          setDashboardData(data);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Data dashboard belum bisa dimuat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.instansi_id, userRole]);

  const riskSummary = useMemo(() => {
    const bronzeTotal = dashboardData?.familyScoreRows.filter(
      (row) => row.tier === "Perunggu"
    ).length ?? 0;
    const redTotal = dashboardData?.familyScoreRows.filter(
      (row) => row.tier === "Merah"
    ).length ?? 0;

    return {
      bronzeTotal,
      redTotal,
      riskTotal: bronzeTotal + redTotal,
    };
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-950">
          Memuat dashboard...
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Mengambil data ringkasan score keluarga.
        </p>
      </div>
    );
  }

  if (errorMessage || !dashboardData) {
    return (
      <div className="rounded-lg border border-[#F44336]/25 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#C62828]">{errorMessage}</p>
        <p className="mt-2 text-sm text-slate-500">
          Cek konfigurasi API dashboard atau aktifkan mock data sementara.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mt-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Sakinah Score Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {isSuperAdmin
                ? "Monitoring score keluarga binaan, performa unit BMT, dan dimensi pendampingan prioritas."
                : "Monitoring score keluarga binaan dan dimensi pendampingan prioritas pada unit BMT Anda."}
            </p>
          </div>
        </div>
      </div>

      <DashboardSummary stats={dashboardData.stats} />

      <div className="grid gap-5 xl:grid-cols-2">
        <TierDistribution items={dashboardData.tierDistribution} />
        <DimensionScoreChart scores={dashboardData.dimensionScores} />
      </div>

      <MonthlyTrendChart trends={dashboardData.monthlyTrend} />
      {isSuperAdmin ? (
        <>
          <UnitPerformanceTable rows={dashboardData.unitPerformanceRows} />
          <DashboardFilters filters={dashboardData.filterOptions} />
        </>
      ) : null}
      <FamilyScoreTable rows={dashboardData.familyScoreRows} />
      <BottomInsightPanel
        bronzeTotal={riskSummary.bronzeTotal}
        focusDimensions={dashboardData.focusDimensions}
        redTotal={riskSummary.redTotal}
        riskTotal={riskSummary.riskTotal}
      />
    </div>
  );
}
