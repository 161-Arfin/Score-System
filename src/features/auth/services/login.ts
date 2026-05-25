import type { AuthUser, LoginPayload } from "@/features/auth/types";

const developmentUser = {
  username: "admin@scoresystem.local",
  password: "password123",
};

export async function loginWithCredentials({
  password,
  username,
}: LoginPayload): Promise<AuthUser | null> {
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
  };
}
