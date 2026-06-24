import { assessmentParticipants, assessmentResults } from "../mocks";
import {
  assessmentEndpoint,
  assessmentReadEndpoint,
  assessmentScoreReadEndpoint,
  assessmentSections,
  assessmentValidatePhoneEndpoint,
} from "../constants";
import axios from "axios";
import { api } from "@/lib/api";
import type {
  AssessmentParticipant,
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
  participant: AssessmentParticipant;
  id?: number | string;
  id_keluarga?: number | string;
  keluarga_id?: number | string;
  kepala_keluarga?: string;
  nama_istri?: string;
  address?: string;
  alamat?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  phone?: string;
  jml_anggota?: number | string;
  instansi_id?: number | string;
  instansi_name?: string;
  message: string;
}>;

type BackendAssessmentSubmitPayload = {
  keluarga_id: number;
  instansi_id: number;
  created_by: string;
} & Record<`${string}_score`, number | string>;

type BackendAssessmentReadRow = Partial<{
  id: number | string;
  id_assessment: number | string;
  keluarga_id: number | string;
  kepala_keluarga: string;
  nama_istri: string;
  address: string;
  alamat: string;
  phone: string;
  instansi_name: string;
  created_at: string;
  createdAt: string;
  is_delete_assessment: boolean;
}> &
  Record<`${string}_score`, number | string | undefined>;

type BackendAssessmentScoreRow = Partial<{
  id: number | string;
  id_score_assessment: number | string;
  assessment_id: number | string;
  keluarga_id: number | string;
  kepala_keluarga: string;
  nama_istri: string;
  address: string;
  phone: string;
  instansi_name: string;
  addin_score: number | string;
  annafs_score: number | string;
  alaql_score: number | string;
  annasl_score: number | string;
  almal_score: number | string;
  total_sakinah_score: number | string;
  tier_name: string;
  addin_status: number | string;
  annafs_status: number | string;
  alaql_status: number | string;
  annasl_status: number | string;
  almal_status: number | string;
  created_at: string;
  createdAt: string;
  is_delete_score_assessment: boolean;
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

function isObjectPayload(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getNestedPayload(payload: unknown): unknown {
  if (!isObjectPayload(payload) || !("data" in payload)) {
    return payload;
  }

  const data = payload.data;

  if (isObjectPayload(data) && "data" in data) {
    return data.data;
  }

  return data;
}

function getBackendErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "";
  }

  const responseData = error.response?.data;

  if (!responseData || typeof responseData !== "object") {
    return error.message;
  }

  const nestedPayload = getNestedPayload(responseData);

  if (
    isObjectPayload(nestedPayload) &&
    "error" in nestedPayload &&
    typeof nestedPayload.error === "string"
  ) {
    return nestedPayload.error;
  }

  if (
    isObjectPayload(nestedPayload) &&
    "message" in nestedPayload &&
    typeof nestedPayload.message === "string"
  ) {
    return nestedPayload.message;
  }

  if (
    "error" in responseData &&
    typeof responseData.error === "string"
  ) {
    return responseData.error;
  }

  if (
    "message" in responseData &&
    typeof responseData.message === "string"
  ) {
    return responseData.message;
  }

  return error.message;
}

function getValidationPayloadFromError(
  error: unknown,
): BackendAssessmentValidationResponse | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const payload = getNestedPayload(error.response?.data);

  if (!isObjectPayload(payload)) {
    return null;
  }

  return payload as BackendAssessmentValidationResponse;
}

function isAlreadyAssessedMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("sudah") &&
    normalizedMessage.includes("assessment")
  );
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
      participant: normalizeParticipant(participant),
      message,
    };
  }

  if (hasParticipantFields(source)) {
    return {
      status: "registered",
      participant: normalizeParticipant(source),
      message,
    };
  }

  return {
    status: "new",
    phone: source.phone ?? payload.phone ?? phone,
    message,
  };
}

function hasParticipantFields(
  payload: BackendAssessmentValidationResponse,
): payload is BackendAssessmentValidationResponse & {
  kepala_keluarga: string;
  nama_istri: string;
} {
  return Boolean(payload.kepala_keluarga && payload.nama_istri);
}

function normalizeParticipant(
  payload: AssessmentParticipant | BackendAssessmentValidationResponse,
): AssessmentParticipant {
  const backendPayload = payload as BackendAssessmentValidationResponse;
  const keluargaId =
    payload.keluarga_id ?? backendPayload.id_keluarga ?? payload.id ?? "";

  return {
    id: String(keluargaId),
    keluarga_id: String(keluargaId),
    kepala_keluarga: payload.kepala_keluarga ?? "",
    nama_istri: payload.nama_istri ?? "",
    alamat: payload.alamat ?? backendPayload.address ?? "",
    kecamatan: payload.kecamatan ?? "",
    kabupaten: payload.kabupaten ?? "",
    provinsi: payload.provinsi ?? "",
    phone: payload.phone ?? "",
    jml_anggota: String(payload.jml_anggota ?? ""),
    instansi_id: String(payload.instansi_id ?? ""),
    instansi_name: payload.instansi_name ?? "",
  };
}

function mapAssessmentSubmitPayload(
  payload: AssessmentSubmitPayload,
): BackendAssessmentSubmitPayload {
  const keluargaId = Number(
    payload.participant.keluarga_id ?? payload.participant.id,
  );
  const instansiId = Number(payload.participant.instansi_id);

  if (!Number.isFinite(keluargaId) || keluargaId <= 0) {
    throw new Error("ID keluarga belum tersedia untuk submit assessment.");
  }

  if (!Number.isFinite(instansiId) || instansiId <= 0) {
    throw new Error("ID Unit BMT belum tersedia untuk submit assessment.");
  }

  return payload.answers.reduce<BackendAssessmentSubmitPayload>(
    (result, answer) => ({
      ...result,
      [`${answer.questionId}_score`]: answer.score,
    }),
    {
      keluarga_id: keluargaId,
      instansi_id: instansiId,
      q40_score: 1,
      q41_score: 5,
      q42_score: "Bismillah lebih baik",
      created_by: payload.participant.kepala_keluarga,
    },
  );
}

function mapAssessmentReadRow(row: BackendAssessmentReadRow): AssessmentResult {
  return {
    id: String(row.id_assessment ?? row.id ?? ""),
    kepala_keluarga: row.kepala_keluarga ?? "",
    nama_istri: row.nama_istri ?? "",
    alamat: row.address ?? row.alamat ?? "",
    phone: row.phone ?? "",
    instansi_name: row.instansi_name ?? "",
    source: "Link Form",
    submittedAt: row.created_at ?? row.createdAt ?? "",
    answers: assessmentSections.flatMap((section) =>
      section.questions.map((question) => ({
        questionId: question.id,
        score: Number(row[`${question.id}_score`] ?? 0),
      })),
    ),
  };
}

function mapAssessmentReadRows(rows: BackendAssessmentReadRow[]) {
  return rows
    .filter((row) => !row.is_delete_assessment)
    .map((row) => mapAssessmentReadRow(row))
    .sort((first, second) => getAssessmentTime(second) - getAssessmentTime(first));
}

function getAssessmentTime(row: AssessmentResult) {
  const timestamp = new Date(row.submittedAt).getTime();

  if (Number.isFinite(timestamp)) {
    return timestamp;
  }

  return Number(row.id) || 0;
}

function normalizeBackendStatus(status: number | string | undefined) {
  const normalizedStatus = Number(status);

  if (!Number.isFinite(normalizedStatus)) {
    return status ? String(status) : "-";
  }

  if (normalizedStatus >= 4) return "Kuat";
  if (normalizedStatus === 3) return "Cukup";
  if (normalizedStatus === 2) return "Perlu Penguatan";
  if (normalizedStatus === 1) return "Prioritas";

  return "-";
}

function getHighestDimension(row: AssessmentScoreResult) {
  const dimensions = [
    { label: "Hifz Ad-Din", value: row.hifzAdDinScore },
    { label: "Hifz An-Nafs", value: row.hifzAnNafsScore },
    { label: "Hifz Al-Aql", value: row.hifzAlAqlScore },
    { label: "Hifz An-Nasl", value: row.hifzAnNaslScore },
    { label: "Hifz Al-Mal", value: row.hifzAlMalScore },
  ];

  return [...dimensions].sort((first, second) => second.value - first.value)[0]
    ?.label ?? "-";
}

function getLowestDimension(row: AssessmentScoreResult) {
  const dimensions = [
    { label: "Hifz Ad-Din", value: row.hifzAdDinScore },
    { label: "Hifz An-Nafs", value: row.hifzAnNafsScore },
    { label: "Hifz Al-Aql", value: row.hifzAlAqlScore },
    { label: "Hifz An-Nasl", value: row.hifzAnNaslScore },
    { label: "Hifz Al-Mal", value: row.hifzAlMalScore },
  ];

  return [...dimensions].sort((first, second) => first.value - second.value)[0]
    ?.label ?? "-";
}

function mapAssessmentScoreRow(
  row: BackendAssessmentScoreRow,
): AssessmentScoreResult {
  const mappedRow: AssessmentScoreResult = {
    id: String(row.id_score_assessment ?? row.id ?? ""),
    timestamp: row.created_at ?? row.createdAt ?? "",
    kepala_keluarga: row.kepala_keluarga ?? "",
    nama_istri: row.nama_istri ?? "",
    phone: row.phone ?? "",
    instansi_name: row.instansi_name ?? "",
    tanggal_assessment: row.created_at ?? row.createdAt ?? "",
    hifzAdDinScore: Number(row.addin_score ?? 0),
    hifzAnNafsScore: Number(row.annafs_score ?? 0),
    hifzAlAqlScore: Number(row.alaql_score ?? 0),
    hifzAnNaslScore: Number(row.annasl_score ?? 0),
    hifzAlMalScore: Number(row.almal_score ?? 0),
    totalSakinahScore: Number(row.total_sakinah_score ?? 0),
    tier: row.tier_name ?? "-",
    statusAdDin: normalizeBackendStatus(row.addin_status),
    statusAnNafs: normalizeBackendStatus(row.annafs_status),
    statusAlAql: normalizeBackendStatus(row.alaql_status),
    statusAnNasl: normalizeBackendStatus(row.annasl_status),
    statusAlMal: normalizeBackendStatus(row.almal_status),
    dimensiTertinggi: "-",
    dimensiTerendah: "-",
  };

  return {
    ...mappedRow,
    dimensiTertinggi: getHighestDimension(mappedRow),
    dimensiTerendah: getLowestDimension(mappedRow),
  };
}

function mapAssessmentScoreRows(rows: BackendAssessmentScoreRow[]) {
  return rows
    .filter((row) => !row.is_delete_score_assessment)
    .map((row) => mapAssessmentScoreRow(row))
    .sort(
      (first, second) =>
        getAssessmentScoreTime(second) - getAssessmentScoreTime(first),
    );
}

function getAssessmentScoreTime(row: AssessmentScoreResult) {
  const timestamp = new Date(row.timestamp).getTime();

  if (Number.isFinite(timestamp)) {
    return timestamp;
  }

  return Number(row.id) || 0;
}

export async function validateAssessmentPhone(
  phone: string,
): Promise<AssessmentValidationResult> {
  const normalizedPhone = phone.trim();

  if (!phonePattern.test(normalizedPhone)) {
    throw new Error("Nomor Whatsapp wajib diawali 628 dan berisi angka.");
  }

  if (!shouldUseMockAssessmentData) {
    try {
      const response = await api.post(assessmentValidatePhoneEndpoint, {
        phone: normalizedPhone,
      });

      return normalizeValidationResponse(
        getResponseData<BackendAssessmentValidationResponse>(response),
        normalizedPhone,
      );
    } catch (error) {
      const backendMessage = getBackendErrorMessage(error);
      const validationPayload = getValidationPayloadFromError(error);

      if (
        validationPayload &&
        (hasParticipantFields(validationPayload) ||
          validationPayload.status === "registered" ||
          validationPayload.participant)
      ) {
        return normalizeValidationResponse(validationPayload, normalizedPhone);
      }

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 400 &&
        isAlreadyAssessedMessage(backendMessage)
      ) {
        throw new Error(backendMessage);
      }

      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 400 || error.response?.status === 404)
      ) {
        return {
          status: "new",
          phone: normalizedPhone,
          message: "Silahkan lanjutkan untuk mengisi data keluarga anda.",
        };
      }

      throw error;
    }
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
    const response = await api.get(assessmentReadEndpoint);

    return mapAssessmentReadRows(
      getResponseData<BackendAssessmentReadRow[]>(response),
    );
  }

  return [...assessmentResults].sort(
    (first, second) => getAssessmentTime(second) - getAssessmentTime(first),
  );
}

export async function submitAssessment(
  payload: AssessmentSubmitPayload,
): Promise<void> {
  if (shouldUseMockAssessmentData) {
    return;
  }

  await api.post(assessmentEndpoint, mapAssessmentSubmitPayload(payload));
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
    const response = await api.get(assessmentScoreReadEndpoint);

    return mapAssessmentScoreRows(
      getResponseData<BackendAssessmentScoreRow[]>(response),
    );
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
  }).sort(
    (first, second) =>
      getAssessmentScoreTime(second) - getAssessmentScoreTime(first),
  );
}
