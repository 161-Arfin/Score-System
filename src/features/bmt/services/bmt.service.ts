import { api } from "@/lib/api";
import { bmtEndpoint, defaultBmtFilters, publicBmtEndpoint } from "../constants";
import {
  mapUnitBmtListResponse,
  mapUnitBmtResponse,
} from "../adapters/bmt.adapter";
import type {
  UnitBmt,
  UnitBmtFilters,
  UnitBmtListResponse,
  UnitBmtPayload,
} from "../types";

function getRowTimestamp(row: UnitBmt) {
  const timestamp = new Date(row.created_at).getTime();

  if (Number.isFinite(timestamp)) {
    return timestamp;
  }

  return Number(row.id) || 0;
}

function sortNewestRows(rows: UnitBmt[]) {
  return [...rows].sort((first, second) => {
    return getRowTimestamp(second) - getRowTimestamp(first);
  });
}

function getUnitBmtParams(filters: UnitBmtFilters) {
  const params: Partial<UnitBmtFilters> = {};
  const search = filters.search?.trim();

  if (search) {
    params.search = search;
  }

  return params;
}

export async function getUnitBmtList(
  filters: UnitBmtFilters = defaultBmtFilters,
): Promise<UnitBmtListResponse> {
  try {
    const response = await api.get(bmtEndpoint, {
      params: getUnitBmtParams(filters),
    });

    const result = mapUnitBmtListResponse(response.data);

    return {
      ...result,
      data: sortNewestRows(result.data),
    };
  } catch {
    return getPublicUnitBmtList();
  }
}

export async function getPublicUnitBmtList(): Promise<UnitBmtListResponse> {
  const response = await api.get(publicBmtEndpoint);

  return mapUnitBmtListResponse(response.data);
}

export async function getDeletedUnitBmtList(): Promise<UnitBmtListResponse> {
  const response = await api.get(`${bmtEndpoint}/recycle-bin`);

  const result = mapUnitBmtListResponse(response.data);

  return {
    ...result,
    data: sortNewestRows(result.data),
  };
}

export async function getUnitBmtById(id: string): Promise<UnitBmt> {
  const response = await api.get(`${bmtEndpoint}/${id}`);

  return mapUnitBmtResponse(response.data.data);
}

export async function createUnitBmt(payload: UnitBmtPayload): Promise<UnitBmt> {
  const response = await api.post(bmtEndpoint, payload);

  return mapUnitBmtResponse(response.data);
}

export async function updateUnitBmt(
  id: string,
  payload: UnitBmtPayload,
): Promise<UnitBmt> {
  const response = await api.put(`${bmtEndpoint}/${id}`, payload);

  return mapUnitBmtResponse(response.data);
}

export async function deleteUnitBmt(id: string): Promise<void> {
  await api.delete(`${bmtEndpoint}/softdelete/${id}`);
}

export async function restoreUnitBmt(id: string): Promise<void> {
  await api.patch(`${bmtEndpoint}/${id}`, {
    is_delete_instansi: false,
  });
}

export async function permanentDeleteUnitBmt(id: string): Promise<void> {
  await api.delete(`${bmtEndpoint}/${id}`);
}
