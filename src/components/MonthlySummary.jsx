import { fmt } from "../utils";

export default function MonthlySummary({ trades, stats }) {
  if (!trades.length || !stats) return null;

  const rrTrades = trades.filter((t) => t.risk != null && t.risk !== 0 && t.plPct != null);
  const avgRR = rrTrades.length > 0
    ? rrTrades.reduce((s, t) => s + t.plPct / t.risk, 0) / rrTrades.length
    : null;

  return (
    <section className="mt-6 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">Σύνοψη — {stats.label}</h2>
      </div>

      <div className="divide-y divide-slate-800">
        {trades.map((t, i) => (
          <div key={t.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-800/30 transition-colors">
            <span className="text-xs text-slate-600 font-mono w-6 shrink-0 text-right">{i + 1}.</span>
            <span className="font-mono text-xs text-slate-500 w-24 shrink-0">{t.date}</span>
            <span className="font-bold text-white flex-1 min-w-0 truncate">{t.asset}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
              t.direction === "long" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}>
              {t.direction === "long" ? "▲" : "▼"} {t.direction.toUpperCase()}
            </span>
            {t.notes
              ? <span className="text-xs text-slate-500 flex-1 min-w-0 truncate hidden sm:block">{t.notes}</span>
              : <span className="flex-1 hidden sm:block" />
            }
            <div className="text-right shrink-0 min-w-[90px]">
              <div className={`font-mono font-bold text-sm ${t.plEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {t.plEur >= 0 ? "+" : ""}{fmt(t.plEur)} €
              </div>
              <div className={`font-mono text-xs ${t.plPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {t.plPct >= 0 ? "+" : ""}{fmt(t.plPct)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`px-6 py-4 border-t-2 ${
        stats.totalEur >= 0 ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5"
      }`}>
        {/* Σύνοψη-πρόταση */}
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          <span className="font-bold text-white">{stats.label}</span>
          {" · "}
          <span className="font-bold text-white">{stats.total} trades</span>
          {" · "}
          <span className="text-emerald-400 font-bold">{stats.wins} νίκες</span>
          {" · "}
          <span className="text-rose-400 font-bold">{stats.losses} ήττες</span>
          {" · Win Rate "}
          <span className={`font-bold ${stats.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
            {fmt(stats.winRate)}%
          </span>
          {avgRR !== null && (
            <>
              {" · Μέσο R:R "}
              <span className={`font-bold font-mono ${avgRR >= 1 ? "text-emerald-400" : avgRR >= 0 ? "text-amber-400" : "text-rose-400"}`}>
                {avgRR >= 0 ? "+" : ""}{avgRR.toFixed(2)}
              </span>
            </>
          )}
          {" · Αποτέλεσμα "}
          <span className={`font-bold font-mono ${stats.totalEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {stats.totalEur >= 0 ? "+" : ""}{fmt(stats.totalEur)} €
          </span>
        </p>

        <div className="flex items-center justify-end">
          <div className="text-right">
            <div className={`font-mono font-bold text-xl ${stats.totalEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {stats.totalEur >= 0 ? "+" : ""}{fmt(stats.totalEur)} €
            </div>
            <div className={`font-mono text-sm ${stats.totalPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {stats.totalPct >= 0 ? "+" : ""}{fmt(stats.totalPct)}%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
