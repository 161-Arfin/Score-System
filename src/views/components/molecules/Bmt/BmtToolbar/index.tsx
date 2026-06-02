import { Search } from "lucide-react";
import type { UnitBmtFilters } from "@/features/bmt/types";

type BmtToolbarProps = {
  filters: UnitBmtFilters;
  onFiltersChange: (filters: UnitBmtFilters) => void;
};

export default function BmtToolbar({
  filters,
  onFiltersChange,
}: BmtToolbarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={filters.search}
          placeholder="Cari nama unit"
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-800 focus:ring-2 focus:ring-cyan-800/10"
        />
      </label>
    </div>
  );
}
