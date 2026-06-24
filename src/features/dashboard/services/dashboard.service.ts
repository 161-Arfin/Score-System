import { api } from "@/lib/api";
import type { AuthRole } from "@/features/auth/types";
import {
  dashboardStatisticEndpoint,
  defaultDashboardFilters,
} from "../constants";
import { mapDashboardStatisticResponse } from "../adapters/dashboard.adapter";
import { mockDashboardData } from "../mocks";
import type {
  DashboardData,
  DashboardFilters,
  FamilyScoreRow,
  TierLabel,
} from "../types";

const shouldUseMockDashboardData =
  process.env.NEXT_PUBLIC_USE_DASHBOARD_MOCK !== "false";

export type DashboardAccessScope = {
  role: AuthRole;
  instansiId?: string | null;
};

const tierOrder: TierLabel[] = [
  "Berlian",
  "Emas",
  "Perak",
  "Perunggu",
  "Merah",
];

function getUnitAliases(instansiId?: string | null) {
  if (!instansiId) {
    return [];
  }

  const normalized = instansiId.trim().toLowerCase();
  const numericUnitMap: Record<string, string> = {
    "1": "a",
    "2": "b",
    "3": "c",
    "4": "d",
  };
  const unitCode =
    numericUnitMap[normalized] ?? normalized.replace(/^unit-/, "");

  return [
    normalized,
    unitCode,
    unitCode.toUpperCase(),
    `unit-${unitCode}`,
    `Unit ${unitCode.toUpperCase()}`,
  ].map((item) => item.toLowerCase());
}

function isFamilyInUnit(row: FamilyScoreRow, aliases: string[]) {
  return aliases.includes(row.unitName.toLowerCase());
}

function getAverageScore(rows: FamilyScoreRow[]) {
  if (!rows.length) {
    return 0;
  }

  const total = rows.reduce((sum, row) => sum + row.score, 0);

  return Number((total / rows.length).toFixed(1));
}

function getTierPercentage(rows: FamilyScoreRow[], tier: TierLabel) {
  if (!rows.length) {
    return 0;
  }

  const tierTotal = rows.filter((row) => row.tier === tier).length;

  return Math.round((tierTotal / rows.length) * 100);
}

function getTierCount(rows: FamilyScoreRow[], tier: TierLabel) {
  return rows.filter((row) => row.tier === tier).length;
}

function applyDashboardAccessScope(
  data: DashboardData,
  scope?: DashboardAccessScope,
): DashboardData {
  if (!scope || scope.role === "superadmin") {
    return data;
  }

  const unitAliases = getUnitAliases(scope.instansiId);
  const familyScoreRows = data.familyScoreRows.filter((row) =>
    isFamilyInUnit(row, unitAliases),
  );
  const unitPerformanceRows = data.unitPerformanceRows.filter((row) =>
    unitAliases.includes(row.unitId.toLowerCase()) ||
    unitAliases.includes(row.unitName.toLowerCase()),
  );
  const averageScore = getAverageScore(familyScoreRows);

  return {
    ...data,
    stats: data.stats.map((stat) => {
      if (stat.key === "totalFamilies") {
        return { ...stat, value: String(familyScoreRows.length) };
      }

      if (stat.key === "averageScore") {
        return { ...stat, value: String(averageScore) };
      }

      if (stat.key === "berlian") {
        return { ...stat, value: String(getTierCount(familyScoreRows, "Berlian")) };
      }

      if (stat.key === "emas") {
        return { ...stat, value: String(getTierCount(familyScoreRows, "Emas")) };
      }

      if (stat.key === "perak") {
        return { ...stat, value: String(getTierCount(familyScoreRows, "Perak")) };
      }

      return stat;
    }),
    tierDistribution: tierOrder.map((tier) => ({
      tier,
      value: getTierPercentage(familyScoreRows, tier),
    })),
    unitPerformanceRows,
    familyScoreRows,
    filterOptions: data.filterOptions.map((filter) =>
      filter.label === "Unit BMT"
        ? {
            ...filter,
            value: unitPerformanceRows[0]?.unitName ?? scope.instansiId ?? "-",
          }
        : filter,
    ),
  };
}

function applyDashboardUnitFilter(
  data: DashboardData,
  filters: DashboardFilters,
): DashboardData {
  if (filters.unitId === "all") {
    return data;
  }

  const unitAliases = getUnitAliases(filters.unitId);
  const familyScoreRows = data.familyScoreRows.filter((row) =>
    isFamilyInUnit(row, unitAliases),
  );
  const unitPerformanceRows = data.unitPerformanceRows.filter((row) =>
    unitAliases.includes(row.unitId.toLowerCase()) ||
    unitAliases.includes(row.unitName.toLowerCase()),
  );
  const averageScore = getAverageScore(familyScoreRows);

  return {
    ...data,
    filters,
    stats: data.stats.map((stat) => {
      if (stat.key === "totalFamilies") {
        return { ...stat, value: String(familyScoreRows.length) };
      }

      if (stat.key === "averageScore") {
        return { ...stat, value: String(averageScore) };
      }

      if (stat.key === "berlian") {
        return { ...stat, value: String(getTierCount(familyScoreRows, "Berlian")) };
      }

      if (stat.key === "emas") {
        return { ...stat, value: String(getTierCount(familyScoreRows, "Emas")) };
      }

      if (stat.key === "perak") {
        return { ...stat, value: String(getTierCount(familyScoreRows, "Perak")) };
      }

      return stat;
    }),
    tierDistribution: tierOrder.map((tier) => ({
      tier,
      value: getTierPercentage(familyScoreRows, tier),
    })),
    unitPerformanceRows,
    familyScoreRows,
  };
}

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
  if (shouldUseMockDashboardData) {
    return applyDashboardAccessScope(
      applyDashboardUnitFilter({
        ...mockDashboardData,
        filters,
      }, filters),
      scope,
    );
  }

  const response = await api.get(dashboardStatisticEndpoint, {
    params: getStatisticParams(filters, scope),
  });
  const statisticData = mapDashboardStatisticResponse(response.data);

  return {
    ...mockDashboardData,
    ...statisticData,
    filters,
  };
}
