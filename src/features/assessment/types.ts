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
