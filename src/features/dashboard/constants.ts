import type { DashboardFilters, TierLabel } from "./types";

export const dashboardColors = {
  primaryGreen: "#1B5E20",
  secondaryGreen: "#2E7D32",
  lightGreen: "#4CAF50",
  background: "#E8F5E9",
  berlian: "#9C27B0",
  emas: "#FFD700",
  perak: "#C0C0C0",
  perunggu: "#CD7F32",
  merah: "#F44336",
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
