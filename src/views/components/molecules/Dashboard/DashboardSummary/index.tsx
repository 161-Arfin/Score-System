import {
  BadgeCheck,
  ClipboardCheck,
  Crown,
  Gem,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DashboardStat, DashboardStatIconKey } from "@/features/dashboard/types";
import StatCard from "@/views/components/atoms/StatCard";

type DashboardSummaryProps = {
  stats: DashboardStat[];
};

const statIconMap: Record<DashboardStatIconKey, LucideIcon> = {
  families: Users,
  average: BadgeCheck,
  berlian: Gem,
  emas: Crown,
  assessment: ClipboardCheck,
};

export default function DashboardSummary({ stats }: DashboardSummaryProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          caption={stat.caption}
          icon={statIconMap[stat.iconKey] ?? Trophy}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </section>
  );
}
