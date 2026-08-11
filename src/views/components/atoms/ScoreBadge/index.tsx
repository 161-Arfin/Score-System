type ScoreBadgeProps = {
  tier: string;
};

const tierClassName: Record<string, string> = {
  Berlian: "border-sky-200 bg-sky-50 text-sky-700",
  Emas: "border-lime-200 bg-lime-50 text-lime-700",
  Perak: "border-slate-200 bg-slate-50 text-slate-700",
  Perunggu: "border-orange-200 bg-orange-50 text-orange-700",
  Merah: "border-red-200 bg-red-50 text-red-700",
};

export default function ScoreBadge({ tier }: ScoreBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tierClassName[tier] ?? "border-slate-200 bg-slate-50 text-slate-700",
      ].join(" ")}
    >
      {tier}
    </span>
  );
}
