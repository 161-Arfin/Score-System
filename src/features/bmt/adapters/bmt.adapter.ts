import type { UnitBmt, UnitBmtListResponse } from "../types";

type BackendUnitBmt = Partial<UnitBmt> & {
  id_instansi?: number | string;
  name?: string;
  address?: string;
  phone?: string;
  updated_at?: string;
};

type BackendBmtListResponse =
  | UnitBmt[]
  | {
      data?: BackendUnitBmt[];
      total?: number;
    };

export function mapUnitBmtResponse(item: BackendUnitBmt): UnitBmt {
  return {
    id: String(item.id ?? item.id_instansi ?? ""),
    instansi_name: item.instansi_name ?? item.name ?? "",
    instansi_address: item.instansi_address ?? item.address ?? "",
    instansi_phone: item.instansi_phone ?? item.phone ?? "",
    is_delete_instansi: item.is_delete_instansi ?? false,
    updatedAt: item.updatedAt ?? item.updated_at ?? new Date().toISOString(),
  };
}

export function mapUnitBmtListResponse(
  response: BackendBmtListResponse,
): UnitBmtListResponse {
  const rows = Array.isArray(response) ? response : (response.data ?? []);
  const data = rows.map(mapUnitBmtResponse);

  return {
    data,
    total: Array.isArray(response)
      ? data.length
      : (response.total ?? data.length),
  };
}
