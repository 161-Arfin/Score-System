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

type BackendDashboardStatistic = {
  total_keluarga?: number;
  avg_score?: number;
  total_tier_berlian?: number;
  total_tier_emas?: number;
  total_tier_perak?: number;
  total_tier_perunggu?: number;
  total_tier_merah?: number;
  percen_berlian?: number;
  percen_emas?: number;
  percen_perak?: number;
  percen_perunggu?: number;
  percen_merah?: number;
  avg_addin_score?: number;
  avg_annasl_score?: number;
  avg_almal_score?: number;
  avg_annafs_score?: number;
  avg_alaql_score?: number;
};

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
  items: TierDistributionItem[] | undefined,
) => {
  return items?.map((item) => ({
    tier: item.tier as TierLabel,
    value: Number(item.value),
  }));
};

function getResponseData<T>(response: unknown): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as { data: T }).data;
  }

  return response as T;
}

function formatScore(value: unknown) {
  const score = Number(value ?? 0);

  if (!Number.isFinite(score)) {
    return "0";
  }

  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function toNumber(value: unknown) {
  const numberValue = Number(value ?? 0);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function mapDashboardStatisticResponse(
  response: unknown,
): Partial<DashboardData> {
  const data = getResponseData<BackendDashboardStatistic>(response);

  return {
    stats: [
      {
        key: "totalFamilies",
        label: "Total Keluarga",
        value: String(toNumber(data.total_keluarga)),
        caption: "Keluarga aktif",
        iconKey: "families",
      },
      {
        key: "averageScore",
        label: "Avg Score",
        value: formatScore(data.avg_score),
        caption: "Rata-rata umum",
        iconKey: "average",
      },
      {
        key: "berlian",
        label: "Berlian",
        value: String(toNumber(data.total_tier_berlian)),
        caption: "Tier tertinggi",
        iconKey: "berlian",
      },
      {
        key: "emas",
        label: "Emas",
        value: String(toNumber(data.total_tier_emas)),
        caption: "Stabil bertumbuh",
        iconKey: "emas",
      },
      {
        key: "perak",
        label: "Perak",
        value: String(toNumber(data.total_tier_perak)),
        caption: "Butuh penguatan",
        iconKey: "perak",
      },
    ],
    tierDistribution: [
      { tier: "Berlian", value: toNumber(data.percen_berlian) },
      { tier: "Emas", value: toNumber(data.percen_emas) },
      { tier: "Perak", value: toNumber(data.percen_perak) },
      { tier: "Perunggu", value: toNumber(data.percen_perunggu) },
      { tier: "Merah", value: toNumber(data.percen_merah) },
    ],
    dimensionScores: [
      { label: "Ad-Din", value: toNumber(data.avg_addin_score) },
      { label: "An-Nasl", value: toNumber(data.avg_annasl_score) },
      { label: "Al-Mal", value: toNumber(data.avg_almal_score) },
      { label: "An-Nafs", value: toNumber(data.avg_annafs_score) },
      { label: "Al-Aql", value: toNumber(data.avg_alaql_score) },
    ],
  };
}
