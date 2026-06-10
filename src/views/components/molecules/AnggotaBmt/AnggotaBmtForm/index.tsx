import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useFormik } from "formik";
import { ChevronDown } from "lucide-react";
import { jumlahAnggotaOptions } from "@/features/anggota-bmt/constants";
import {
  getDistrictOptions,
  getProvinceOptions,
  getRegencyOptions,
  type RegionOption,
} from "@/features/anggota-bmt/services/region.service";
import type { AnggotaBmtPayload } from "@/features/anggota-bmt/types";
import type { UnitBmt } from "@/features/bmt/types";

type AnggotaBmtFormProps = {
  values: AnggotaBmtPayload;
  unitOptions: UnitBmt[];
  isSubmitting: boolean;
  onChange: (values: AnggotaBmtPayload) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

function SelectField({
  disabled = false,
  label,
  onChange,
  options,
  placeholder,
  value,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  const calculatePanelStyle = useCallback(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const viewportPadding = 12;
    const panelGap = 6;
    const preferredMaxHeight = 280;
    const placeholderHeight = 36;
    const optionHeight = 36;
    const estimatedPanelHeight = Math.min(
      preferredMaxHeight,
      placeholderHeight + options.length * optionHeight
    );
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenTop =
      spaceBelow < estimatedPanelHeight && spaceAbove > spaceBelow;
    const availableHeight = shouldOpenTop
      ? rect.top - viewportPadding
      : window.innerHeight - rect.bottom - viewportPadding;
    const maxHeight = Math.max(
      120,
      Math.min(preferredMaxHeight, availableHeight + (shouldOpenTop ? 28 : 0))
    );
    const panelHeight = Math.min(maxHeight, estimatedPanelHeight);

    setPanelStyle({
      left: rect.left,
      top: shouldOpenTop
        ? Math.max(viewportPadding, rect.top - panelHeight - panelGap)
        : rect.bottom + panelGap,
      width: rect.width,
      maxHeight,
    });
  }, [options.length]);

  const toggleDropdown = () => {
    if (disabled) {
      return;
    }

    calculatePanelStyle();

    setIsOpen((current) => !current);
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !wrapperRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleViewportChange = () => calculatePanelStyle();

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [calculatePanelStyle, isOpen]);

  return (
    <div ref={wrapperRef} className="relative space-y-2">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className={[
          "flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 text-left text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          value ? "text-slate-950" : "text-slate-500",
        ].join(" ")}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronDown
          className={[
            "ml-3 h-4 w-4 shrink-0 text-slate-500 transition",
            isOpen ? "rotate-180 text-cyan-800" : "",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>

      {isOpen && !disabled && typeof document !== "undefined"
        ? createPortal(
        <div
          ref={panelRef}
          style={panelStyle}
          className="fixed z-50 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10"
        >
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="block w-full px-3.5 py-2 text-left text-sm font-medium leading-5 text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-800"
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={[
                "block w-full px-3.5 py-2 text-left text-sm font-medium leading-5 transition hover:bg-cyan-50 hover:text-cyan-800",
                option.value === value
                  ? "bg-cyan-50 text-cyan-800"
                  : "text-slate-700",
              ].join(" ")}
            >
              {option.label}
            </button>
          ))}
        </div>,
          document.body
        )
        : null}
    </div>
  );
}

export default function AnggotaBmtForm({
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  unitOptions,
  values,
}: AnggotaBmtFormProps) {
  const [provinceOptions, setProvinceOptions] = useState<RegionOption[]>([]);
  const [regencyOptions, setRegencyOptions] = useState<RegionOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<RegionOption[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const formik = useFormik<AnggotaBmtPayload>({
    enableReinitialize: true,
    initialValues: values,
    validateOnMount: true,
    validate: (formValues) => {
      const errors: Partial<Record<keyof AnggotaBmtPayload, string>> = {};

      if (!formValues.kepala_keluarga.trim()) {
        errors.kepala_keluarga = "Nama kepala keluarga wajib diisi.";
      }

      if (!formValues.nama_istri.trim()) {
        errors.nama_istri = "Nama istri wajib diisi.";
      }

      if (!formValues.alamat.trim()) {
        errors.alamat = "Alamat wajib diisi.";
      }

      if (!formValues.provinsi) {
        errors.provinsi = "Provinsi wajib dipilih.";
      }

      if (!formValues.kabupaten) {
        errors.kabupaten = "Kabupaten wajib dipilih.";
      }

      if (!formValues.kecamatan) {
        errors.kecamatan = "Kecamatan wajib dipilih.";
      }

      if (!/^628[0-9]{7,15}$/.test(formValues.phone)) {
        errors.phone = "Nomor Whatsapp wajib berawalan 628.";
      }

      if (!formValues.jml_anggota) {
        errors.jml_anggota = "Jumlah anggota wajib dipilih.";
      }

      if (!formValues.instansi_id) {
        errors.instansi_id = "Unit BMT wajib dipilih.";
      }

      return errors;
    },
    onSubmit: (formValues) => {
      onChange(formValues);
      onSubmit();
    },
  });
  const formValues = formik.values;

  const selectedProvince = useMemo(
    () => provinceOptions.find((option) => option.name === formValues.provinsi),
    [provinceOptions, formValues.provinsi]
  );
  const selectedRegency = useMemo(
    () => regencyOptions.find((option) => option.name === formValues.kabupaten),
    [regencyOptions, formValues.kabupaten]
  );

  const updateField = (name: keyof AnggotaBmtPayload, value: string) => {
    const nextValues = {
      ...formik.values,
      [name]: value,
    };

    formik.setFieldValue(name, value);
    onChange(nextValues);
  };

  const updateProvince = (value: string) => {
    const nextValues = {
      ...formik.values,
      provinsi: value,
      kabupaten: "",
      kecamatan: "",
    };

    formik.setValues(nextValues);
    onChange(nextValues);
  };

  const updateRegency = (value: string) => {
    const nextValues = {
      ...formik.values,
      kabupaten: value,
      kecamatan: "",
    };

    formik.setValues(nextValues);
    onChange(nextValues);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingProvinces(true);
      const options = await getProvinceOptions();
      setProvinceOptions(options);
      setIsLoadingProvinces(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      const timeoutId = window.setTimeout(() => {
        setRegencyOptions([]);
        setDistrictOptions([]);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(async () => {
      setIsLoadingRegencies(true);
      setDistrictOptions([]);
      const options = await getRegencyOptions(selectedProvince.id);
      setRegencyOptions(options);
      setIsLoadingRegencies(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedRegency) {
      const timeoutId = window.setTimeout(() => {
        setDistrictOptions([]);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(async () => {
      setIsLoadingDistricts(true);
      const options = await getDistrictOptions(selectedRegency.id);
      setDistrictOptions(options);
      setIsLoadingDistricts(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [selectedRegency]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            Nama Kepala Keluarga
          </label>
          <input
            required
            name="kepala_keluarga"
            type="text"
            value={formValues.kepala_keluarga}
            placeholder="Bapak Ahmad"
            onChange={(event) =>
              updateField("kepala_keluarga", event.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            Nama Istri
          </label>
          <input
            required
            name="nama_istri"
            type="text"
            value={formValues.nama_istri}
            placeholder="Ibu Siti"
            onChange={(event) => updateField("nama_istri", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-xs font-semibold text-slate-500">
            Alamat (RT/RW/Desa)
          </label>
          <input
            required
            name="alamat"
            type="text"
            value={formValues.alamat}
            placeholder="RT 01/RW 04, Desa Mawar"
            onChange={(event) => updateField("alamat", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
        </div>

        <SelectField
          label="Provinsi"
          value={formValues.provinsi}
          placeholder={
            isLoadingProvinces ? "Memuat provinsi..." : "Pilih provinsi"
          }
          options={provinceOptions.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          disabled={isLoadingProvinces}
          onChange={updateProvince}
        />

        <SelectField
          label="Kabupaten"
          value={formValues.kabupaten}
          placeholder={
            isLoadingRegencies ? "Memuat kabupaten..." : "Pilih kabupaten"
          }
          options={regencyOptions.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          disabled={!formValues.provinsi || isLoadingRegencies}
          onChange={updateRegency}
        />

        <SelectField
          label="Kecamatan"
          value={formValues.kecamatan}
          placeholder={
            isLoadingDistricts ? "Memuat kecamatan..." : "Pilih kecamatan"
          }
          options={districtOptions.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          disabled={!formValues.kabupaten || isLoadingDistricts}
          onChange={(value) => updateField("kecamatan", value)}
        />

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            No. Whatsapp
          </label>
          <input
            required
            name="phone"
            type="tel"
            pattern="^628[0-9]{7,15}$"
            title="Gunakan format nomor berawalan 628, contoh 6281212345678"
            value={formValues.phone}
            placeholder="6281212345678"
            onChange={(event) => updateField("phone", event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
          />
          <p className="text-xs text-slate-500">
            Format nomor wajib berawalan 628.
          </p>
        </div>

        <SelectField
          label="Jumlah Anggota Keluarga"
          value={formValues.jml_anggota}
          placeholder="Pilih jumlah anggota"
          options={jumlahAnggotaOptions.map((option) => ({
            label: option,
            value: option,
          }))}
          onChange={(value) => updateField("jml_anggota", value)}
        />

        <SelectField
          label="Unit BMT"
          value={formValues.instansi_id}
          placeholder="Pilih unit BMT"
          options={unitOptions.map((unit) => ({
            label: unit.instansi_name,
            value: unit.id,
          }))}
          onChange={(value) => updateField("instansi_id", value)}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formik.isValid}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-cyan-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-cyan-800/50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
