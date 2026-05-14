import { INITIAL_CAPITAL } from "../constants";
import { fmt } from "../utils";

export default function CapitalPanel({ currentCapital }) {
  const pl = currentCapital - INITIAL_CAPITAL;
  const pct = (pl / INITIAL_CAPITAL) * 100;
  const positive = currentCapital >= INITIAL_CAPITAL;
  const color = positive ? "text-emerald-400" : "text-rose-400";

  return (
    <section className="mb-8">
      <div className={`relative rounded-2xl border overflow-hidden ${
        positive ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
      }`}>
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
            <div className={`text-2xl font-bold font-mono ${color}`}>
              {pl >= 0 ? "+" : ""}{fmt(pl)} €
            </div>
          </div>

          <div className="flex-1 px-6 py-5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Απόδοση</div>
            <div className={`text-2xl font-bold font-mono ${color}`}>
              {pct >= 0 ? "+" : ""}{fmt(pct)}%
            </div>
            <div className="text-xs text-slate-600 font-mono mt-0.5">P/L € ÷ {fmt(INITIAL_CAPITAL)} €</div>
          </div>
        </div>

        {/* Bar shows P/L% mapped to 0-100% width, capped at ±50% for visibility */}
        <div className="h-1 w-full bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
            style={{ width: `${Math.min(100, Math.max(0, 50 + Math.max(-50, Math.min(50, pct))))}%` }}
          />
        </div>
      </div>
    </section>
  );
}
