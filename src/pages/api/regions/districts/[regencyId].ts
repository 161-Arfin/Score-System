import type { NextApiRequest, NextApiResponse } from "next";
import { wilayahIndonesiaApiBaseUrl } from "@/features/anggota-bmt/constants";
import type { RegionOption } from "@/features/anggota-bmt/services/region.service";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RegionOption[] | { message: string }>
) {
  const regencyId =
    typeof request.query.regencyId === "string" ? request.query.regencyId : "";

  if (!regencyId) {
    response.status(400).json({ message: "ID kabupaten wajib diisi." });
    return;
  }

  try {
    const apiResponse = await fetch(
      `${wilayahIndonesiaApiBaseUrl}/districts/${regencyId}.json`
    );

    if (!apiResponse.ok) {
      response.status(apiResponse.status).json({
        message: "Daftar kecamatan belum bisa dimuat.",
      });
      return;
    }

    const data = (await apiResponse.json()) as RegionOption[];
    response.status(200).json(data);
  } catch {
    response.status(500).json({
      message: "Daftar kecamatan belum bisa dimuat.",
    });
  }
}
