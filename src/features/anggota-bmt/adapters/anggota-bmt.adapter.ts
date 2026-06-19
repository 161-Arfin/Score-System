import type { AnggotaBmt, AnggotaBmtListResponse } from "../types";

type BackendAnggotaBmt = Partial<AnggotaBmt> & {
  id_keluarga?: string;
  kepala_keluarga?: string;
  nama_istri?: string;
  address?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  phone?: string;
  jml_anggota?: number;
  instansi_id?: number;
  instansi_name?: string;
  is_delete_keluarga?: boolean;
  created_at?: string;
  created_by?: string;
};

type BackendAnggotaBmtListResponse =
  | BackendAnggotaBmt[]
  | {
    data?: BackendAnggotaBmt[];
    total?: number;
  };

export function mapAnggotaBmtResponse(item: BackendAnggotaBmt): AnggotaBmt {
  return {
    id: item.id_keluarga ?? "",
    kepala_keluarga: item.kepala_keluarga ?? "",
    nama_istri: item.nama_istri ?? "",
    address: item.address ?? "",
    kecamatan: item.kecamatan ?? "",
    kabupaten: item.kabupaten ?? "",
    provinsi: item.provinsi ?? "",
    phone: item.phone ?? "",
    jml_anggota: item.jml_anggota ?? 0,
    instansi_id: item.instansi_id ?? 0,
    instansi_name: item.instansi_name ?? "",
    is_delete_keluarga: item.is_delete_keluarga ?? false,
    created_at: item.created_at ?? new Date().toISOString(),
    created_by: item.created_by ?? "unknown",
  };
}

export function mapAnggotaBmtListResponse(
  response: BackendAnggotaBmtListResponse,
): AnggotaBmtListResponse {
  const rows = Array.isArray(response) ? response : (response.data ?? []);
  const data = rows.map(mapAnggotaBmtResponse);

  return {
    data,
    total: Array.isArray(response)
      ? data.length
      : (response.total ?? data.length),
  };
}
