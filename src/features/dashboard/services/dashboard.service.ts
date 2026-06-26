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

export async function getDashboardData(
  filters: DashboardFilters = defaultDashboardFilters,
  scope?: DashboardAccessScope,
): Promise<DashboardData> {
  const response = await api.get(dashboardStatisticEndpoint, {
    params: getStatisticParams(filters, scope),
  });
  const statisticData = mapDashboardStatisticResponse(response.data);
  const [
    quarterScoreResponse,
    lowScoreDimensionResponse,
    tierRiskResponse,
  ] =
    scope?.role === "superadmin"
      ? await Promise.allSettled([
          api.get(dashboardQuarterScoreEndpoint),
          api.get(dashboardLowScoreDimensionEndpoint),
          api.get(dashboardTierRiskEndpoint),
        ])
      : [null, null, null];
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
