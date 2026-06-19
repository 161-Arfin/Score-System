export type AnggotaBmt = {
  id: string;
  kepala_keluarga: string;
  nama_istri: string;
  address: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  phone: string;
  jml_anggota: number;
  instansi_id: number;
  instansi_name: string;
  is_delete_keluarga: boolean;
  created_at: string;
  created_by: string;
};

export type AnggotaBmtPayload = {
  kepala_keluarga: string;
  nama_istri: string;
  address: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  phone: string;
  jml_anggota: number;
  instansi_id: number;
};

export type AnggotaBmtListResponse = {
  data: AnggotaBmt[];
  total: number;
};
