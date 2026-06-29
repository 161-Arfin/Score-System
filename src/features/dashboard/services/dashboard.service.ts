import { api } from "@/lib/api";
import type { AuthRole } from "@/features/auth/types";
import {
  dashboardLowScoreDimensionEndpoint,
  dashboardQuarterScoreEndpoint,
  dashboardStatisticEndpoint,
  dashboardTierRiskEndpoint,
  defaultDashboardFilters,
} from "../constants";
import {
  mapDashboardStatisticResponse,
  mapLowScoreDimensionResponse,
  mapQuarterScoreResponse,
  mapTierRiskResponse,
} from "../adapters/dashboard.adapter";
import type {
  DashboardData,
  DashboardFilters,
} from "../types";

export type DashboardAccessScope = {
  role: AuthRole;
  instansiId?: string | null;
};

const emptyDashboardData: DashboardData = {
  stats: [],
  tierDistribution: [],
  dimensionScores: [],
  monthlyTrend: [],
  unitPerformanceRows: [],
  familyScoreRows: [],
  focusDimensions: [],
  filters: defaultDashboardFilters,
  filterOptions: [],
  updatedAt: "",
};

function getStatisticParams(
  filters: DashboardFilters,
  scope?: DashboardAccessScope,
) {
  const params: Record<string, string> = {};

  if (scope?.role === "user" && scope.instansiId) {
    params.instansi_id = scope.instansiId;
  }

  if (scope?.role === "superadmin" && filters.unitId !== "all") {
    params.instansi_id = filters.unitId;
  }

  return params;
}

function getSelectedYear(filters: DashboardFilters) {
  const year = filters.date.split("-")[0];

  return year || String(new Date().getFullYear());
}

function getQuarterScoreParams(
  filters: DashboardFilters,
  scope?: DashboardAccessScope,
) {
  return {
    ...getStatisticParams(filters, scope),
    year: getSelectedYear(filters),
  };
}

export async function getDashboardData(
  filters: DashboardFilters = defaultDashboardFilters,
  scope?: DashboardAccessScope,
): Promise<DashboardData> {
  const response = await api.get(dashboardStatisticEndpoint, {
    params: getStatisticParams(filters, scope),
  });
  const statisticData = mapDashboardStatisticResponse(response.data);
  const [quarterScoreResponse, lowScoreDimensionResponse, tierRiskResponse] =
    await Promise.allSettled([
      api.get(dashboardQuarterScoreEndpoint, {
        params: getQuarterScoreParams(filters, scope),
      }),
      api.get(dashboardLowScoreDimensionEndpoint, {
        params: getStatisticParams(filters, scope),
      }),
      api.get(dashboardTierRiskEndpoint, {
        params: getStatisticParams(filters, scope),
      }),
    ]);
  const monthlyTrend =
    quarterScoreResponse?.status === "fulfilled"
      ? mapQuarterScoreResponse(quarterScoreResponse.value.data)
      : [];
  const focusDimensions =
    lowScoreDimensionResponse?.status === "fulfilled"
      ? mapLowScoreDimensionResponse(lowScoreDimensionResponse.value.data)
      : [];
  const riskSummary =
    tierRiskResponse?.status === "fulfilled"
      ? mapTierRiskResponse(tierRiskResponse.value.data)
    : undefined;

  return {
    ...emptyDashboardData,
    ...statisticData,
    monthlyTrend,
    focusDimensions,
    riskSummary,
    filters,
  };
}
