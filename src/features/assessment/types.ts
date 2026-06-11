export type AssessmentParticipant = {
  kepala_keluarga: string;
  nama_istri: string;
  alamat: string;
  phone: string;
  jml_anggota: string;
  instansi_id: string;
  instansi_name: string;
};

export type AssessmentValidationResult =
  | {
      status: "registered";
      participant: AssessmentParticipant;
      message: string;
    }
  | {
      status: "new";
      phone: string;
      message: string;
    };

export type AssessmentAnswerOption = {
  label: string;
  value: number;
};

export type AssessmentQuestion = {
  id: string;
  indicator: string;
  scoreRange: string;
  options: AssessmentAnswerOption[];
};

export type AssessmentSection = {
  id: string;
  title: string;
  subtitle: string;
  weight: string;
  questions: AssessmentQuestion[];
};

export type AssessmentAnswerScore = {
  questionId: string;
  score: number;
};

export type AssessmentResult = {
  id: string;
  kepala_keluarga: string;
  nama_istri: string;
  alamat: string;
  phone: string;
  instansi_name: string;
  source: "Link Form" | "Chat Bot Whatsapp";
  submittedAt: string;
  answers: AssessmentAnswerScore[];
};

export type AssessmentDimensionScore = {
  key:
    | "hifzAdDin"
    | "hifzAnNafs"
    | "hifzAlAql"
    | "hifzAnNasl"
    | "hifzAlMal";
  label: string;
  score: number;
  status: string;
};

export type AssessmentScoreResult = {
  id: string;
  timestamp: string;
  kepala_keluarga: string;
  nama_istri: string;
  phone: string;
  instansi_name: string;
  tanggal_assessment: string;
  hifzAdDinScore: number;
  hifzAnNafsScore: number;
  hifzAlAqlScore: number;
  hifzAnNaslScore: number;
  hifzAlMalScore: number;
  totalSakinahScore: number;
  tier: string;
  statusAdDin: string;
  statusAnNafs: string;
  statusAlAql: string;
  statusAnNasl: string;
  statusAlMal: string;
  dimensiTertinggi: string;
  dimensiTerendah: string;
};

export type AssessmentSubmitPayload = {
  participant: AssessmentParticipant;
  answers: AssessmentAnswerScore[];
};
