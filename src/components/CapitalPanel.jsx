import { INITIAL_CAPITAL, MONTHLY_R_TARGET } from "../constants";
import { fmt } from "../utils";

function RBar({ value, min, max }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = value >= max ? "bg-emerald-500" : value >= min ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      <div className="absolute top-0 h-full w-0.5 bg-slate-500 opacity-60" style={{ left: `${(min / max) * 100}%` }} />
    </div>
  );
}

export default function CapitalPanel({ currentCapital, monthTarget, drawdownStats, currentMonthStats }) {
  const pl = currentCapital - INITIAL_CAPITAL;
  const pct = (pl / INITIAL_CAPITAL) * 100;
  const positive = currentCapital >= INITIAL_CAPITAL;
  const color = positive ? "text-emerald-400" : "text-rose-400";

  const { target, capitalAtMonthStart } = monthTarget ?? {};
  const gap = target != null ? target - currentCapital : null;
  const progressPct = target != null && capitalAtMonthStart != null && target > capitalAtMonthStart
    ? Math.min(100, Math.max(0, ((currentCapital - capitalAtMonthStart) / (target - capitalAtMonthStart)) * 100))
    : 0;
  const onTarget = gap != null && gap <= 0;

  const totalR = currentMonthStats?.totalR ?? null;
  const avgR = currentMonthStats?.avgR ?? null;

  return (
    <section className="mb-8 space-y-3">
      {/* Capital row */}
      <div className={`relative rounded-2xl border overflow-hidden ${positive ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"}`}>
        <div className="flex flex-col sm:flex-row items-stretch">
          <div className="flex-1 px-6 py-5 border-b sm:border-b-0 sm:border-r border-slate-800/60">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Αρχικό Κεφάλαιο</div>
            <div className="text-2xl font-bold font-mono text-slate-300">{fmt(INITIAL_CAPITAL)} €</div>
          </div>
          <div className="flex-1 px-6 py-5 border-b sm:border-b-0 sm:border-r border-slate-800/60">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Τρέχον Κεφάλαιο</div>
            <div className={`text-2xl font-bold font-mono ${color}`}>{fmt(currentCapital)} €</div>
          </div>
          <div className="flex-1 px-6 py-5 border-b sm:border-b-0 sm:border-r border-slate-800/60">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Συνολικό P/L</div>
            <div className={`text-2xl font-bold font-mono ${color}`}>{pl >= 0 ? "+" : ""}{fmt(pl)} €</div>
          </div>
          <div className="flex-1 px-6 py-5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Απόδοση</div>
            <div className={`text-2xl font-bold font-mono ${color}`}>{pct >= 0 ? "+" : ""}{fmt(pct)}%</div>
            <div className="text-xs text-slate-600 font-mono mt-0.5">P/L € ÷ {fmt(INITIAL_CAPITAL)} €</div>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
            style={{ width: `${Math.min(100, Math.max(0, 50 + Math.max(-50, Math.min(50, pct))))}%` }}
          />
        </div>
      </div>

      {/* Drawdown row */}
      {drawdownStats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Peak Equity</div>
            <div className="text-xl font-bold font-mono text-white">{fmt(drawdownStats.peakEquity)} €</div>
          </div>
          <div className={`rounded-xl border px-4 py-3 ${drawdownStats.currentDrawdown > 5 ? "border-rose-500/40 bg-rose-500/5" : "border-slate-700 bg-slate-900/40"}`}>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Current Drawdown</div>
            <div className={`text-xl font-bold font-mono ${drawdownStats.currentDrawdown > 5 ? "text-rose-400" : drawdownStats.currentDrawdown > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {drawdownStats.currentDrawdown > 0 ? "-" : ""}{fmt(drawdownStats.currentDrawdown)}%
            </div>
          </div>
          <div className={`rounded-xl border px-4 py-3 ${drawdownStats.maxDrawdown > 10 ? "border-rose-500/40 bg-rose-500/5" : "border-slate-700 bg-slate-900/40"}`}>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Max Drawdown</div>
            <div className={`text-xl font-bold font-mono ${drawdownStats.maxDrawdown > 10 ? "text-rose-400" : drawdownStats.maxDrawdown > 5 ? "text-amber-400" : "text-emerald-400"}`}>
              {drawdownStats.maxDrawdown > 0 ? "-" : ""}{fmt(drawdownStats.maxDrawdown)}%
            </div>
          </div>
        </div>
      )}

      {/* R Performance + Monthly target row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Monthly R */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 px-6 py-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">R αυτόν τον μήνα</div>
          {totalR != null ? (
            <>
              <div className="flex items-end gap-6 mb-3">
                <div>
                  <div className="text-xs text-slate-600 font-mono mb-0.5">Σύνολο</div>
                  <div className={`text-4xl font-bold font-mono ${totalR >= MONTHLY_R_TARGET.min ? "text-emerald-400" : totalR >= 0 ? "text-amber-400" : "text-rose-400"}`}>
                    {totalR >= 0 ? "+" : ""}{totalR.toFixed(2)}R
                  </div>
                </div>
                {avgR != null && (
                  <div className="pb-1">
                    <div className="text-xs text-slate-600 font-mono mb-0.5">Μέσο R:R</div>
                    <div className={`text-2xl font-bold font-mono ${avgR >= 1.5 ? "text-emerald-400" : avgR >= 1 ? "text-amber-400" : "text-rose-400"}`}>
                      {avgR >= 0 ? "+" : ""}{avgR.toFixed(2)}R
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">στόχος 1.5R–2R+</div>
                  </div>
                )}
              </div>
              <RBar value={totalR} min={MONTHLY_R_TARGET.min} max={MONTHLY_R_TARGET.max} />
              <div className="flex justify-between mt-1 text-xs font-mono text-slate-600">
                <span>0R</span>
                <span>στόχος {MONTHLY_R_TARGET.min}R–{MONTHLY_R_TARGET.max}R</span>
                <span>{MONTHLY_R_TARGET.max}R</span>
              </div>
            </>
          ) : (
            <div className="text-slate-600 text-sm font-mono">Καταχώρησε trades με Stop Loss για να υπολογιστεί το R</div>
          )}
        </div>

        {/* Monthly capital target */}
        {target != null && (
          <div className={`rounded-2xl border px-6 py-4 ${onTarget ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Στόχος Μήνα (+90%)</div>
            <div className="flex items-end gap-4 mb-3">
              <div>
                <div className="text-xs text-slate-600 font-mono mb-0.5">Τρέχον</div>
                <div className={`text-2xl font-bold font-mono ${onTarget ? "text-emerald-400" : "text-white"}`}>{fmt(currentCapital)} €</div>
              </div>
              <div className="text-slate-600 pb-1">→</div>
              <div>
                <div className="text-xs text-slate-600 font-mono mb-0.5">Στόχος</div>
                <div className={`text-2xl font-bold font-mono ${onTarget ? "text-emerald-400" : "text-amber-400"}`}>{fmt(target)} €</div>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${onTarget ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-600">
              <span>{fmt(capitalAtMonthStart)} €</span>
              <span className={`font-semibold ${onTarget ? "text-emerald-400" : "text-rose-400"}`}>
                {onTarget ? `✓ +${fmt(Math.abs(gap))} € πάνω` : `−${fmt(gap)} € απομένουν`}
              </span>
              <span>{fmt(target)} €</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
