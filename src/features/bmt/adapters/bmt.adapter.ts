import type { UnitBmt, UnitBmtListResponse } from "../types";

type BackendUnitBmt = Partial<UnitBmt> & {
  id_instansi?: number | string;
  instansi_name?: string;
  instansi_address?: string;
  instansi_phone?: string;
  is_delete_instansi?: boolean;
  created_at?: string;
  created_by?: string;
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
    instansi_name: item.instansi_name ?? "",
    instansi_address: item.instansi_address ?? "",
    instansi_phone: item.instansi_phone ?? "",
    is_delete_instansi: item.is_delete_instansi ?? false,
    created_at: item.created_at ?? new Date().toISOString(),
    created_by: item.created_by ?? "Unknown",
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
