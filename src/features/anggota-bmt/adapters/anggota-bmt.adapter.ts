import type { AnggotaBmt, AnggotaBmtListResponse } from "../types";

type BackendAnggotaBmt = Partial<AnggotaBmt> & {
  name?: string;
  wife_name?: string;
  address?: string;
  whatsapp?: string;
  total_family?: string;
  instansi?: {
    id?: string;
    instansi_name?: string;
    name?: string;
  };
  updated_at?: string;
};

type BackendAnggotaBmtListResponse =
  | BackendAnggotaBmt[]
  | {
      data?: BackendAnggotaBmt[];
      total?: number;
    };

export function mapAnggotaBmtResponse(item: BackendAnggotaBmt): AnggotaBmt {
  return {
    id: item.id ?? "",
    kepala_keluarga: item.kepala_keluarga ?? item.name ?? "",
    nama_istri: item.nama_istri ?? item.wife_name ?? "",
    alamat: item.alamat ?? item.address ?? "",
    kecamatan: item.kecamatan ?? "",
    kabupaten: item.kabupaten ?? "",
    provinsi: item.provinsi ?? "",
    phone: item.phone ?? item.whatsapp ?? "",
    jml_anggota: item.jml_anggota ?? item.total_family ?? "",
    instansi_id: item.instansi_id ?? item.instansi?.id ?? "",
    instansi_name:
      item.instansi_name ??
      item.instansi?.instansi_name ??
      item.instansi?.name ??
      "",
    is_delete_keluarga: item.is_delete_keluarga ?? false,
    updatedAt: item.updatedAt ?? item.updated_at ?? new Date().toISOString(),
  };
}

export function mapAnggotaBmtListResponse(
  response: BackendAnggotaBmtListResponse
): AnggotaBmtListResponse {
  const rows = Array.isArray(response) ? response : response.data ?? [];
  const data = rows.map(mapAnggotaBmtResponse);

  return {
    data,
    total: Array.isArray(response) ? data.length : response.total ?? data.length,
  };
}
