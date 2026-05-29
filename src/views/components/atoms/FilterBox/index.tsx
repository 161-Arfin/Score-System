import { ChevronDown } from "lucide-react";

type FilterBoxProps = {
  label: string;
  value: string;
};

export default function FilterBox({ label, value }: FilterBoxProps) {
  return (
    <button
      type="button"
      className="flex min-h-16 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left shadow-sm transition hover:border-cyan-800/40 focus:outline-none focus:ring-2 focus:ring-cyan-800/15"
    >
      <span>
        <span className="block text-xs font-semibold uppercase text-slate-500">
          {label}
        </span>
        <span className="mt-1 block text-sm font-semibold text-slate-900">
          {value}
        </span>
      </span>
      <ChevronDown className="h-4 w-4 text-cyan-800" strokeWidth={2} />
    </button>
  );
}
