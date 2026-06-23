import DropdownField from "@/views/components/atoms/DropdownField";

type DashboardFiltersProps = {
  selectedUnitId: string;
  unitOptions: Array<{
    label: string;
    value: string;
  }>;
  onUnitChange: (unitId: string) => void;
};

export default function DashboardFilters({
  onUnitChange,
  selectedUnitId,
  unitOptions,
}: DashboardFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mt-1 text-base font-bold text-slate-950">Unit BMT</h2>
        </div>

        <div className="w-full md:w-72">
          <DropdownField
            label=""
            name="dashboard_unit_filter"
            value={selectedUnitId}
            onChange={(value) => onUnitChange(value || "all")}
            options={[{ label: "Semua Unit", value: "all" }, ...unitOptions]}
            placeholder=""
          />
        </div>
      </div>
    </section>
  );
}
