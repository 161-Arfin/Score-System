import { assessmentParticipants, assessmentResults } from "../mocks";
import { assessmentSections } from "../constants";
import { api } from "@/lib/api";
import type {
  AssessmentDimensionScore,
  AssessmentResult,
  AssessmentScoreResult,
  AssessmentSubmitPayload,
  AssessmentValidationResult,
} from "../types";

const phonePattern = /^628\d{8,13}$/;
const shouldUseMockAssessmentData =
  process.env.NEXT_PUBLIC_USE_ASSESSMENT_MOCK !== "false";

type BackendAssessmentValidationResponse = Partial<{
  status: "registered" | "new";
  data: Partial<AssessmentValidationResult> | unknown;
  participant: AssessmentValidationResult extends infer T
    ? T extends { participant: infer P }
      ? P
      : never
    : never;
  phone: string;
  message: string;
}>;

function getResponseData<T>(response: unknown): T {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data?: unknown }).data;

    if (data && typeof data === "object" && "data" in data) {
      return (data as { data: T }).data;
    }

    return data as T;
  }

  return response as T;
}

function normalizeValidationResponse(
  payload: BackendAssessmentValidationResponse,
  phone: string,
): AssessmentValidationResult {
  const source =
    payload.data && typeof payload.data === "object"
      ? (payload.data as BackendAssessmentValidationResponse)
      : payload;
  const status = source.status ?? payload.status;
  const participant = source.participant ?? payload.participant;
  const message =
    source.message ??
    payload.message ??
    (status === "registered"
      ? "Data peserta berhasil ditemukan."
      : "Silahkan lanjutkan untuk mengisi data keluarga anda.");

  if (status === "registered" && participant) {
    return {
      status: "registered",
      participant,
      message,
    };
  }

  return {
    status: "new",
    phone: source.phone ?? payload.phone ?? phone,
    message,
  };
}

export async function validateAssessmentPhone(
  phone: string,
): Promise<AssessmentValidationResult> {
  const normalizedPhone = phone.trim();

  if (!phonePattern.test(normalizedPhone)) {
    throw new Error("Nomor Whatsapp wajib diawali 628 dan berisi angka.");
  }

  if (!shouldUseMockAssessmentData) {
    const response = await api.post("/assessment/validate-phone", {
      phone: normalizedPhone,
    });

    return normalizeValidationResponse(
      getResponseData<BackendAssessmentValidationResponse>(response),
      normalizedPhone,
    );
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

export async function getAssessmentResults(): Promise<AssessmentResult[]> {
  if (!shouldUseMockAssessmentData) {
    const response = await api.get("/assessment/responses");

    return getResponseData<AssessmentResult[]>(response);
  }

  return assessmentResults;
}

export async function submitAssessment(
  payload: AssessmentSubmitPayload,
): Promise<void> {
  if (shouldUseMockAssessmentData) {
    return;
  }

  await api.post("/assessment", payload);
}

const dimensionConfig: Array<{
  sectionId: string;
  key: AssessmentDimensionScore["key"];
  label: string;
  weight: number;
}> = [
  {
    sectionId: "hifz_ad_din",
    key: "hifzAdDin",
    label: "Hifz Ad-Din",
    weight: 0.25,
  },
  {
    sectionId: "hifz_an_nafs",
    key: "hifzAnNafs",
    label: "Hifz An-Nafs",
    weight: 0.15,
  },
  {
    sectionId: "hifz_al_aql",
    key: "hifzAlAql",
    label: "Hifz Al-Aql",
    weight: 0.15,
  },
  {
    sectionId: "hifz_an_nasl",
    key: "hifzAnNasl",
    label: "Hifz An-Nasl",
    weight: 0.2,
  },
  {
    sectionId: "hifz_al_mal",
    key: "hifzAlMal",
    label: "Hifz Al-Mal",
    weight: 0.25,
  },
];

function getDimensionStatus(score: number) {
  if (score >= 80) return "Kuat";
  if (score >= 60) return "Cukup";
  if (score >= 40) return "Perlu Penguatan";

  return "Prioritas Pendampingan";
}

function getTier(totalScore: number) {
  if (totalScore >= 85) return "Berlian";
  if (totalScore >= 70) return "Emas";
  if (totalScore >= 55) return "Perak";
  if (totalScore >= 40) return "Perunggu";

  return "Merah";
}

function getDimensionScores(row: AssessmentResult): AssessmentDimensionScore[] {
  return dimensionConfig.map((dimension) => {
    const section = assessmentSections.find(
      (item) => item.id === dimension.sectionId,
    );
    const questionIds = section?.questions.map((question) => question.id) ?? [];
    const score = row.answers
      .filter((answer) => questionIds.includes(answer.questionId))
      .reduce((total, answer) => total + answer.score, 0);

    return {
      key: dimension.key,
      label: dimension.label,
      score,
      status: getDimensionStatus(score),
    };
  });
}

export async function getAssessmentScoreResults(): Promise<
  AssessmentScoreResult[]
> {
  if (!shouldUseMockAssessmentData) {
    const response = await api.get("/assessment/scores");

    return getResponseData<AssessmentScoreResult[]>(response);
  }

  return assessmentResults.map((row) => {
    const dimensionScores = getDimensionScores(row);
    const scoreByKey = dimensionScores.reduce(
      (result, dimension) => ({
        ...result,
        [dimension.key]: dimension.score,
      }),
      {} as Record<AssessmentDimensionScore["key"], number>,
    );
    const statusByKey = dimensionScores.reduce(
      (result, dimension) => ({
        ...result,
        [dimension.key]: dimension.status,
      }),
      {} as Record<AssessmentDimensionScore["key"], string>,
    );
    const totalSakinahScore = Math.round(
      dimensionConfig.reduce((total, dimension) => {
        return total + (scoreByKey[dimension.key] ?? 0) * dimension.weight;
      }, 0),
    );
    const sortedDimensions = [...dimensionScores].sort(
      (first, second) => second.score - first.score,
    );

    return {
      id: row.id,
      timestamp: row.submittedAt,
      kepala_keluarga: row.kepala_keluarga,
      nama_istri: row.nama_istri,
      phone: row.phone,
      instansi_name: row.instansi_name,
      tanggal_assessment: row.submittedAt,
      hifzAdDinScore: scoreByKey.hifzAdDin ?? 0,
      hifzAnNafsScore: scoreByKey.hifzAnNafs ?? 0,
      hifzAlAqlScore: scoreByKey.hifzAlAql ?? 0,
      hifzAnNaslScore: scoreByKey.hifzAnNasl ?? 0,
      hifzAlMalScore: scoreByKey.hifzAlMal ?? 0,
      totalSakinahScore,
      tier: getTier(totalSakinahScore),
      statusAdDin: statusByKey.hifzAdDin ?? "-",
      statusAnNafs: statusByKey.hifzAnNafs ?? "-",
      statusAlAql: statusByKey.hifzAlAql ?? "-",
      statusAnNasl: statusByKey.hifzAnNasl ?? "-",
      statusAlMal: statusByKey.hifzAlMal ?? "-",
      dimensiTertinggi: sortedDimensions[0]?.label ?? "-",
      dimensiTerendah:
        sortedDimensions[sortedDimensions.length - 1]?.label ?? "-",
    };
  });
}
