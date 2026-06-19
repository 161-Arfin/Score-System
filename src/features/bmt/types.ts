export type UnitBmt = {
  id: string;
  instansi_name: string;
  instansi_address: string;
  instansi_phone: string;
  is_delete_instansi: boolean;
  created_at: string;
  created_by: string;
};

export type UnitBmtPayload = {
  instansi_name: string;
  instansi_address: string;
  instansi_phone: string;
};

export type UnitBmtFilters = {
  search: string;
};

export type UnitBmtListResponse = {
  data: UnitBmt[];
  total: number;
};
