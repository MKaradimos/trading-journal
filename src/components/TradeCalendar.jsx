import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmt } from "../utils";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function TradeCalendar({ trades }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const monthTrades = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(t);
      }
    });
    return map;
  }, [trades, viewYear, viewMonth]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("el-GR", { month: "long", year: "numeric" });

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const days = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"];

  return (
    <section className="mb-10 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Ημερολόγιο Trades</h2>
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-1.5 rounded-md border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-mono text-slate-300 capitalize w-36 text-center">{monthName}</span>
          <button onClick={next} className="p-1.5 rounded-md border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {days.map((d) => (
            <div key={d} className="text-center text-xs font-mono text-slate-600 py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTrades = monthTrades[day] || [];
            const totalPl = dayTrades.reduce((s, t) => s + t.plEur, 0);
            const hasWin = dayTrades.some((t) => t.plEur > 0);
            const hasLoss = dayTrades.some((t) => t.plEur < 0);
            const isToday = viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate();

            return (
              <div
                key={day}
                className={`rounded-lg p-1.5 min-h-[56px] border transition-colors ${
                  dayTrades.length > 0
                    ? totalPl > 0
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : totalPl < 0
                      ? "border-rose-500/30 bg-rose-500/5"
                      : "border-slate-700 bg-slate-800/30"
                    : isToday
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-transparent"
                }`}
              >
                <div className={`text-xs font-mono mb-1 ${isToday ? "text-amber-400 font-bold" : "text-slate-500"}`}>
                  {day}
                </div>
                {dayTrades.length > 0 && (
                  <div className="space-y-0.5">
                    <div className={`text-xs font-mono font-bold leading-none ${totalPl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {totalPl >= 0 ? "+" : ""}{fmt(totalPl)}€
                    </div>
                    <div className="flex gap-0.5 flex-wrap">
                      {dayTrades.map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] px-1 rounded font-mono ${t.plEur >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
                          title={`${t.asset} ${t.plEur >= 0 ? "+" : ""}${fmt(t.plEur)}€`}
                        >
                          {t.asset}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Monthly summary */}
        {Object.keys(monthTrades).length > 0 && (() => {
          const all = Object.values(monthTrades).flat();
          const totalPl = all.reduce((s, t) => s + t.plEur, 0);
          const wins = all.filter((t) => t.plEur > 0).length;
          return (
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>{all.length} trades · {wins}W / {all.length - wins}L</span>
              <span className={`font-bold text-sm ${totalPl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {totalPl >= 0 ? "+" : ""}{fmt(totalPl)} €
              </span>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
