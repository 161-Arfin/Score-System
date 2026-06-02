import type { NextApiRequest, NextApiResponse } from "next";
import { wilayahIndonesiaApiBaseUrl } from "@/features/anggota-bmt/constants";
import type { RegionOption } from "@/features/anggota-bmt/services/region.service";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RegionOption[] | { message: string }>
) {
  const provinceId =
    typeof request.query.provinceId === "string"
      ? request.query.provinceId
      : "";

  if (!provinceId) {
    response.status(400).json({ message: "ID provinsi wajib diisi." });
    return;
  }

  try {
    const apiResponse = await fetch(
      `${wilayahIndonesiaApiBaseUrl}/regencies/${provinceId}.json`
    );

    if (!apiResponse.ok) {
      response.status(apiResponse.status).json({
        message: "Daftar kabupaten belum bisa dimuat.",
      });
      return;
    }

    const data = (await apiResponse.json()) as RegionOption[];
    response.status(200).json(data);
  } catch {
    response.status(500).json({
      message: "Daftar kabupaten belum bisa dimuat.",
    });
  }
}
