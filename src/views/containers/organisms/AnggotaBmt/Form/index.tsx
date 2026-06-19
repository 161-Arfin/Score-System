import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  createAnggotaBmt,
  getAnggotaBmtById,
  updateAnggotaBmt,
} from "@/features/anggota-bmt/services/anggota-bmt.service";
import type { AnggotaBmtPayload } from "@/features/anggota-bmt/types";
import { getUnitBmtList } from "@/features/bmt/services/bmt.service";
import type { UnitBmt } from "@/features/bmt/types";
import AnggotaBmtForm from "@/views/components/molecules/AnggotaBmt/AnggotaBmtForm";

const initialValues: AnggotaBmtPayload = {
  kepala_keluarga: "",
  nama_istri: "",
  address: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
  phone: "",
  jml_anggota: 0,
  instansi_id: 0,
};

function getSubmitErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Data Anggota BMT belum bisa disimpan.";
  }

  const responseData = error.response?.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData &&
    typeof responseData.message === "string"
  ) {
    return responseData.message;
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  return "Data Anggota BMT belum bisa disimpan.";
}

type AnggotaBmtFormContainerProps = {
  mode?: "create" | "edit";
};

export default function AnggotaBmtFormContainer({
  mode = "create",
}: AnggotaBmtFormContainerProps) {
  const router = useRouter();
  const anggotaId = typeof router.query.id === "string" ? router.query.id : "";
  const [values, setValues] = useState<AnggotaBmtPayload>(initialValues);
  const [unitOptions, setUnitOptions] = useState<UnitBmt[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoadingOptions(true);
        setErrorMessage("");

        const response = await getUnitBmtList();
        setUnitOptions(response.data);
      } catch {
        setErrorMessage("Pilihan Unit BMT belum bisa dimuat.");
      } finally {
        setIsLoadingOptions(false);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !anggotaId) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoadingDetail(true);
        setErrorMessage("");

        const anggota = await getAnggotaBmtById(anggotaId);

        setValues({
          kepala_keluarga: anggota.kepala_keluarga,
          nama_istri: anggota.nama_istri,
          address: anggota.address,
          kecamatan: anggota.kecamatan,
          kabupaten: anggota.kabupaten,
          provinsi: anggota.provinsi,
          phone: anggota.phone,
          jml_anggota: anggota.jml_anggota,
          instansi_id: anggota.instansi_id,
        });
      } catch {
        setErrorMessage("Detail Anggota BMT belum bisa dimuat.");
      } finally {
        setIsLoadingDetail(false);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [anggotaId, mode]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (mode === "edit") {
        await updateAnggotaBmt(anggotaId, values);
      } else {
        await createAnggotaBmt(values);
      }

      await router.push("/anggota-bmt");
    } catch (error) {
      setErrorMessage(getSubmitErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          {mode === "edit" ? "Edit Anggota BMT" : "Tambah Anggota BMT"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Silahkan isi data lengkap keluarga anggota BMT pada form berikut.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-sm">
          {errorMessage}
        </div>
      ) : null}

      {isLoadingOptions || isLoadingDetail ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            {isLoadingDetail
              ? "Memuat detail Anggota BMT..."
              : "Memuat pilihan Unit BMT..."}
          </p>
        </div>
      ) : (
        <AnggotaBmtForm
          isSubmitting={isSubmitting}
          unitOptions={unitOptions}
          values={values}
          onCancel={() => router.push("/anggota-bmt")}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
