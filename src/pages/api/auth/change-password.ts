import type { NextApiRequest, NextApiResponse } from "next";
import { fetchExternalJson, sendApiError } from "@/lib/api/external";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "PUT") {
    response.status(405).json({ message: "Method tidak valid." });
    return;
  }

  try {
    const endpoint =
      process.env.AUTH_CHANGE_PASSWORD_ENDPOINT ??
      "/v1/auth/user/change-password";
    const { response: externalResponse, data } = await fetchExternalJson(
      request,
      endpoint,
      {
        method: "PUT",
        body: request.body,
      },
    );

    response.status(externalResponse.status).json(data ?? null);
  } catch (error) {
    sendApiError(response, error);
  }
}
