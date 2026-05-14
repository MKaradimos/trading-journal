import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { fmt } from "../utils";

export default function MonthlyChart({ monthlyStats }) {
  if (!monthlyStats.length) return null;

  return (
    <section className="mb-10 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Μηνιαία Απόδοση</h2>
      <p className="text-xs text-slate-500 font-mono mb-5">P/L σε € ανά μήνα</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 12, fontFamily: "monospace" }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 12, fontFamily: "monospace" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px" }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(v) => [`${fmt(v)} €`, "P/L"]}
            />
            <Bar dataKey="totalEur" radius={[4, 4, 0, 0]}>
              {monthlyStats.map((m, i) => (
                <Cell key={i} fill={m.totalEur >= 0 ? "#10b981" : "#f43f5e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
