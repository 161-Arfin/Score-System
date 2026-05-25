export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email?: string;
};
