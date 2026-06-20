import type { AuthRole } from "@/features/auth/types";

export const ADMIN_FALLBACK_PATH = "/anggota-bmt";

export function normalizeUserRole(role?: string | null): AuthRole {
  return role === "superadmin" ? "superadmin" : "user";
}

export function canAccessPath(role: AuthRole, pathname: string) {
  if (role === "superadmin") {
    return true;
  }

  if (pathname.startsWith("/auth") || pathname === "/assessment/start") {
    return true;
  }

  return !pathname.startsWith("/bmt");
}
