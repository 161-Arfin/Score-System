import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import {
  deleteAuthSessionTokens,
  getAuthSessionTokens,
  saveAuthSessionTokens,
} from "@/lib/auth/tokenStore";

type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

type ExternalRequestInit = Omit<RequestInit, "body"> & { body?: unknown };

type RefreshTokenResponse = {
  access_token?: string;
  refresh_token?: string;
};

type AuthContext = {
  authToken?: string;
  authSessionKey?: string;
};

export class ExternalApiError extends Error {
  statusCode: number;
  payload?: JsonValue;

  constructor(statusCode: number, message: string, payload?: JsonValue) {
    super(message);
    this.name = "ExternalApiError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

const getApiUrl = () => {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    throw new ExternalApiError(500, "API_URL is not configured");
  }

  return apiUrl.replace(/\/$/, "");
};

const toBodyInit = (body: unknown): BodyInit | undefined => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
};

const safeJson = async (response: Response): Promise<JsonValue | undefined> => {
  try {
    return (await response.json()) as JsonValue;
  } catch {
    return undefined;
  }
};

const sendExternalRequest = async (
  apiUrl: string,
  endpoint: string,
  init: ExternalRequestInit,
) => {
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...init,
    headers,
    body: toBodyInit(init.body),
  });
  const data = await safeJson(response);

  return { response, data };
};

const getPayloadMessage = (
  payload: JsonValue | undefined,
): string | undefined => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return undefined;
  }

  const message = payload["message"];

  return typeof message === "string" && message.trim().length > 0
    ? message
    : undefined;
};

const getAuthContext = async (req: NextApiRequest): Promise<AuthContext> => {
  const authorizationHeader = req.headers.authorization;

  if (Array.isArray(authorizationHeader)) {
    return {
      authToken: authorizationHeader[0]?.replace(/^Bearer\s+/i, ""),
    };
  }

  if (authorizationHeader) {
    return {
      authToken: authorizationHeader.replace(/^Bearer\s+/i, ""),
    };
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (typeof token?.authSessionKey === "string") {
    const sessionTokens = await getAuthSessionTokens(token.authSessionKey);

    if (typeof sessionTokens?.accessToken === "string") {
      return {
        authToken: sessionTokens.accessToken,
        authSessionKey: token.authSessionKey,
      };
    }
  }

  return {};
};

const refreshAccessToken = async (
  apiUrl: string,
  authSessionKey: string,
): Promise<string | null> => {
  const sessionTokens = await getAuthSessionTokens(authSessionKey);

  if (!sessionTokens?.refreshToken) {
    await deleteAuthSessionTokens(authSessionKey);
    return null;
  }

  const { response, data } = await sendExternalRequest(apiUrl, "/v1/refresh", {
    method: "POST",
    body: {
      refresh_token: sessionTokens.refreshToken,
    },
  });

  if (!response.ok) {
    await deleteAuthSessionTokens(authSessionKey);
    return null;
  }

  const refreshedTokens = data as RefreshTokenResponse | undefined;

  if (!refreshedTokens?.access_token) {
    await deleteAuthSessionTokens(authSessionKey);
    return null;
  }

  await saveAuthSessionTokens(authSessionKey, {
    accessToken: refreshedTokens.access_token,
    refreshToken:
      refreshedTokens.refresh_token ?? sessionTokens.refreshToken ?? null,
    storedAt: Date.now(),
  });

  return refreshedTokens.access_token;
};

export async function fetchExternalJson<T extends JsonValue = JsonValue>(
  req: NextApiRequest,
  endpoint: string,
  init: ExternalRequestInit,
): Promise<{ response: Response; data: T | undefined }> {
  const apiUrl = getApiUrl();
  const authContext = await getAuthContext(req);
  const headers = new Headers(init.headers ?? {});

  if (authContext.authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authContext.authToken}`);
  }

  let { response, data } = await sendExternalRequest(apiUrl, endpoint, {
    ...init,
    headers,
  });

  if (response.status === 401 && authContext.authSessionKey) {
    const refreshedAccessToken = await refreshAccessToken(
      apiUrl,
      authContext.authSessionKey,
    );

    if (refreshedAccessToken) {
      headers.set("Authorization", `Bearer ${refreshedAccessToken}`);

      const retriedRequest = await sendExternalRequest(apiUrl, endpoint, {
        ...init,
        headers,
      });
      response = retriedRequest.response;
      data = retriedRequest.data;
    }
  }

  if (!response.ok) {
    throw new ExternalApiError(
      response.status,
      getPayloadMessage(data) ??
        `External API request failed with status ${response.status}`,
      data,
    );
  }

  return { response, data: data as T | undefined };
}

export async function fetchExternalJsonDirect<T extends JsonValue = JsonValue>(
  endpoint: string,
  init: ExternalRequestInit,
): Promise<{ response: Response; data: T | undefined }> {
  const apiUrl = getApiUrl();
  const { response, data } = await sendExternalRequest(apiUrl, endpoint, init);

  if (!response.ok) {
    throw new ExternalApiError(
      response.status,
      getPayloadMessage(data) ??
        `External API request failed with status ${response.status}`,
      data,
    );
  }

  return { response, data: data as T | undefined };
}

export function sendApiError(res: NextApiResponse, error: unknown) {
  if (error instanceof ExternalApiError) {
    res.status(error.statusCode).json({
      status: false,
      statusCode: error.statusCode,
      message: error.message,
      data:
        error.payload !== undefined && !Array.isArray(error.payload)
          ? error.payload
          : null,
    });
    return;
  }

  const message =
    error instanceof Error ? error.message : "Unknown internal error";
  res.status(500).json({
    status: false,
    statusCode: 500,
    message: `Internal Server Error. ${message}`,
  });
}
