import type { DashboardFilterOption } from "@/features/dashboard/types";
import FilterBox from "@/views/components/atoms/FilterBox";

type DashboardFiltersProps = {
  filters: DashboardFilterOption[];
};

export default function DashboardFilters({ filters }: DashboardFiltersProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {filters.map((filter) => (
        <FilterBox key={filter.label} {...filter} />
      ))}
    </section>
  );
}
