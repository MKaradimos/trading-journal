import { FileText } from "lucide-react";
import { fmt } from "../utils";

export default function MonthSelector({ availableMonths, displayedStats, setSelectedMonth, onOpenReport }) {
  if (!availableMonths.length || !displayedStats) return null;

  const isAll = displayedStats.month === "all";
  const currentIdx = isAll ? -1 : availableMonths.findIndex((m) => m.month === displayedStats.month);
  const hasOlder = !isAll && currentIdx < availableMonths.length - 1;
  const hasNewer = !isAll && currentIdx > 0;

  const navCls = (active) =>
    `px-3 py-1.5 rounded-md text-sm font-mono border transition-all ${
      active
        ? "border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
        : "border-slate-800 text-slate-700 cursor-not-allowed"
    }`;

  return (
    <div className="mb-6 flex items-center justify-between gap-3 bg-slate-900/40 border border-slate-800 rounded-lg p-3">
      <button
        onClick={() => hasOlder && setSelectedMonth(availableMonths[currentIdx + 1].month)}
        disabled={!hasOlder}
        className={navCls(hasOlder)}
      >
        ← {hasOlder ? availableMonths[currentIdx + 1].label : "—"}
      </button>

      <div className="flex items-center gap-2">
        <select
          value={displayedStats.month}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white font-semibold text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">Όλοι οι μήνες</option>
          {availableMonths.map((m) => (
            <option key={m.month} value={m.month}>
              {m.label} · {m.total} trades · {m.totalEur >= 0 ? "+" : ""}{fmt(m.totalEur)} €
            </option>
          ))}
        </select>
        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-all whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Αναφορά</span>
        </button>
      </div>

      <button
        onClick={() => hasNewer && setSelectedMonth(availableMonths[currentIdx - 1].month)}
        disabled={!hasNewer}
        className={navCls(hasNewer)}
      >
        {hasNewer ? availableMonths[currentIdx - 1].label : "—"} →
      </button>
    </div>
  );
}
