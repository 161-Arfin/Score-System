import type { AuthUser, LoginPayload } from "@/features/auth/types";
import { fetchExternalJsonDirect } from "@/lib/api/external";

type BackendAuthTokenResponse = {
  access_token?: string;
  refresh_token?: string;
};

type BackendUserProfileResponse = {
  data?: {
    id_users?: string | number;
    id?: string | number;
    name?: string;
    username?: string;
    email?: string;
    instansi_id?: string | number | null;
    instansi_name?: string | null;
    usertype_id?: string | number | null;
    usertype_name?: string | null;
    is_active?: boolean;
    photo?: string | null;
    photo_thumb?: string | null;
    [key: string]: unknown;
  };
};

type BackendAuthUser = AuthUser & {
  accessToken?: string;
  refreshToken?: string | null;
  usertype_id?: string;
  usertype_name?: string;
  is_active?: boolean;
  image?: string | null;
  photo_thumb?: string | null;
};

function getConfiguredRole(): AuthUser["role"] {
  return process.env.AUTH_DEMO_ROLE === "admin" ? "user" : "superadmin";
}

function getConfiguredInstansiId() {
  return process.env.AUTH_DEMO_INSTANSI_ID ?? "unit-a";
}

function getConfiguredInstansiName() {
  return process.env.AUTH_DEMO_INSTANSI_NAME ?? "Unit A";
}

function resolveRole(usertypeName?: unknown, usertypeId?: unknown): AuthUser["role"] {
  const normalizedName =
    typeof usertypeName === "string" ? usertypeName.toLowerCase() : "";

  if (normalizedName.includes("super")) {
    return "superadmin";
  }

  if (normalizedName.includes("user")) {
    return "user";
  }

  const normalizedId = String(usertypeId ?? "").trim();
  const superadminIds = (
    process.env.AUTH_SUPERADMIN_USERTYPE_IDS ?? "1"
  )
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return superadminIds.includes(normalizedId) ? "superadmin" : "user";
}

function normalizeValue(value: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value);
}

async function loginWithBackendCredentials({
  password,
  username,
}: LoginPayload): Promise<BackendAuthUser | null> {
  try {
    const { data: authToken } =
      await fetchExternalJsonDirect<BackendAuthTokenResponse>("/v1/login", {
        method: "POST",
        body: { username, password },
      });

    const accessToken = authToken?.access_token;

    if (!accessToken) {
      return null;
    }

    const { data: user } =
      await fetchExternalJsonDirect<BackendUserProfileResponse>(
        "/v1/auth/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

    const profile = user?.data;
    const id = normalizeValue(profile?.id_users ?? profile?.id);

    if (!profile || !id) {
      return null;
    }

    const authUser: BackendAuthUser = {
      id,
      name: profile.name ?? profile.username ?? username,
      username: profile.username ?? username,
      email: profile.email,
      role: resolveRole(profile.usertype_name, profile.usertype_id),
      instansi_id: normalizeValue(profile.instansi_id),
      instansi_name: profile.instansi_name ?? undefined,
      accessToken,
      refreshToken: authToken?.refresh_token ?? null,
      usertype_id: normalizeValue(profile.usertype_id),
      usertype_name: profile.usertype_id == 1 ? "Super Admin" : profile.usertype_id == 2 ? "User" : undefined,
      is_active: profile.is_active,
      image: profile.photo ?? null,
      photo_thumb: profile.photo_thumb ?? null,
    };
    
    return authUser;
  } catch {
    return null;
  }
}

const developmentUser = {
  username: "admin@scoresystem.local",
  password: "password123",
};

export async function loginWithCredentials({
  password,
  username,
}: LoginPayload): Promise<BackendAuthUser | null> {
  if (process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE_URL) {
    return loginWithBackendCredentials({ password, username });
  }

  const configuredUsername =
    process.env.AUTH_DEMO_USERNAME ??
    (process.env.NODE_ENV === "production" ? undefined : developmentUser.username);
  const configuredPassword =
    process.env.AUTH_DEMO_PASSWORD ??
    (process.env.NODE_ENV === "production" ? undefined : developmentUser.password);

  if (!configuredUsername || !configuredPassword) {
    return null;
  }

  if (username !== configuredUsername || password !== configuredPassword) {
    return null;
  }

  return {
    id: "demo-user",
    name: "Admin Score System",
    username: configuredUsername,
    email: configuredUsername.includes("@") ? configuredUsername : undefined,
    role: getConfiguredRole(),
    instansi_id: getConfiguredInstansiId(),
    instansi_name: getConfiguredInstansiName(),
  };
}
