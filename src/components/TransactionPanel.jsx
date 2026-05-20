import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, MinusCircle, Plus, Trash2 } from "lucide-react";
import { Field, inputCls } from "./ui";
import { fmt } from "../utils";

export default function TransactionPanel({ transactions, txForm, setTxForm, txError, saveTransaction, deleteTransaction }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
          Καταθέσεις / Αναλήψεις
        </span>
        <span className="text-xs text-slate-500 font-mono">{open ? "▲ Κλείσιμο" : "▼ Ανάπτυξη"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-6 py-4 space-y-4">
          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <Field label="Τύπος">
              <div className="flex gap-2">
                {[
                  { value: "deposit",    label: "+ Κατάθεση", active: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300", icon: <ArrowDownCircle className="w-3.5 h-3.5" /> },
                  { value: "withdrawal", label: "− Ανάληψη",  active: "bg-rose-500/20 border-rose-500/50 text-rose-300",    icon: <ArrowUpCircle className="w-3.5 h-3.5" /> },
                  { value: "deduction",  label: "✕ Αφαίρεση", active: "bg-amber-500/20 border-amber-500/50 text-amber-300",   icon: <MinusCircle className="w-3.5 h-3.5" /> },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTxForm((f) => ({ ...f, type: opt.value }))}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-all border ${
                      txForm.type === opt.value
                        ? opt.active
                        : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Ποσό (€)" error={txError}>
              <input
                type="number" inputMode="decimal" step="0.01" min="0"
                placeholder="π.χ. 500"
                value={txForm.amount}
                onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))}
                className={inputCls(txError)}
              />
            </Field>

            <Field label="Ημερομηνία">
              <input
                type="date"
                value={txForm.date}
                onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))}
                className={inputCls()}
              />
            </Field>

            <div className="flex flex-col justify-end">
              <button
                onClick={saveTransaction}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Καταχώρηση
              </button>
            </div>
          </div>

          {/* History */}
          {transactions.length > 0 && (
            <div className="border-t border-slate-800 pt-3 space-y-1 max-h-48 overflow-y-auto">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-slate-800/30 group">
                  <span className="font-mono text-xs text-slate-500 w-24 shrink-0">{tx.date}</span>
                  {tx.type === "deposit"
                    ? <ArrowDownCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    : tx.type === "withdrawal"
                    ? <ArrowUpCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    : <MinusCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  }
                  <span className={`font-mono font-semibold text-sm ${tx.type === "deposit" ? "text-emerald-400" : tx.type === "withdrawal" ? "text-rose-400" : "text-amber-400"}`}>
                    {tx.type === "deposit" ? "+" : "−"}{fmt(tx.amount)} €
                  </span>
                  {tx.notes && <span className="text-xs text-slate-500 flex-1 truncate">{tx.notes}</span>}
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all ml-auto shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
