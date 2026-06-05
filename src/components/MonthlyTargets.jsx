import { INITIAL_CAPITAL, MONTHLY_CAPITAL_TARGETS } from "../constants";
import { fmt } from "../utils";
import { monthLabel } from "../utils";

export default function MonthlyTargets({ currentCapital, monthlyStats }) {
  const months = Object.entries(MONTHLY_CAPITAL_TARGETS);

  return (
    <section className="mb-10 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">Μηνιαίοι Στόχοι</h2>
      </div>
      <div className="divide-y divide-slate-800">
        {months.map(([month, target], i) => {
          const prevTarget = i === 0 ? INITIAL_CAPITAL : months[i - 1][1];
          const stats = monthlyStats.find((m) => m.month === month);
          const now = new Date().toISOString().slice(0, 7);
          const isCurrent = month === now;
          const isPast = month < now;
          const endBalance = isPast || isCurrent ? currentCapital : null;
          const actualBalance = isPast
            ? (stats ? INITIAL_CAPITAL + monthlyStats
                .filter((m) => m.month <= month)
                .reduce((s, m) => s + m.totalEur, 0) : prevTarget)
            : isCurrent ? currentCapital : null;

          const progressPct = actualBalance != null && target > prevTarget
            ? Math.min(100, Math.max(0, ((actualBalance - prevTarget) / (target - prevTarget)) * 100))
            : 0;

          const achieved = actualBalance != null && actualBalance >= target;
          const gap = actualBalance != null ? target - actualBalance : null;

          return (
            <div key={month} className={`px-6 py-5 ${isCurrent ? "bg-amber-500/5" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono">Τρέχων</span>}
                  {isPast && achieved && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono">✓ Επιτεύχθηκε</span>}
                  {isPast && !achieved && actualBalance != null && <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono">✗ Δεν επιτεύχθηκε</span>}
                  {!isCurrent && !isPast && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 border border-slate-600 text-slate-500 font-mono">Επόμενος</span>}
                  <span className={`font-semibold ${isCurrent ? "text-white" : isPast ? "text-slate-300" : "text-slate-500"}`}>
                    {monthLabel(month)}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-bold text-lg ${achieved ? "text-emerald-400" : isCurrent ? "text-amber-400" : isPast ? "text-rose-400" : "text-slate-500"}`}>
                    {fmt(target)} €
                  </div>
                  {actualBalance != null && (
                    <div className="text-xs font-mono text-slate-500">
                      {gap != null && gap > 0 ? `−${fmt(gap)} € απομένουν` : gap != null && gap <= 0 ? `+${fmt(Math.abs(gap))} € πάνω` : ""}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-600 w-20 shrink-0">{fmt(prevTarget)} €</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      achieved ? "bg-emerald-500" : isCurrent ? "bg-amber-500" : isPast ? "bg-rose-500" : "bg-slate-700"
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-600 w-20 text-right shrink-0">{fmt(target)} €</span>
                <span className={`text-xs font-mono font-bold w-14 text-right shrink-0 ${
                  achieved ? "text-emerald-400" : isCurrent ? "text-amber-400" : isPast && actualBalance != null ? "text-rose-400" : "text-slate-600"
                }`}>
                  {actualBalance != null ? `${progressPct.toFixed(0)}%` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
