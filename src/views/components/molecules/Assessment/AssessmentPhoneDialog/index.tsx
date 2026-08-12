import { useState } from "react";
import { useFormik } from "formik";
import { validateAssessmentPhone } from "@/features/assessment/services/assessment.service";
import type { AssessmentValidationResult } from "@/features/assessment/types";

type AssessmentPhoneDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onValidated: (result: AssessmentValidationResult) => void;
};

export function normalizePhoneNumber(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("08")) {
    digits = "628" + digits.slice(2);
  } else if (digits.startsWith("8")) {
    digits = "628" + digits.slice(1);
  } else if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  }

  return digits;
}

export default function AssessmentPhoneDialog({
  isOpen,
  onClose,
  onValidated,
}: AssessmentPhoneDialogProps) {
  const [error, setError] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validateOnMount: true,
    validate: (values) => {
      const errors: Partial<Record<"phone", string>> = {};
      const phone = values.phone;

      if (!phone) {
        errors.phone = "Nomor Whatsapp wajib diisi.";
      } else if (!/^628[1-9][0-9]{7,12}$/.test(phone)) {
        errors.phone =
          "Nomor Whatsapp tidak valid";
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
        const message =
          validationError instanceof Error
            ? validationError.message
            : "Nomor Whatsapp tidak valid.";

        if (message.toLowerCase().includes("sudah")) {
          setNoticeMessage(message);
          return;
        }

        setError(message);
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
    setNoticeMessage("");
    setIsSubmitting(false);
    formik.resetForm();
    onClose();
  };

  const displayPhone = formik.values.phone.startsWith("62")
    ? formik.values.phone.slice(2)
    : formik.values.phone;

  if (noticeMessage) {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/40 px-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
          <div className="px-6 pb-6 pt-7">
            <h2 className="text-2xl font-bold tracking-normal text-slate-950">
              Assessment sudah tercatat
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Data untuk nomor ini sudah masuk pada periode assessment berjalan.
            </p>
            <div className="mt-5 rounded border border-cyan-100 bg-cyan-50/70 px-4 py-4">
              <p className="text-base font-semibold leading-7 text-slate-800 first-letter:uppercase">
                {noticeMessage}
              </p>
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <button
              type="button"
              onClick={() => setNoticeMessage("")}
              className="rounded-lg bg-[#3E9E9E] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#2F7F80] focus:outline-none focus:ring-2 focus:ring-[#3E9E9E]/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <label htmlFor="assessment-phone" className="block text-sm font-semibold text-slate-600">
            Nomor Whatsapp
          </label>
          <div className="relative mt-2 flex h-12 w-full items-center rounded-lg border border-slate-300 bg-white transition focus-within:border-[#3E9E9E] focus-within:ring-2 focus-within:ring-[#3E9E9E]/10">
            <div className="flex h-full items-center justify-center rounded-l-lg border-r border-slate-200 bg-slate-50 px-3.5 text-md font-bold text-slate-700">
              <span>62</span>
            </div>
            <input
              id="assessment-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={displayPhone}
              onChange={(e) => {
                const cleaned = normalizePhoneNumber(e.target.value);
                formik.setFieldValue("phone", cleaned);
              }}
              onBlur={formik.handleBlur}
              placeholder="81234567890"
              className="h-full w-full rounded-r-lg px-3.5 text-base font-medium text-slate-950 outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Anda bisa mengetik diawali 08, 8, atau 62.
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
              className="rounded-lg bg-[#3E9E9E] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2F7F80] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Memeriksa..." : "Lanjut"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
