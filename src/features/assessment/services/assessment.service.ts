import { assessmentParticipants } from "../mocks";
import type { AssessmentValidationResult } from "../types";

const phonePattern = /^628\d{8,13}$/;

export async function validateAssessmentPhone(
  phone: string,
): Promise<AssessmentValidationResult> {
  const normalizedPhone = phone.trim();

  if (!phonePattern.test(normalizedPhone)) {
    throw new Error("Nomor Whatsapp wajib diawali 628 dan berisi angka.");
  }

  const participant = assessmentParticipants.find(
    (item) => item.phone === normalizedPhone,
  );

  await new Promise((resolve) => {
    window.setTimeout(resolve, 350);
  });

  if (participant) {
    return {
      status: "registered",
      participant,
      message: "Data peserta berhasil ditemukan.",
    };
  }

  return {
    status: "new",
    phone: normalizedPhone,
    message: "Silahkan lanjutkan untuk mengisi data keluarga anda.",
  };
}
