import { Activity, TrendingUp, TrendingDown, Target, Award, AlertTriangle } from "lucide-react";
import { StatCard, EmptyState } from "./ui";
import { fmt } from "../utils";

export default function StatsSection({ displayedStats }) {
  if (!displayedStats) return <EmptyState />;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-400" />
        Στατιστικά — {displayedStats.label}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard label="Συνολικά Trades" value={displayedStats.total} />
        <StatCard label="Wins" value={displayedStats.wins} tone="positive" icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="Losses" value={displayedStats.losses} tone="negative" icon={<TrendingDown className="w-4 h-4" />} />
        <StatCard
          label="Win Rate"
          value={`${fmt(displayedStats.winRate)}%`}
          tone={displayedStats.winRate >= 50 ? "positive" : "negative"}
          icon={<Target className="w-4 h-4" />}
        />
        <StatCard
          label="Συνολικό P/L (€)"
          value={`${displayedStats.totalEur >= 0 ? "+" : ""}${fmt(displayedStats.totalEur)} €`}
          tone={displayedStats.totalEur >= 0 ? "positive" : "negative"}
          large
        />
        <StatCard
          label="Συνολικό P/L (%)"
          value={`${displayedStats.totalPct >= 0 ? "+" : ""}${fmt(displayedStats.totalPct)}%`}
          tone={displayedStats.totalPct >= 0 ? "positive" : "negative"}
          large
        />
        <StatCard
          label="Μέσο P/L / Trade"
          value={`${displayedStats.avgEur >= 0 ? "+" : ""}${fmt(displayedStats.avgEur)} €`}
          tone={displayedStats.avgEur >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Καλύτερο / Χειρότερο"
          value={
            <div className="space-y-0.5 text-xs">
              <div className="text-emerald-400 font-mono flex items-center gap-1">
                <Award className="w-3 h-3" />
                {displayedStats.best ? `+${fmt(displayedStats.best.plEur)} € · ${displayedStats.best.asset}` : "—"}
              </div>
              <div className="text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {displayedStats.worst ? `${fmt(displayedStats.worst.plEur)} € · ${displayedStats.worst.asset}` : "—"}
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
