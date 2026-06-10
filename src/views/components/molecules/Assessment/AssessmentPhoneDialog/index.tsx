import { useState } from "react";
import { useFormik } from "formik";
import { validateAssessmentPhone } from "@/features/assessment/services/assessment.service";
import type { AssessmentValidationResult } from "@/features/assessment/types";

type AssessmentPhoneDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onValidated: (result: AssessmentValidationResult) => void;
};

export default function AssessmentPhoneDialog({
  isOpen,
  onClose,
  onValidated,
}: AssessmentPhoneDialogProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validateOnMount: true,
    validate: (values) => {
      const errors: Partial<Record<"phone", string>> = {};

      if (!/^628[0-9]{7,15}$/.test(values.phone)) {
        errors.phone = "Nomor Whatsapp wajib diawali 628.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setError("");
      setIsSubmitting(true);

      try {
        const result = await validateAssessmentPhone(values.phone);
        onValidated(result);
        handleClose();
      } catch (validationError) {
        setError(
          validationError instanceof Error
            ? validationError.message
            : "Nomor Whatsapp tidak valid."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setError("");
    setIsSubmitting(false);
    formik.resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              Masukkan No. Whatsapp
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-xl leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            aria-label="Tutup modal"
          >
            x
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-6 py-4">
          <input
            id="assessment-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="6281212345678"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#006B80] focus:ring-2 focus:ring-[#006B80]/10"
          />
          <p className="mt-2 text-sm text-slate-500">
            Silahkan masukkan nomor Whatsapp anda.
          </p>
          {formik.touched.phone && formik.errors.phone ? (
            <p className="mt-2 text-sm font-semibold text-red-600">
              {formik.errors.phone}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className="rounded-lg bg-[#006B80] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#00586A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Memeriksa..." : "Lanjut"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
