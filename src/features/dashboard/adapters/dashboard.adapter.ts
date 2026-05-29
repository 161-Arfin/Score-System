import { mockDashboardData } from "../mocks";
import type {
  DashboardData,
  DashboardFilterOption,
  DashboardFilters,
  DashboardStat,
  DimensionScoreItem,
  FamilyScoreRow,
  FocusDimensionItem,
  MonthlyTrendItem,
  TierDistributionItem,
  TierLabel,
  UnitPerformanceRow,
} from "../types";

type BackendDashboardResponse = Partial<{
  stats: DashboardStat[];
  summary: DashboardStat[];
  tierDistribution: TierDistributionItem[];
  tiers: TierDistributionItem[];
  dimensionScores: DimensionScoreItem[];
  dimensions: DimensionScoreItem[];
  monthlyTrend: MonthlyTrendItem[];
  trends: MonthlyTrendItem[];
  unitPerformanceRows: UnitPerformanceRow[];
  units: UnitPerformanceRow[];
  familyScoreRows: FamilyScoreRow[];
  families: FamilyScoreRow[];
  focusDimensions: FocusDimensionItem[];
  focus: FocusDimensionItem[];
  filters: DashboardFilters;
  filterOptions: DashboardFilterOption[];
  updatedAt: string;
  updated_at: string;
}>;

const normalizeTierDistribution = (
  items: TierDistributionItem[] | undefined
) => {
  return items?.map((item) => ({
    tier: item.tier as TierLabel,
    value: Number(item.value),
  }));
};

export function mapDashboardResponse(
  response: BackendDashboardResponse
): DashboardData {
  return {
    stats: response.stats ?? response.summary ?? mockDashboardData.stats,
    tierDistribution:
      normalizeTierDistribution(
        response.tierDistribution ?? response.tiers
      ) ?? mockDashboardData.tierDistribution,
    dimensionScores:
      response.dimensionScores ??
      response.dimensions ??
      mockDashboardData.dimensionScores,
    monthlyTrend:
      response.monthlyTrend ?? response.trends ?? mockDashboardData.monthlyTrend,
    unitPerformanceRows:
      response.unitPerformanceRows ??
      response.units ??
      mockDashboardData.unitPerformanceRows,
    familyScoreRows:
      response.familyScoreRows ??
      response.families ??
      mockDashboardData.familyScoreRows,
    focusDimensions:
      response.focusDimensions ??
      response.focus ??
      mockDashboardData.focusDimensions,
    filters: response.filters ?? mockDashboardData.filters,
    filterOptions: response.filterOptions ?? mockDashboardData.filterOptions,
    updatedAt:
      response.updatedAt ??
      response.updated_at ??
      mockDashboardData.updatedAt,
  };
}
