export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthRole = "admin" | "superadmin";

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: AuthRole;
  instansi_id?: string;
  instansi_name?: string;
};
