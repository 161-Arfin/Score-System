import { api } from "@/lib/api";
// import { getUnitBmtList } from "@/features/bmt/services/bmt.service";
import { anggotaBmtEndpoint } from "../constants";
import {
  mapAnggotaBmtListResponse,
  mapAnggotaBmtResponse,
} from "../adapters/anggota-bmt.adapter";
import { mockAnggotaBmtRows } from "../mocks";
import type {
  AnggotaBmt,
  AnggotaBmtListResponse,
  AnggotaBmtPayload,
} from "../types";

let mockRows = [...mockAnggotaBmtRows];

const shouldUseMockAnggotaBmtData =
  process.env.NEXT_PUBLIC_USE_ANGGOTA_BMT_MOCK !== "false";

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
  if (shouldUseMockAnggotaBmtData) {
    const data = sortNewestRows(
      mockRows.filter((row) => !row.is_delete_keluarga),
    );

    return {
      data,
      total: data.length,
    };
  }

  const response = await api.get(anggotaBmtEndpoint);

  const result = mapAnggotaBmtListResponse(response.data);

  return {
    ...result,
    data: sortNewestRows(result.data),
  };
}

export async function getDeletedAnggotaBmtList(): Promise<AnggotaBmtListResponse> {
  if (shouldUseMockAnggotaBmtData) {
    const data = sortNewestRows(
      mockRows.filter((row) => row.is_delete_keluarga),
    );

    return {
      data,
      total: data.length,
    };
  }

  const response = await api.get(`${anggotaBmtEndpoint}/recycle-bin`);

  const result = mapAnggotaBmtListResponse(response.data);

  return {
    ...result,
    data: sortNewestRows(result.data),
  };
}

export async function getAnggotaBmtById(id: string): Promise<AnggotaBmt> {
  if (shouldUseMockAnggotaBmtData) {
    const row = mockRows.find((item) => item.id === id);

    if (!row) {
      throw new Error("Anggota BMT tidak ditemukan.");
    }

    return row;
  }

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
  if (shouldUseMockAnggotaBmtData) {
    mockRows = mockRows.map((row) =>
      row.id === id ? { ...row, is_delete_keluarga: true } : row,
    );
    return;
  }

  await api.delete(`${anggotaBmtEndpoint}/softdelete/${id}`);
}

export async function restoreAnggotaBmt(id: string): Promise<void> {
  if (shouldUseMockAnggotaBmtData) {
    mockRows = mockRows.map((row) =>
      row.id === id ? { ...row, is_delete_keluarga: false } : row,
    );
    return;
  }

  await api.patch(`${anggotaBmtEndpoint}/${id}`, {
    is_delete_keluarga: false,
  });
}

export async function permanentDeleteAnggotaBmt(id: string): Promise<void> {
  if (shouldUseMockAnggotaBmtData) {
    mockRows = mockRows.filter((row) => row.id !== id);
    return;
  }

  await api.delete(`${anggotaBmtEndpoint}/${id}`);
}
