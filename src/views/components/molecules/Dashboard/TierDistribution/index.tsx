import type { CSSProperties } from "react";
import { tierColorMap } from "@/features/dashboard/constants";
import type { TierDistributionItem } from "@/features/dashboard/types";

type TierDistributionProps = {
  items: TierDistributionItem[];
};

export default function TierDistribution({ items }: TierDistributionProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const segments = items.reduce(
    (result, item) => {
      const end = result.current + item.value;

      return {
        current: end,
        values: [
          ...result.values,
          `${tierColorMap[item.tier]} ${result.current}% ${end}%`,
        ],
      };
    },
    { current: 0, values: [] as string[] },
  ).values;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Distribusi Tier
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Komposisi keluarga binaan
          </h2>
        </div>
        {/* <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
          {total} keluarga
        </span> */}
      </div>

      <div className="mt-6 grid items-center gap-6 sm:grid-cols-[160px_1fr]">
        <div
          aria-label="Pie chart distribusi tier"
          className="mx-auto h-36 w-36 rounded-full shadow-inner ring-8 ring-slate-50"
          style={
            {
              background: `conic-gradient(${segments.join(", ")})`,
            } as CSSProperties
          }
        />

        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.tier}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tierColorMap[item.tier] }}
                />
                <span className="text-sm font-medium text-slate-600">
                  {item.tier}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
