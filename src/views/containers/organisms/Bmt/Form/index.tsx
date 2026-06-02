import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  createUnitBmt,
  getUnitBmtById,
  updateUnitBmt,
} from "@/features/bmt/services/bmt.service";
import type { UnitBmtPayload } from "@/features/bmt/types";
import BmtForm from "@/views/components/molecules/Bmt/BmtForm";

type BmtFormContainerProps = {
  mode?: "create" | "edit";
};

const initialValues: UnitBmtPayload = {
  instansi_name: "",
  instansi_address: "",
  instansi_phone: "",
};

export default function BmtFormContainer({
  mode = "create",
}: BmtFormContainerProps) {
  const router = useRouter();
  const unitId = typeof router.query.id === "string" ? router.query.id : "";
  const [values, setValues] = useState<UnitBmtPayload>(initialValues);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !unitId) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const unit = await getUnitBmtById(unitId);

        setValues({
          instansi_name: unit.instansi_name,
          instansi_address: unit.instansi_address,
          instansi_phone: unit.instansi_phone,
        });
      } catch {
        setErrorMessage("Detail Unit BMT belum bisa dimuat.");
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [mode, unitId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (mode === "edit") {
        await updateUnitBmt(unitId, values);
      } else {
        await createUnitBmt(values);
      }

      await router.push("/bmt");
    } catch {
      setErrorMessage("Data Unit BMT belum bisa disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        {/* <p className="text-xs font-bold uppercase tracking-wide text-cyan-800">
          Unit BMT
        </p> */}
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          {mode === "edit" ? "Edit Unit BMT" : "Tambah Unit BMT"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Silahkan data lengkap informasi unit BMT pada form berikut.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-sm">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Memuat detail Unit BMT...
          </p>
        </div>
      ) : (
        <BmtForm
          isSubmitting={isSubmitting}
          values={values}
          onCancel={() => router.push("/bmt")}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
