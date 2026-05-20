import { useState } from "react";
import { FileText, X, Trash2 } from "lucide-react";
import { fmt } from "../utils";

export default function ReportModal({ availableMonths, monthlyStats, trades, onDelete, onClose, initialMonth, currentCapital }) {
  const [reportMonth, setReportMonth] = useState(initialMonth ?? availableMonths[0]?.month ?? "");

  const stats = monthlyStats.find((m) => m.month === reportMonth) || null;
  const monthTrades = trades.filter((t) => t.date.slice(0, 7) === reportMonth);

  const calcRR = (t) => {
    if (t.risk == null || t.risk === 0 || t.plPct == null) return null;
    return t.plPct / t.risk;
  };

  const rrTrades = monthTrades.filter((t) => calcRR(t) !== null);
  const avgRR = rrTrades.length > 0
    ? rrTrades.reduce((s, t) => s + calcRR(t), 0) / rrTrades.length
    : null;

  const assetStats = (() => {
    const groups = {};
    monthTrades.forEach((t) => {
      if (!groups[t.asset]) groups[t.asset] = [];
      groups[t.asset].push(t);
    });
    return Object.entries(groups)
      .map(([asset, list]) => {
        const wins = list.filter((t) => t.plEur > 0).length;
        const losses = list.filter((t) => t.plEur < 0).length;
        const totalEur = list.reduce((s, t) => s + t.plEur, 0);
        const winRate = list.length > 0 ? (wins / list.length) * 100 : 0;
        return { asset, total: list.length, wins, losses, winRate, totalEur, avgEur: totalEur / list.length };
      })
      .sort((a, b) => b.total - a.total);
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl mb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Αναφορά Μήνα</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Επιλογή μήνα</p>
          {availableMonths.length === 0 ? (
            <p className="text-slate-500 text-sm">Δεν υπάρχουν δεδομένα ακόμη.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableMonths.map((m) => (
                <button
                  key={m.month}
                  onClick={() => setReportMonth(m.month)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-all ${
                    reportMonth === m.month
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {stats && (
          <>
            <div className="px-6 py-5 border-b border-slate-800">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Σύνοψη — {stats.label}</p>

              {/* Highlight sentence */}
              <div className="mb-4 px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-300 leading-relaxed">
                Αυτόν τον μήνα είχες{" "}
                <span className={`font-bold ${stats.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                  {fmt(stats.winRate)}% επιτυχία
                </span>{" "}
                σε{" "}
                <span className="font-bold text-white">{stats.total} trades</span>
                {" "}({" "}
                <span className="text-emerald-400">{stats.wins} νίκες</span>
                {" · "}
                <span className="text-rose-400">{stats.losses} ήττες</span>
                {" "}) με μέσο αποτέλεσμα{" "}
                <span className={`font-bold font-mono ${stats.avgEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {stats.avgEur >= 0 ? "+" : ""}{fmt(stats.avgEur)} €
                </span>{" "}
                ανά trade.
              </div>

              <div className={`rounded-xl p-4 text-center border mb-4 ${stats.totalEur >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"}`}>
                <div className="text-xs font-mono text-slate-400 mb-1">Συνολικό αποτέλεσμα</div>
                <div className={`text-4xl font-bold font-mono ${stats.totalEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {stats.totalEur >= 0 ? "+" : ""}{fmt(stats.totalEur)} €
                </div>
                <div className={`text-lg font-mono mt-0.5 ${stats.totalPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {stats.totalPct >= 0 ? "+" : ""}{fmt(stats.totalPct)}%
                </div>
                <div className="text-xs text-slate-500 mt-2 font-mono">
                  {stats.totalEur >= 0 ? "✓ Κερδοφόρος μήνας" : "✗ Ζημιογόνος μήνας"}
                </div>
                {currentCapital != null && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="text-xs font-mono text-slate-500 mb-0.5">Τρέχον Κεφάλαιο</div>
                    <div className={`text-2xl font-bold font-mono ${currentCapital >= 0 ? "text-white" : "text-rose-400"}`}>
                      {fmt(currentCapital)} €
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">trades + καταθέσεις − αναλήψεις</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Trades", value: <span className="text-white">{stats.total}</span> },
                  { label: "Win Rate", value: <span className={stats.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}>{fmt(stats.winRate)}%</span> },
                  {
                    label: "Wins / Losses",
                    value: <><span className="text-emerald-400">{stats.wins}</span><span className="text-slate-600 mx-1">/</span><span className="text-rose-400">{stats.losses}</span></>,
                  },
                  { label: "Μέσο / Trade", value: <span className={`font-mono ${stats.avgEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{stats.avgEur >= 0 ? "+" : ""}{fmt(stats.avgEur)}€</span> },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 font-mono mb-1">{label}</div>
                    <div className="text-xl font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {assetStats.length > 0 && (
              <div className="px-6 py-5 border-b border-slate-800">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Ανά Asset</p>
                <div className="space-y-3">
                  {assetStats.map((a) => (
                    <div key={a.asset} className="bg-slate-800/40 rounded-lg px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">{a.asset}</span>
                          <span className="text-xs text-slate-500 font-mono">{a.total} trades</span>
                          <span className="text-xs font-mono">
                            <span className="text-emerald-400">{a.wins}W</span>
                            <span className="text-slate-600 mx-1">/</span>
                            <span className="text-rose-400">{a.losses}L</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold text-sm ${a.totalEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {a.totalEur >= 0 ? "+" : ""}{fmt(a.totalEur)} €
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${a.winRate >= 50 ? "bg-emerald-500" : "bg-rose-500"}`}
                            style={{ width: `${a.winRate}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono font-bold w-12 text-right ${a.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                          {fmt(a.winRate)}%
                        </span>
                        <span className={`text-xs font-mono text-slate-400 w-20 text-right`}>
                          μέσο {a.avgEur >= 0 ? "+" : ""}{fmt(a.avgEur)}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-6 py-5">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Trades ({monthTrades.length})</p>
              {monthTrades.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Δεν υπάρχουν trades για αυτόν τον μήνα.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {monthTrades.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800/70 rounded-lg px-4 py-3 transition-colors">
                      <span className="text-xs text-slate-600 font-mono w-5 shrink-0">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-white text-sm">{t.asset}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${t.direction === "long" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                            {t.direction === "long" ? "▲" : "▼"} {t.direction.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{t.date}</span>
                        </div>
                        {t.notes && <div className="text-xs text-slate-500 truncate">{t.notes}</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`font-mono font-bold text-sm ${t.plEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {t.plEur >= 0 ? "+" : ""}{fmt(t.plEur)} €
                        </div>
                        <div className={`font-mono text-xs ${t.plPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {t.plPct >= 0 ? "+" : ""}{fmt(t.plPct)}%
                        </div>
                        {calcRR(t) !== null && (
                          <div className={`font-mono text-xs ${calcRR(t) >= 1 ? "text-slate-400" : "text-slate-500"}`}>
                            R:R {calcRR(t) >= 0 ? "+" : ""}{calcRR(t).toFixed(2)}
                          </div>
                        )}
                      </div>
                      <button onClick={() => onDelete(t.id)} className="shrink-0 text-slate-600 hover:text-rose-400 transition-colors ml-1" title="Διαγραφή">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {avgRR !== null && (
                <div className="mt-4 px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Μέσος R:R</span>
                  <span className={`font-mono font-bold text-lg ${avgRR >= 1 ? "text-emerald-400" : avgRR >= 0 ? "text-amber-400" : "text-rose-400"}`}>
                    {avgRR >= 0 ? "+" : ""}{avgRR.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
