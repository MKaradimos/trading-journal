import { Trash2, Pencil } from "lucide-react";
import { Th, Td } from "./ui";
import { fmt } from "../utils";

function DirectionBadge({ direction }) {
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
      direction === "long" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
    }`}>
      {direction === "long" ? "▲" : "▼"} {direction.toUpperCase()}
    </span>
  );
}

function MobileCard({ t, onEdit, onDelete, onLightbox }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs text-slate-500 shrink-0">{t.date}</span>
          <span className="font-bold text-white truncate">{t.asset}</span>
          <DirectionBadge direction={t.direction} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit(t)} className="text-slate-600 hover:text-amber-400 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(t.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div>
            <div className="text-xs text-slate-500 font-mono mb-0.5">P/L</div>
            <div className={`font-mono font-bold text-lg ${t.plEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {t.plEur >= 0 ? "+" : ""}{fmt(t.plEur)} €
            </div>
            <div className={`font-mono text-xs ${t.plPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {t.plPct >= 0 ? "+" : ""}{fmt(t.plPct)}%
            </div>
          </div>
          <div className="flex gap-3 text-xs font-mono text-slate-400">
            <div><div className="text-slate-600 mb-0.5">Entry</div><div>{fmt(t.entry, { maximumFractionDigits: 6 })}</div></div>
            <div><div className="text-slate-600 mb-0.5">Exit</div><div>{fmt(t.exit, { maximumFractionDigits: 6 })}</div></div>
            {t.risk !== null && <div><div className="text-slate-600 mb-0.5">Risk</div><div>{fmt(t.risk)}%</div></div>}
                            {t.pips != null && <div><div className="text-slate-600 mb-0.5">Pips</div><div className={t.pips >= 0 ? "text-emerald-400" : "text-rose-400"}>{t.pips >= 0 ? "+" : ""}{t.pips}</div></div>}
          </div>
        </div>
        {t.screenshot && (
          <button onClick={() => onLightbox(t.screenshot)} className="w-14 h-14 rounded overflow-hidden border border-slate-700 hover:border-emerald-500 transition-colors shrink-0">
            <img src={t.screenshot} alt="shot" className="w-full h-full object-cover" />
          </button>
        )}
      </div>

      {t.notes && <div className="text-xs text-slate-500 border-t border-slate-800/60 pt-2">{t.notes}</div>}
    </div>
  );
}

export default function TradeTable({ trades, onEdit, onDelete, onLightbox }) {
  if (!trades.length) {
    return (
      <div className="px-6 py-12 text-center text-slate-500 text-sm">
        Δεν υπάρχουν trades ακόμη. Καταχώρησε το πρώτο σου παραπάνω.
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden divide-y divide-slate-800">
        {trades.map((t) => (
          <MobileCard key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} onLightbox={onLightbox} />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <Th>Ημ/νία</Th><Th>Asset</Th><Th>Dir</Th>
              <Th align="right">Entry</Th><Th align="right">Exit</Th><Th align="right">Risk%</Th>
              <Th align="right">P/L (€)</Th><Th align="right">P/L (%)</Th><Th align="right">Pips</Th>
              <Th>Σημειώσεις</Th><Th align="center">Shot</Th><Th align="center"></Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {trades.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <Td className="font-mono text-slate-400 whitespace-nowrap">{t.date}</Td>
                <Td className="font-semibold text-white">{t.asset}</Td>
                <Td>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    t.direction === "long" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {t.direction === "long" ? "▲" : "▼"} {t.direction.toUpperCase()}
                  </span>
                </Td>
                <Td align="right" className="font-mono">{fmt(t.entry, { maximumFractionDigits: 6 })}</Td>
                <Td align="right" className="font-mono">{fmt(t.exit, { maximumFractionDigits: 6 })}</Td>
                <Td align="right" className="font-mono text-slate-400">{t.risk !== null ? `${fmt(t.risk)}%` : "—"}</Td>
                <Td align="right" className={`font-mono font-semibold ${t.plEur >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {t.plEur >= 0 ? "+" : ""}{fmt(t.plEur)}
                </Td>
                <Td align="right" className={`font-mono ${t.plPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {t.plPct >= 0 ? "+" : ""}{fmt(t.plPct)}%
                </Td>
                <Td align="right" className={`font-mono ${t.pips != null ? (t.pips >= 0 ? "text-emerald-400" : "text-rose-400") : "text-slate-600"}`}>
                  {t.pips != null ? `${t.pips >= 0 ? "+" : ""}${t.pips}` : "—"}
                </Td>
                <Td className="text-slate-400 max-w-xs truncate">{t.notes || "—"}</Td>
                <Td align="center">
                  {t.screenshot ? (
                    <button onClick={() => onLightbox(t.screenshot)} className="block w-10 h-10 rounded overflow-hidden border border-slate-700 hover:border-emerald-500 transition-colors mx-auto">
                      <img src={t.screenshot} alt="shot" className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <span className="text-slate-700">—</span>
                  )}
                </Td>
                <Td align="center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(t)} className="text-slate-500 hover:text-amber-400 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(t.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
