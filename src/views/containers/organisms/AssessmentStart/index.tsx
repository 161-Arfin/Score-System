import { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import {
  assessmentConfirmation,
  assessmentFamilyMemberOptions,
  assessmentSections,
  assessmentUnitBmtOptions,
  assessmentWelcome,
} from "@/features/assessment/constants";
import { submitAssessment } from "@/features/assessment/services/assessment.service";
import type {
  AssessmentParticipant,
  AssessmentValidationResult,
} from "@/features/assessment/types";
import DropdownField from "@/views/components/atoms/DropdownField";
import AssessmentPhoneDialog from "@/views/components/molecules/Assessment/AssessmentPhoneDialog";
import AssessmentQuestionSection from "@/views/components/molecules/Assessment/AssessmentQuestionSection";

export default function AssessmentStart() {
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [validationResult, setValidationResult] =
    useState<AssessmentValidationResult | null>(null);
  const [participantPayload, setParticipantPayload] =
    useState<AssessmentParticipant | null>(null);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const answersFormik = useFormik<Record<string, number>>({
    initialValues: {},
    onSubmit: () => setIsSubmitted(true),
  });

  useEffect(() => {
    if (validationResult || isAssessmentStarted || isSubmitted) {
      const scrollRoot = document.getElementById("assessment-scroll-root");

      if (scrollRoot) {
        scrollRoot.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSectionIndex, isAssessmentStarted, isSubmitted, validationResult]);

  if (validationResult) {
    const isRegistered = validationResult.status === "registered";
    const participant = isRegistered ? validationResult.participant : null;
    const validatedPhone =
      validationResult.status === "registered"
        ? validationResult.participant.phone
        : validationResult.phone;
    const currentSection = assessmentSections[currentSectionIndex];
    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === assessmentSections.length - 1;
    const isCurrentSectionComplete = currentSection.questions.every(
      (question) => answersFormik.values[question.id] !== undefined
    );
    const handleSubmitAssessment = async () => {
      if (!participantPayload || !isCurrentSectionComplete) {
        return;
      }

      try {
        setSubmitError("");
        setIsSubmittingAssessment(true);
        await submitAssessment({
          participant: participantPayload,
          answers: Object.entries(answersFormik.values).map(
            ([questionId, score]) => ({
              questionId,
              score,
            }),
          ),
        });
        setIsSubmitted(true);
      } catch {
        setSubmitError("Assessment belum bisa disimpan. Coba ulangi kembali.");
      } finally {
        setIsSubmittingAssessment(false);
      }
    };

    if (isSubmitted) {
      return (
        <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-12">
          <section className="mx-auto w-full max-w-6xl">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-100 px-6 py-7 sm:px-10">
                <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
                  {assessmentConfirmation.title}
                </h1>
              </div>

              <div className="px-6 py-8 sm:px-10 sm:py-10">
                <div className="max-w-4xl space-y-6 text-base leading-8 text-slate-700">
                  <p className="font-semibold text-slate-950">
                    {assessmentConfirmation.description[0]}
                  </p>
                  <p>{assessmentConfirmation.description[1]}</p>
                  <p>{assessmentConfirmation.description[2]}</p>
                  <p>{assessmentConfirmation.description[3]}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      );
    }

    if (isAssessmentStarted) {
      return (
        <main className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-12">
          <section className="mx-auto w-full max-w-6xl">
            <AssessmentQuestionSection
              answers={answersFormik.values}
              currentSectionIndex={currentSectionIndex}
              onAnswerChange={(questionId, value) =>
                answersFormik.setFieldValue(questionId, value)
              }
              section={currentSection}
              totalSections={5}
            />

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                disabled={isSubmittingAssessment}
                onClick={() => {
                  if (isFirstSection) {
                    setIsAssessmentStarted(false);
                    return;
                  }

                  setCurrentSectionIndex((currentIndex) => currentIndex - 1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={!isCurrentSectionComplete || isSubmittingAssessment}
                onClick={async () => {
                  if (!isCurrentSectionComplete) {
                    return;
                  }

                  if (!isLastSection) {
                    setCurrentSectionIndex((currentIndex) => currentIndex + 1);
                    return;
                  }

                  await handleSubmitAssessment();
                }}
                className="rounded-lg bg-[#006B80] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#00586A] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isLastSection
                  ? isSubmittingAssessment
                    ? "Menyimpan..."
                    : "Simpan Assessment"
                  : "Lanjut"}
              </button>
            </div>
            {submitError ? (
              <p className="mt-3 text-right text-sm font-semibold text-red-600">
                {submitError}
              </p>
            ) : null}
          </section>
        </main>
      );
    }

    return (
      <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-12">
        <section className="mx-auto w-full max-w-6xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-md font-semibold text-slate-950">
                  {validationResult.message}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  No. Whatsapp: {validatedPhone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValidationResult(null);
                  setIsPhoneDialogOpen(true);
                }}
                className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Ganti Nomor
              </button>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                kepala_keluarga: participant?.kepala_keluarga ?? "",
                nama_istri: participant?.nama_istri ?? "",
                phone: validatedPhone,
                jml_anggota: participant?.jml_anggota ?? "",
                instansi_id: participant?.instansi_id ?? "",
                instansi_name: participant?.instansi_name ?? "",
                alamat: participant?.alamat ?? "",
              }}
              validateOnMount
              validate={(formValues) => {
                const errors: Partial<Record<keyof typeof formValues, string>> =
                  {};

                if (!formValues.kepala_keluarga.trim()) {
                  errors.kepala_keluarga =
                    "Nama kepala keluarga wajib diisi.";
                }

                if (!formValues.nama_istri.trim()) {
                  errors.nama_istri = "Nama istri wajib diisi.";
                }

                if (!formValues.alamat.trim()) {
                  errors.alamat = "Alamat wajib diisi.";
                }

                if (!formValues.jml_anggota) {
                  errors.jml_anggota = "Jumlah anggota wajib dipilih.";
                }

                if (!isRegistered && !formValues.instansi_id) {
                  errors.instansi_id = "Unit BMT wajib dipilih.";
                }

                return errors;
              }}
              onSubmit={(formValues) => {
                const selectedUnit = assessmentUnitBmtOptions.find(
                  (option) => option.value === formValues.instansi_id,
                );

                setParticipantPayload({
                  kepala_keluarga: formValues.kepala_keluarga,
                  nama_istri: formValues.nama_istri,
                  phone: formValues.phone,
                  jml_anggota: formValues.jml_anggota,
                  instansi_id: formValues.instansi_id,
                  instansi_name:
                    formValues.instansi_name ?? selectedUnit?.label ?? "",
                  alamat: formValues.alamat,
                });
                setCurrentSectionIndex(0);
                setIsAssessmentStarted(true);
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
                setFieldValue,
                touched,
                values: formValues,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">
                      Nama Kepala Keluarga
                    </span>
                    <input
                      name="kepala_keluarga"
                      value={formValues.kepala_keluarga}
                      readOnly={isRegistered}
                      placeholder="Masukkan nama kepala keluarga"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#006B80] focus:ring-2 focus:ring-[#006B80]/10 read-only:bg-slate-100"
                    />
                    {touched.kepala_keluarga && errors.kepala_keluarga ? (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {errors.kepala_keluarga}
                      </p>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">
                      Nama Istri
                    </span>
                    <input
                      name="nama_istri"
                      value={formValues.nama_istri}
                      readOnly={isRegistered}
                      placeholder="Masukkan nama istri"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#006B80] focus:ring-2 focus:ring-[#006B80]/10 read-only:bg-slate-100"
                    />
                    {touched.nama_istri && errors.nama_istri ? (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {errors.nama_istri}
                      </p>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">
                      No. Whatsapp
                    </span>
                    <input
                      name="phone"
                      value={formValues.phone}
                      readOnly
                      className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm text-slate-950 outline-none"
                    />
                  </label>

                  <div className="block">
                    {isRegistered ? (
                      <>
                        <span className="text-sm font-semibold text-slate-600">
                          Jumlah Anggota Keluarga
                        </span>
                        <input
                          name="jml_anggota"
                          value={formValues.jml_anggota}
                          readOnly
                          className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm text-slate-950 outline-none"
                        />
                      </>
                    ) : (
                      <DropdownField
                        label="Jumlah Anggota Keluarga"
                        name="jml_anggota"
                        value={formValues.jml_anggota}
                        onChange={(value) =>
                          setFieldValue("jml_anggota", value)
                        }
                        options={assessmentFamilyMemberOptions}
                        placeholder="Pilih jumlah anggota"
                      />
                    )}
                    {touched.jml_anggota && errors.jml_anggota ? (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {errors.jml_anggota}
                      </p>
                    ) : null}
                  </div>

                  <div className="block">
                    {isRegistered ? (
                      <>
                        <span className="text-sm font-semibold text-slate-600">
                          Unit BMT
                        </span>
                        <input
                          name="instansi_name"
                          value={formValues.instansi_name}
                          readOnly
                          className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm text-slate-950 outline-none"
                        />
                      </>
                    ) : (
                      <DropdownField
                        label="Unit BMT"
                        name="instansi_id"
                        value={formValues.instansi_id}
                        onChange={(value) => setFieldValue("instansi_id", value)}
                        options={assessmentUnitBmtOptions}
                        placeholder="Pilih unit BMT"
                      />
                    )}
                    {touched.instansi_id && errors.instansi_id ? (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {errors.instansi_id}
                      </p>
                    ) : null}
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">
                      Alamat
                    </span>
                    <input
                      name="alamat"
                      value={formValues.alamat}
                      readOnly={isRegistered}
                      placeholder="Masukkan alamat lengkap"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#006B80] focus:ring-2 focus:ring-[#006B80]/10 read-only:bg-slate-100"
                    />
                    {touched.alamat && errors.alamat ? (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {errors.alamat}
                      </p>
                    ) : null}
                  </label>

                  <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => setValidationResult(null)}
                      className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={!isValid}
                      className="rounded-lg bg-[#006B80] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#00586A] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                    >
                      Lanjut ke Pertanyaan
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </section>

        <AssessmentPhoneDialog
          isOpen={isPhoneDialogOpen}
          onClose={() => setIsPhoneDialogOpen(false)}
          onValidated={(result) => {
            setValidationResult(result);
            setParticipantPayload(null);
            setIsAssessmentStarted(false);
            setCurrentSectionIndex(0);
            setIsSubmitted(false);
            setSubmitError("");
            answersFormik.resetForm();
          }}
        />
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-12">
      <section className="mx-auto w-full max-w-6xl">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 px-6 py-7 sm:px-10">
            <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
              {assessmentWelcome.title}
            </h1>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="max-w-4xl space-y-6 text-base leading-8 text-slate-700">
              <p className="font-semibold text-slate-950">
                {assessmentWelcome.description[0]}
              </p>
              <div className="space-y-2">
                <p>{assessmentWelcome.description[1]}</p>
                <p>{assessmentWelcome.description[2]}</p>
              </div>
              <div className="space-y-2">
                <p>{assessmentWelcome.description[3]}</p>
                <p>{assessmentWelcome.description[4]}</p>
              </div>
              <p>{assessmentWelcome.description[5]}</p>
              <div className="space-y-2">
                <p>{assessmentWelcome.description[6]}</p>
                <p className="font-semibold text-slate-950">
                  {assessmentWelcome.description[7]}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => setIsPhoneDialogOpen(true)}
                className="rounded-lg bg-[#006B80] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#00586A] focus:outline-none focus:ring-2 focus:ring-[#006B80]/20"
              >
                Mulai Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
      <AssessmentPhoneDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        onValidated={(result) => {
          setValidationResult(result);
          setParticipantPayload(null);
          setIsAssessmentStarted(false);
          setCurrentSectionIndex(0);
          setIsSubmitted(false);
          setSubmitError("");
          answersFormik.resetForm();
        }}
      />
    </main>
  );
}
