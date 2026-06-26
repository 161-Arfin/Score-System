import { api } from "@/lib/api";
// import { getUnitBmtList } from "@/features/bmt/services/bmt.service";
import { anggotaBmtEndpoint } from "../constants";
import {
  mapAnggotaBmtListResponse,
  mapAnggotaBmtResponse,
} from "../adapters/anggota-bmt.adapter";
import type {
  AnggotaBmt,
  AnggotaBmtListResponse,
  AnggotaBmtPayload,
} from "../types";

function getRowTimestamp(row: AnggotaBmt) {
  const timestamp = new Date(row.created_at).getTime();

  if (Number.isFinite(timestamp)) {
    return timestamp;
  }

  return Number(row.id) || 0;
}

function sortNewestRows(rows: AnggotaBmt[]) {
  return [...rows].sort((first, second) => {
    return getRowTimestamp(second) - getRowTimestamp(first);
  });
}

export async function getAnggotaBmtList(): Promise<AnggotaBmtListResponse> {
  const response = await api.get(anggotaBmtEndpoint);

  const result = mapAnggotaBmtListResponse(response.data);

  return {
    ...result,
    data: sortNewestRows(result.data),
  };
}

export async function getDeletedAnggotaBmtList(): Promise<AnggotaBmtListResponse> {
  const response = await api.get(`${anggotaBmtEndpoint}/recycle-bin`);

  const result = mapAnggotaBmtListResponse(response.data);

  return {
    ...result,
    data: sortNewestRows(result.data),
  };
}

export async function getAnggotaBmtById(id: string): Promise<AnggotaBmt> {
  const response = await api.get(`${anggotaBmtEndpoint}/${id}`);

  return mapAnggotaBmtResponse(response.data.data);
}

export async function createAnggotaBmt(
  payload: AnggotaBmtPayload,
): Promise<AnggotaBmt> {
  const response = await api.post(anggotaBmtEndpoint, payload);

  return mapAnggotaBmtResponse(response.data);
}

export async function updateAnggotaBmt(
  id: string,
  payload: AnggotaBmtPayload,
): Promise<AnggotaBmt> {
  const response = await api.put(`${anggotaBmtEndpoint}/${id}`, payload);

  return mapAnggotaBmtResponse(response.data);
}

export async function deleteAnggotaBmt(id: string): Promise<void> {
  await api.delete(`${anggotaBmtEndpoint}/softdelete/${id}`);
}

export async function restoreAnggotaBmt(id: string): Promise<void> {
  await api.patch(`${anggotaBmtEndpoint}/${id}`, {
    is_delete_keluarga: false,
  });
}

export async function permanentDeleteAnggotaBmt(id: string): Promise<void> {
  await api.delete(`${anggotaBmtEndpoint}/${id}`);
}
