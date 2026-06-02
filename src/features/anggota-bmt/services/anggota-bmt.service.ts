import { api } from "@/lib/api";
import { getUnitBmtList } from "@/features/bmt/services/bmt.service";
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

async function getInstansiName(instansiId: string) {
  const response = await getUnitBmtList();
  return (
    response.data.find((item) => item.id === instansiId)?.instansi_name ?? ""
  );
}

export async function getAnggotaBmtList(): Promise<AnggotaBmtListResponse> {
  if (shouldUseMockAnggotaBmtData) {
    const data = mockRows.filter((row) => !row.is_delete_keluarga);

    return {
      data,
      total: data.length,
    };
  }

  const response = await api.get(anggotaBmtEndpoint);

  return mapAnggotaBmtListResponse(response.data);
}

export async function getDeletedAnggotaBmtList(): Promise<AnggotaBmtListResponse> {
  if (shouldUseMockAnggotaBmtData) {
    const data = mockRows.filter((row) => row.is_delete_keluarga);

    return {
      data,
      total: data.length,
    };
  }

  const response = await api.get(`${anggotaBmtEndpoint}/recycle-bin`);

  return mapAnggotaBmtListResponse(response.data);
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

  return mapAnggotaBmtResponse(response.data);
}

export async function createAnggotaBmt(
  payload: AnggotaBmtPayload
): Promise<AnggotaBmt> {
  if (shouldUseMockAnggotaBmtData) {
    const row: AnggotaBmt = {
      ...payload,
      id: `keluarga-${Date.now()}`,
      instansi_name: await getInstansiName(payload.instansi_id),
      is_delete_keluarga: false,
      updatedAt: new Date().toISOString(),
    };

    mockRows = [row, ...mockRows];
    return row;
  }

  const response = await api.post(anggotaBmtEndpoint, payload);

  return mapAnggotaBmtResponse(response.data);
}

export async function updateAnggotaBmt(
  id: string,
  payload: AnggotaBmtPayload
): Promise<AnggotaBmt> {
  if (shouldUseMockAnggotaBmtData) {
    const current = await getAnggotaBmtById(id);
    const nextRow: AnggotaBmt = {
      ...current,
      ...payload,
      instansi_name: await getInstansiName(payload.instansi_id),
      updatedAt: new Date().toISOString(),
    };

    mockRows = mockRows.map((row) => (row.id === id ? nextRow : row));
    return nextRow;
  }

  const response = await api.put(`${anggotaBmtEndpoint}/${id}`, payload);

  return mapAnggotaBmtResponse(response.data);
}

export async function deleteAnggotaBmt(id: string): Promise<void> {
  if (shouldUseMockAnggotaBmtData) {
    mockRows = mockRows.map((row) =>
      row.id === id ? { ...row, is_delete_keluarga: true } : row
    );
    return;
  }

  await api.patch(`${anggotaBmtEndpoint}/${id}`, {
    is_delete_keluarga: true,
  });
}

export async function restoreAnggotaBmt(id: string): Promise<void> {
  if (shouldUseMockAnggotaBmtData) {
    mockRows = mockRows.map((row) =>
      row.id === id ? { ...row, is_delete_keluarga: false } : row
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
