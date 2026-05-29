import { api } from "@/lib/api";
import { dashboardEndpoint, defaultDashboardFilters } from "../constants";
import { mapDashboardResponse } from "../adapters/dashboard.adapter";
import { mockDashboardData } from "../mocks";
import type { DashboardData, DashboardFilters } from "../types";

const shouldUseMockDashboardData =
  process.env.NEXT_PUBLIC_USE_DASHBOARD_MOCK !== "false";

export async function getDashboardData(
  filters: DashboardFilters = defaultDashboardFilters
): Promise<DashboardData> {
  if (shouldUseMockDashboardData) {
    return {
      ...mockDashboardData,
      filters,
    };
  }

  const response = await api.get(dashboardEndpoint, {
    params: filters,
  });

  return mapDashboardResponse(response.data);
}
