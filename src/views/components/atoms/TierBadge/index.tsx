import { Crown, Gem, ShieldCheck, AlertTriangle, Flame } from "lucide-react";

type Tier = "BERLIAN" | "EMAS" | "PERAK" | "PERUNGGU" | "MERAH";

type TierBadgeProps = {
  tier: Tier;
};

const tierConfig = {
  BERLIAN: {
    icon: Gem,
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  EMAS: {
    icon: Crown,
    className: "bg-lime-50 text-lime-700 border-lime-200",
  },
  PERAK: {
    icon: ShieldCheck,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  PERUNGGU: {
    icon: AlertTriangle,
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  MERAH: {
    icon: Flame,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function TierBadge({ tier }: TierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {tier}
    </span>
  );
}
