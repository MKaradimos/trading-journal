import { Plus, Pencil, X } from "lucide-react";
import { Field, inputCls } from "./ui";
import { ASSET_TYPES } from "../constants";

export default function TradeForm({
  form, setForm, editingId, errors,
  handleChange, handleScreenshot,
  saveTrade, cancelEdit, currentCapital,
}) {
  return (
    <section id="trade-form-section" className="mb-10 bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {editingId ? <Pencil className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
          {editingId ? "Επεξεργασία Trade" : "Νέο Trade"}
        </h2>
        {editingId && (
          <button
            onClick={cancelEdit}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-md transition-colors"
          >
            Ακύρωση
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Ημερομηνία" error={errors.date}>
          <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls(errors.date)} />
        </Field>

        <Field label="Asset / Ζευγάρι" error={errors.asset}>
          <input
            type="text" name="asset"
            placeholder="π.χ. BTCUSDT, EURUSD"
            value={form.asset} onChange={handleChange}
            className={inputCls(errors.asset)}
          />
        </Field>

        <Field label="Τύπος Asset">
          <select
            name="assetType"
            value={form.assetType}
            onChange={(e) => handleChange(e, currentCapital)}
            className={inputCls()}
          >
            {ASSET_TYPES.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Κατεύθυνση">
          <div className="flex gap-2">
            {["long", "short"].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => handleChange({ target: { name: "direction", value: dir } }, currentCapital)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all border ${
                  form.direction === dir
                    ? dir === "long"
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : "bg-rose-500/20 border-rose-500/50 text-rose-300"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {dir === "long" ? "▲ Long" : "▼ Short"}
              </button>
            ))}
          </div>
        </Field>


        <Field label="Entry Price" error={errors.entry}>
          <input
            type="number" inputMode="decimal" step="any" name="entry"
            value={form.entry} onChange={(e) => handleChange(e, currentCapital)} className={inputCls(errors.entry)}
          />
        </Field>

        <Field label="Stop Loss" >
          <input
            type="number" inputMode="decimal" step="any" name="stopLoss"
            placeholder="τιμή SL"
            value={form.stopLoss} onChange={(e) => handleChange(e, currentCapital)} className={inputCls()}
          />
        </Field>

        <Field label="Exit Price" error={errors.exit}>
          <input
            type="number" inputMode="decimal" step="any" name="exit"
            value={form.exit} onChange={(e) => handleChange(e, currentCapital)} className={inputCls(errors.exit)}
          />
        </Field>

        <Field label="P/L (€)" error={errors.plEur}>
          <input
            type="number" inputMode="decimal" step="0.01" name="plEur"
            placeholder="π.χ. 125.50 ή -50"
            value={form.plEur} onChange={(e) => handleChange(e, currentCapital)} className={inputCls(errors.plEur)}
          />
        </Field>

        <Field label="P/L % (αυτόματο)" error={errors.plPct}>
          <input
            type="number" inputMode="decimal" step="0.01" name="plPct"
            placeholder="— αυτόματο"
            value={form.plPct} readOnly
            className={inputCls(errors.plPct) + " text-slate-400 cursor-default"}
          />
        </Field>

        <Field label="Risk % (αυτόματο)">
          <input
            type="number" inputMode="decimal" step="0.01" name="risk"
            placeholder="— αυτόματο"
            value={form.risk} readOnly
            className={inputCls() + " text-amber-400 cursor-default"}
          />
          {form.risk !== "" && !isNaN(parseFloat(form.risk)) && currentCapital > 0 && (
            <p className="mt-1 text-xs font-mono text-amber-400">
              = {((parseFloat(form.risk) / 100) * currentCapital).toFixed(2)} €
            </p>
          )}
        </Field>

        <Field label="Pips (αυτόματο)">
          <input
            type="number" inputMode="decimal" step="0.1" name="pips"
            placeholder="— αυτόματο"
            value={form.pips} readOnly
            className={inputCls() + " text-slate-400 cursor-default"}
          />
        </Field>

        <Field label="R Value (αυτόματο)">
          <input
            type="number" inputMode="decimal" step="0.01" name="rValue"
            placeholder="— αυτόματο"
            value={form.rValue} readOnly
            className={inputCls() + (form.rValue !== "" ? (parseFloat(form.rValue) >= 0 ? " text-emerald-400" : " text-rose-400") + " cursor-default" : " text-slate-400 cursor-default")}
          />
          {form.rValue !== "" && !isNaN(parseFloat(form.rValue)) && (
            <p className="mt-1 text-xs font-mono text-slate-500">
              {parseFloat(form.rValue) >= 1.5 ? "✓ Στόχος R:R" : parseFloat(form.rValue) >= 0 ? "↗ Κάτω από στόχο" : "✗ Loss"}
            </p>
          )}
        </Field>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Σημειώσεις">
            <input
              type="text" name="notes"
              placeholder="setup, ψυχολογία, λάθη..."
              value={form.notes} onChange={handleChange} className={inputCls()}
            />
          </Field>
        </div>

        <Field label="Screenshot (προαιρετικό)">

          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-700 rounded-md cursor-pointer hover:border-emerald-500/50 transition-colors bg-slate-900/50 overflow-hidden relative">
            {form.screenshot ? (
              <>
                <img src={form.screenshot} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <span className="relative z-10 text-xs text-white bg-slate-900/70 px-2 py-0.5 rounded">✓ Φορτώθηκε</span>
              </>
            ) : (
              <span className="text-xs text-slate-500 font-mono">+ Επιλογή εικόνας</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleScreenshot} />
          </label>
          {form.screenshot && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, screenshot: "" }))}
              className="mt-1 text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Αφαίρεση
            </button>
          )}
        </Field>
      </div>

      {Object.keys(errors).length > 0 && (
        <div id="form-error-banner" className="mt-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-400 text-sm font-mono flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          Συμπλήρωσε τα υποχρεωτικά πεδία (Entry, Exit, P/L €, P/L %)
        </div>
      )}

      <button
        onClick={saveTrade}
        className={`mt-4 w-full sm:w-auto px-6 py-3 sm:py-2.5 font-semibold rounded-md transition-colors flex items-center justify-center gap-2 text-base sm:text-sm ${
          editingId
            ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
        }`}
      >
        {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {editingId ? "Αποθήκευση" : "Καταχώρηση"}
      </button>
    </section>
  );
}
