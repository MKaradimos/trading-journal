import { fmt } from "../utils";

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function getWeekLabel(weekKey) {
  const start = new Date(weekKey);
  const end = new Date(weekKey);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString("el-GR", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("el-GR", { day: "2-digit", month: "short", year: "numeric" })}`;
}

export default function WeeklyReview({ trades }) {
  if (!trades.length) return null;

  const groups = {};
  trades.forEach((t) => {
    const k = getWeekKey(t.date);
    if (!groups[k]) groups[k] = [];
    groups[k].push(t);
  });

  const weeks = Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 4)
    .map(([key, list]) => {
      const wins = list.filter((t) => t.plEur > 0);
      const losses = list.filter((t) => t.plEur < 0);
      const totalEur = list.reduce((s, t) => s + t.plEur, 0);
      const rTrades = list.filter((t) => t.rValue != null);
      const avgR = rTrades.length > 0 ? rTrades.reduce((s, t) => s + t.rValue, 0) / rTrades.length : null;
      const winRate = list.length > 0 ? (wins.length / list.length) * 100 : 0;
      const grossWin = wins.reduce((s, t) => s + t.plEur, 0);
      const grossLoss = Math.abs(losses.reduce((s, t) => s + t.plEur, 0));
      const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;
      return { key, list, wins: wins.length, losses: losses.length, totalEur, avgR, winRate, profitFactor };
    });

  return (
    <section className="mb-10 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">Εβδομαδιαία Επισκόπηση</h2>
      </div>
      <div className="divide-y divide-slate-800">
        {weeks.map((w) => (
          <div key={w.key} className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-300 font-mono">{getWeekLabel(w.key)}</span>
              <span className={`font-mono font-bold text-lg ${w.totalEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {w.totalEur >= 0 ? "+" : ""}{fmt(w.totalEur)} €
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 font-mono mb-1">Trades</div>
                <div className="text-lg font-bold text-white">{w.list.length}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 font-mono mb-1">Win Rate</div>
                <div className={`text-lg font-bold ${w.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`}>{fmt(w.winRate)}%</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 font-mono mb-1">W / L</div>
                <div className="text-lg font-bold">
                  <span className="text-emerald-400">{w.wins}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span className="text-rose-400">{w.losses}</span>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 font-mono mb-1">Μέσο R</div>
                <div className={`text-lg font-bold font-mono ${w.avgR == null ? "text-slate-600" : w.avgR >= 1.5 ? "text-emerald-400" : w.avgR >= 0 ? "text-amber-400" : "text-rose-400"}`}>
                  {w.avgR != null ? `${w.avgR >= 0 ? "+" : ""}${w.avgR.toFixed(2)}R` : "—"}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 font-mono mb-1">Profit Factor</div>
                <div className={`text-lg font-bold font-mono ${w.profitFactor >= 1.5 ? "text-emerald-400" : w.profitFactor >= 1 ? "text-amber-400" : "text-rose-400"}`}>
                  {w.profitFactor === Infinity ? "∞" : w.profitFactor.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
