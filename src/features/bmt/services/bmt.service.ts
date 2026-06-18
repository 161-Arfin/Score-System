import { api } from "@/lib/api";
import { bmtEndpoint, defaultBmtFilters } from "../constants";
import {
  mapUnitBmtListResponse,
  mapUnitBmtResponse,
} from "../adapters/bmt.adapter";
import { mockUnitBmtRows } from "../mocks";
import type {
  UnitBmt,
  UnitBmtFilters,
  UnitBmtListResponse,
  UnitBmtPayload,
} from "../types";

let mockRows = [...mockUnitBmtRows];

const shouldUseMockBmtData = process.env.NEXT_PUBLIC_USE_BMT_MOCK !== "false";

function filterRows(filters: UnitBmtFilters) {
  const keyword = filters.search.trim().toLowerCase();

  return mockRows.filter((row) => {
    const matchesKeyword =
      !keyword ||
      [row.instansi_name, row.instansi_address, row.instansi_phone]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

    return matchesKeyword && !row.is_delete_instansi;
  });
}

export async function getUnitBmtList(
  filters: UnitBmtFilters = defaultBmtFilters,
): Promise<UnitBmtListResponse> {
  if (shouldUseMockBmtData) {
    const data = filterRows(filters);

    return {
      data,
      total: data.length,
    };
  }

  const response = await api.get(bmtEndpoint, {
    params: filters,
  });

  return mapUnitBmtListResponse(response.data);
}

export async function getDeletedUnitBmtList(): Promise<UnitBmtListResponse> {
  if (shouldUseMockBmtData) {
    const data = mockRows.filter((row) => row.is_delete_instansi);

    return {
      data,
      total: data.length,
    };
  }

  const response = await api.get(`${bmtEndpoint}/recycle-bin`);

  return mapUnitBmtListResponse(response.data);
}

export async function getUnitBmtById(id: string): Promise<UnitBmt> {
  if (shouldUseMockBmtData) {
    const row = mockRows.find((item) => item.id === id);

    if (!row) {
      throw new Error("Unit BMT tidak ditemukan.");
    }

    return row;
  }

  const response = await api.get(`${bmtEndpoint}/${id}`);

  return mapUnitBmtResponse(response.data.data);
}

export async function createUnitBmt(payload: UnitBmtPayload): Promise<UnitBmt> {
  if (shouldUseMockBmtData) {
    const row: UnitBmt = {
      ...payload,
      id: `bmt-${Date.now()}`,
      is_delete_instansi: false,
      created_at: new Date().toISOString(),
      created_by: "Unknown",
    };

    mockRows = [row, ...mockRows];
    return row;
  }

  const response = await api.post(bmtEndpoint, payload);

  return mapUnitBmtResponse(response.data);
}

export async function updateUnitBmt(
  id: string,
  payload: UnitBmtPayload,
): Promise<UnitBmt> {
  if (shouldUseMockBmtData) {
    const current = await getUnitBmtById(id);
    const nextRow = {
      ...current,
      ...payload,
      created_at: new Date().toISOString(),
    };

    mockRows = mockRows.map((row) => (row.id === id ? nextRow : row));
    return nextRow;
  }

  const response = await api.put(`${bmtEndpoint}/${id}`, payload);

  return mapUnitBmtResponse(response.data);
}

export async function deleteUnitBmt(id: string): Promise<void> {
  if (shouldUseMockBmtData) {
    mockRows = mockRows.map((row) =>
      row.id === id ? { ...row, is_delete_instansi: true } : row,
    );
    return;
  }

  await api.delete(`${bmtEndpoint}/softdelete/${id}`);
}

export async function restoreUnitBmt(id: string): Promise<void> {
  if (shouldUseMockBmtData) {
    mockRows = mockRows.map((row) =>
      row.id === id ? { ...row, is_delete_instansi: false } : row,
    );
    return;
  }

  await api.patch(`${bmtEndpoint}/${id}`, {
    is_delete_instansi: false,
  });
}

export async function permanentDeleteUnitBmt(id: string): Promise<void> {
  if (shouldUseMockBmtData) {
    mockRows = mockRows.filter((row) => row.id !== id);
    return;
  }

  await api.delete(`${bmtEndpoint}/${id}`);
}
