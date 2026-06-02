import type { NextApiRequest, NextApiResponse } from "next";
import { wilayahIndonesiaApiBaseUrl } from "@/features/anggota-bmt/constants";
import type { RegionOption } from "@/features/anggota-bmt/services/region.service";

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse<RegionOption[] | { message: string }>
) {
  try {
    const apiResponse = await fetch(
      `${wilayahIndonesiaApiBaseUrl}/provinces.json`
    );

    if (!apiResponse.ok) {
      response.status(apiResponse.status).json({
        message: "Daftar provinsi belum bisa dimuat.",
      });
      return;
    }

    const data = (await apiResponse.json()) as RegionOption[];
    response.status(200).json(data);
  } catch {
    response.status(500).json({
      message: "Daftar provinsi belum bisa dimuat.",
    });
  }
}
