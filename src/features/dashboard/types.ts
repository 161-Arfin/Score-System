export type TierLabel = "Berlian" | "Emas" | "Perak" | "Perunggu" | "Merah";

export type DashboardStatIconKey =
  | "families"
  | "average"
  | "berlian"
  | "emas"
  | "perak";

export type DashboardStat = {
  key: string;
  label: string;
  value: string;
  caption: string;
  iconKey: DashboardStatIconKey;
};

export type TierDistributionItem = {
  tier: TierLabel;
  value: number;
};

export type DimensionScoreItem = {
  label: string;
  value: number;
};

export type MonthlyTrendItem = {
  month: string;
  label: string;
  value: number;
};

export type UnitPerformanceRow = {
  unitId: string;
  unitName: string;
  families: number;
  average: number;
  religion: number;
  economy: number;
};

export type FamilyScoreRow = {
  id: string;
  name: string;
  unitName: string;
  date: string;
  score: number;
  tier: TierLabel;
  adDin: number;
  alMal: number;
};

export type FocusDimensionItem = {
  label: string;
  value: number;
};

export type DashboardFilters = {
  unitId: string;
  tier: "all" | TierLabel;
  date: string;
};

export type DashboardFilterOption = {
  label: string;
  value: string;
};

export type DashboardData = {
  stats: DashboardStat[];
  tierDistribution: TierDistributionItem[];
  dimensionScores: DimensionScoreItem[];
  monthlyTrend: MonthlyTrendItem[];
  unitPerformanceRows: UnitPerformanceRow[];
  familyScoreRows: FamilyScoreRow[];
  focusDimensions: FocusDimensionItem[];
  filters: DashboardFilters;
  filterOptions: DashboardFilterOption[];
  updatedAt: string;
};
