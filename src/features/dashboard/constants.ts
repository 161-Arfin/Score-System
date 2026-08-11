import type { DashboardFilters, TierLabel } from "./types";

export const dashboardColors = {
  primaryGreen: "#3E9E9E",
  secondaryGreen: "#2F7F80",
  lightGreen: "#A8D414",
  background: "#EEF9F8",
  berlian: "#009FE3",
  emas: "#A8D414",
  perak: "#9CA3AF",
  perunggu: "#F58213",
  merah: "#EF4444",
};

export const tierColorMap: Record<TierLabel, string> = {
  Berlian: dashboardColors.berlian,
  Emas: dashboardColors.emas,
  Perak: dashboardColors.perak,
  Perunggu: dashboardColors.perunggu,
  Merah: dashboardColors.merah,
};

export const defaultDashboardFilters: DashboardFilters = {
  unitId: "all",
  tier: "all",
  date: "2026-04",
};

export const dashboardEndpoint = "/dashboard";
export const dashboardStatisticEndpoint = "/v1/auth/statistik";
export const dashboardQuarterScoreEndpoint = "/v1/auth/statistik/score-kuartal";
export const dashboardLowScoreDimensionEndpoint =
  "/v1/auth/statistik/low-score-dimensi";
export const dashboardTierRiskEndpoint =
  "/v1/auth/statistik/tier-perunggu-merah";
