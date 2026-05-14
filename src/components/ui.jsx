import { X, Activity, AlertTriangle } from "lucide-react";

export const inputCls = (err) =>
  `w-full bg-slate-900/70 border ${
    err ? "border-rose-500/60" : "border-slate-700"
  } text-slate-100 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors placeholder:text-slate-600`;

export function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function StatCard({ label, value, tone = "neutral", icon, large = false }) {
  const toneCls =
    tone === "positive" ? "text-emerald-400"
    : tone === "negative" ? "text-rose-400"
    : "text-white";
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
        {icon}
        {label}
      </div>
      <div className={`font-mono font-semibold ${toneCls} ${large ? "text-2xl" : "text-xl"}`}>
        {value}
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="mb-10 bg-slate-900/40 border border-dashed border-slate-700 rounded-xl p-10 text-center">
      <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
      <p className="text-slate-400 font-mono text-sm">Καμία καταχώρηση ακόμη.</p>
      <p className="text-slate-600 text-xs mt-1">Πρόσθεσε το πρώτο σου trade για να εμφανιστούν στατιστικά.</p>
    </div>
  );
}

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-slate-200 text-sm">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            Ακύρωση
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm bg-rose-500 hover:bg-rose-400 text-white font-semibold transition-colors"
          >
            Διαγραφή
          </button>
        </div>
      </div>
    </div>
  );
}

export function Th({ children, align = "left" }) {
  return (
    <th className="px-4 py-3 font-medium" style={{ textAlign: align }}>
      {children}
    </th>
  );
}

export function Td({ children, align = "left", className = "" }) {
  return (
    <td className={`px-4 py-3 ${className}`} style={{ textAlign: align }}>
      {children}
    </td>
  );
}
