export type AnggotaBmt = {
  id: string;
  kepala_keluarga: string;
  nama_istri: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  phone: string;
  jml_anggota: string;
  instansi_id: string;
  instansi_name: string;
  is_delete_keluarga: boolean;
  updatedAt: string;
};

export type AnggotaBmtPayload = {
  kepala_keluarga: string;
  nama_istri: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  phone: string;
  jml_anggota: string;
  instansi_id: string;
};

export type AnggotaBmtListResponse = {
  data: AnggotaBmt[];
  total: number;
};
