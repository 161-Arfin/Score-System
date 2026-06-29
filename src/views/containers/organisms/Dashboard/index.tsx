import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { getUnitBmtList } from "@/features/bmt/services/bmt.service";
import { defaultDashboardFilters } from "@/features/dashboard/constants";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import type {
  DashboardData,
  DashboardFilters as DashboardFilterValues,
} from "@/features/dashboard/types";
import { normalizeUserRole } from "@/lib/auth/permissions";
import BottomInsightPanel from "@/views/components/molecules/Dashboard/BottomInsightPanel";
import DashboardFilters from "@/views/components/molecules/Dashboard/DashboardFilters";
import DashboardSummary from "@/views/components/molecules/Dashboard/DashboardSummary";
import DimensionScoreChart from "@/views/components/molecules/Dashboard/DimensionScoreChart";
import MonthlyTrendChart from "@/views/components/molecules/Dashboard/MonthlyTrendChart";
import TierDistribution from "@/views/components/molecules/Dashboard/TierDistribution";

function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100",
        className,
      ].join(" ")}
      style={style}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-label="Memuat dashboard">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div className="w-full max-w-2xl">
          <SkeletonBlock className="h-9 w-72 max-w-full" />
          <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
          <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-lg" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="mt-4 h-8 w-20" />
                <SkeletonBlock className="mt-3 h-3 w-32" />
              </div>
              <SkeletonBlock className="h-11 w-11 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <SkeletonBlock className="h-3 w-28" />
              <SkeletonBlock className="mt-3 h-5 w-56 max-w-full" />
            </div>
            <SkeletonBlock className="h-7 w-24 rounded-full" />
          </div>
          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[160px_1fr]">
            <SkeletonBlock className="mx-auto h-36 w-36 rounded-full" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-3 w-3 rounded-full" />
                    <SkeletonBlock className="h-4 w-24" />
                  </div>
                  <SkeletonBlock className="h-4 w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="mt-3 h-5 w-56 max-w-full" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[120px_1fr_40px] items-center gap-3">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-3 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <SkeletonBlock className="h-3 w-48" />
            <SkeletonBlock className="mt-3 h-5 w-56 max-w-full" />
          </div>
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>
        <div className="mt-5 h-64 overflow-hidden rounded-lg bg-slate-50 p-6">
          <div className="flex h-full items-end gap-8">
            {[45, 70, 52, 88, 64, 76, 58].map((height, index) => (
              <SkeletonBlock
                key={index}
                className="w-full rounded-t-lg"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="mt-3 h-5 w-60 max-w-full" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div key={itemIndex} className="space-y-2">
                  <div className="flex justify-between">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-4 w-10" />
                  </div>
                  <SkeletonBlock className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session } = useSession();
  const userRole = normalizeUserRole(session?.user?.role);
  const isSuperAdmin = session?.user?.role === "superadmin";
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [selectedUnitId, setSelectedUnitId] = useState("all");
  const [unitFilterOptions, setUnitFilterOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUnitFilterOptions() {
      if (!isSuperAdmin) {
        setUnitFilterOptions([]);
        return;
      }

      try {
        const response = await getUnitBmtList();

        if (isMounted) {
          setUnitFilterOptions(
            response.data
              .filter((unit) => !unit.is_delete_instansi)
              .map((unit) => ({
                label: unit.instansi_name,
                value: unit.id,
              })),
          );
        }
      } catch {
        if (isMounted) {
          setUnitFilterOptions([]);
        }
      }
    }

    loadUnitFilterOptions();

    return () => {
      isMounted = false;
    };
  }, [isSuperAdmin]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const filters: DashboardFilterValues = {
          ...defaultDashboardFilters,
          unitId: selectedUnitId,
        };
        const data = await getDashboardData(filters, {
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
  }, [isSuperAdmin, selectedUnitId, session?.user?.instansi_id, userRole]);

  const riskSummary = useMemo(() => {
    if (dashboardData?.riskSummary) {
      return dashboardData.riskSummary;
    }

    const bronzeTotal =
      dashboardData?.familyScoreRows.filter((row) => row.tier === "Perunggu")
        .length ?? 0;
    const redTotal =
      dashboardData?.familyScoreRows.filter((row) => row.tier === "Merah")
        .length ?? 0;

    return {
      bronzeTotal,
      redTotal,
      riskTotal: bronzeTotal + redTotal,
    };
  }, [dashboardData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (errorMessage || !dashboardData) {
    return (
      <div className="rounded-lg border border-[#F44336]/25 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#C62828]">{errorMessage}</p>
        <p className="mt-2 text-sm text-slate-500">
          Cek konfigurasi API dashboard atau status koneksi backend.
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

      {isSuperAdmin ? (
        <DashboardFilters
          selectedUnitId={selectedUnitId}
          unitOptions={unitFilterOptions}
          onUnitChange={setSelectedUnitId}
        />
      ) : null}

      <DashboardSummary stats={dashboardData.stats} />

      <div className="grid gap-5 xl:grid-cols-2">
        <TierDistribution items={dashboardData.tierDistribution} />
        <DimensionScoreChart scores={dashboardData.dimensionScores} />
      </div>

      <MonthlyTrendChart trends={dashboardData.monthlyTrend} />
      <BottomInsightPanel
        bronzeTotal={riskSummary.bronzeTotal}
        focusDimensions={dashboardData.focusDimensions}
        redTotal={riskSummary.redTotal}
        riskTotal={riskSummary.riskTotal}
      />
    </div>
  );
}
