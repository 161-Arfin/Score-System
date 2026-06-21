import type { AnggotaBmt, AnggotaBmtListResponse } from "../types";

type BackendAnggotaBmt = Partial<AnggotaBmt> & {
  data?: BackendAnggotaBmt;
  id_keluarga?: number | string;
  id?: number | string;
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
  const source = item.data ?? item;

  return {
    id: String(source.id_keluarga ?? source.id ?? ""),
    kepala_keluarga: source.kepala_keluarga ?? "",
    nama_istri: source.nama_istri ?? "",
    address: source.address ?? "",
    kecamatan: source.kecamatan ?? "",
    kabupaten: source.kabupaten ?? "",
    provinsi: source.provinsi ?? "",
    phone: source.phone ?? "",
    jml_anggota: source.jml_anggota ?? 0,
    instansi_id: source.instansi_id ?? 0,
    instansi_name: source.instansi_name ?? "",
    is_delete_keluarga: source.is_delete_keluarga ?? false,
    created_at: source.created_at ?? new Date().toISOString(),
    created_by: source.created_by ?? "unknown",
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
