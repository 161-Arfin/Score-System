import type { NextApiRequest, NextApiResponse } from "next";
import { fetchExternalJson, sendApiError } from "@/lib/api/external";

function buildEndpoint(request: NextApiRequest) {
  const pathValue = request.query.path;
  const pathSegments = Array.isArray(pathValue)
    ? pathValue
    : pathValue
      ? [pathValue]
      : [];
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(request.query)) {
    if (key === "path") {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      continue;
    }

    if (typeof value === "string") {
      searchParams.append(key, value);
    }
  }

  const queryString = searchParams.toString();
  const endpoint = `/${pathSegments.join("/")}`;

  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (!request.method) {
    response.status(405).json({ message: "Method tidak valid." });
    return;
  }

  try {
    const { response: externalResponse, data } = await fetchExternalJson(
      request,
      buildEndpoint(request),
      {
        method: request.method,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body,
      },
    );

    response.status(externalResponse.status).json(data ?? null);
  } catch (error) {
    sendApiError(response, error);
  }
}
