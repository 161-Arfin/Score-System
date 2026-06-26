import type {
  DashboardData,
  DashboardRiskSummary,
  FocusDimensionItem,
  MonthlyTrendItem,
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

type BackendQuarterScoreItem = {
  kuartal?: number;
  label?: string;
  periode?: string;
  avg_score?: number;
  total_keluarga?: number;
};

type BackendQuarterScoreResponse = {
  year?: number;
  data?: BackendQuarterScoreItem[];
};

type BackendLowScoreDimensionItem = {
  id?: number;
  dimensi_name?: string;
  total_keluarga?: number;
};

type BackendLowScoreDimensionResponse = {
  data?: BackendLowScoreDimensionItem[];
};

type BackendTierRiskItem = {
  id_tier?: number;
  tier_name?: string;
  total_keluarga?: number;
};

type BackendTierRiskResponse = {
  data?: BackendTierRiskItem[];
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

export function mapQuarterScoreResponse(response: unknown): MonthlyTrendItem[] {
  const data = getResponseData<BackendQuarterScoreResponse>(response);
  const year = data.year ?? new Date().getFullYear();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
  const items = Array.isArray(data.data) ? data.data : [];

  return items
    .map((item) => {
      const quarter = toNumber(item.kuartal);
      const label = item.label ?? `Kuartal ${quarter}`;

      return {
        month: `${year}-Q${quarter}`,
        label,
        quarter,
        period: item.periode,
        value: toNumber(item.avg_score),
        totalFamilies: toNumber(item.total_keluarga),
      };
    })
    .filter((item) => {
      if (item.quarter < 1 || item.quarter > 4) {
        return false;
      }

      if (year < currentYear) {
        return true;
      }

      if (year > currentYear) {
        return false;
      }

      return item.quarter <= currentQuarter;
    });
}

export function mapLowScoreDimensionResponse(
  response: unknown,
): FocusDimensionItem[] {
  const data = getResponseData<BackendLowScoreDimensionResponse>(response);
  const items = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

  return items
    .map((item) => ({
      label: item.dimensi_name ?? "-",
      value: toNumber(item.total_keluarga),
    }))
    .filter((item) => item.label !== "-");
}

export function mapTierRiskResponse(response: unknown): DashboardRiskSummary {
  const data = getResponseData<BackendTierRiskResponse>(response);
  const items = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
  const getTierTotal = (tierName: string) => {
    const item = items.find(
      (current) => current.tier_name?.toLowerCase() === tierName,
    );

    return toNumber(item?.total_keluarga);
  };
  const redTotal = getTierTotal("merah");
  const bronzeTotal = getTierTotal("perunggu");

  return {
    bronzeTotal,
    redTotal,
    riskTotal: bronzeTotal + redTotal,
  };
}
