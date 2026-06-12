import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { AuthRole } from "@/features/auth/types";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: AuthRole;
      instansi_id?: string;
      instansi_name?: string;
      username?: string;
      usertype_id?: string;
      usertype_name?: string;
      is_active?: boolean;
    };
  }

  interface User {
    role: AuthRole;
    instansi_id?: string;
    instansi_name?: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string | null;
    usertype_id?: string;
    usertype_name?: string;
    is_active?: boolean;
    image?: string | null;
    photo_thumb?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: AuthRole;
    instansi_id?: string;
    instansi_name?: string;
    username?: string;
    authSessionKey?: string;
    usertype_id?: string;
    usertype_name?: string;
    is_active?: boolean;
  }
}
