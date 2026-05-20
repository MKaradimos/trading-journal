import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy,
} from "firebase/firestore";
import { TRADES_COLLECTION, emptyForm, ASSET_TYPES, detectAssetType, SETUP_QUALITY } from "../constants";
import { readFileAsDataURL } from "../utils";

export function useTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, TRADES_COLLECTION), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTrades(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleChange = (e, currentCapital) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };

      // Auto-detect asset type when asset name changes
      if (name === "asset") {
        const detected = detectAssetType(value);
        if (detected) updated.assetType = detected;
      }

      const entry     = parseFloat(name === "entry"    ? value : f.entry);
      const stopLoss  = parseFloat(name === "stopLoss" ? value : f.stopLoss);
      const exit      = parseFloat(name === "exit"     ? value : f.exit);
      const plEur     = parseFloat(name === "plEur"    ? value : f.plEur);
      const direction = name === "direction" ? value : f.direction;
      const assetType = name === "assetType" ? value : (name === "asset" ? (detectAssetType(value) ?? f.assetType) : f.assetType);
      const multiplier = ASSET_TYPES.find((a) => a.value === assetType)?.multiplier ?? 1;

      // Auto P/L %
      if (!isNaN(plEur) && currentCapital > 0) {
        updated.plPct = String(((plEur / currentCapital) * 100).toFixed(2));
      }

      // Auto Pips
      if (!isNaN(entry) && !isNaN(exit)) {
        const rawPips = direction === "long" ? (exit - entry) * multiplier : (entry - exit) * multiplier;
        updated.pips = String(parseFloat(rawPips.toFixed(1)));
      }

      // Auto Risk %
      if (!isNaN(entry) && !isNaN(stopLoss) && !isNaN(plEur) && !isNaN(exit) && currentCapital > 0 && entry !== stopLoss) {
        const slDistance = Math.abs(entry - stopLoss);
        const tpDistance = Math.abs(exit - entry);
        if (tpDistance > 0) {
          const riskEur = Math.abs(plEur) * (slDistance / tpDistance);
          updated.risk = String(((riskEur / currentCapital) * 100).toFixed(2));

          // Auto R value = P/L € ÷ Risk €
          const rVal = plEur / riskEur;
          updated.rValue = String(parseFloat(rVal.toFixed(2)));
        }
      }

      return updated;
    });
    if (errors[name]) setErrors((er) => ({ ...er, [name]: null }));
  };

  const handleScreenshot = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    // Firestore document limit is 1MB; base64 adds ~33% overhead
    if (file.size > 700_000) {
      alert("Η εικόνα είναι πολύ μεγάλη (max ~700KB). Χρησιμοποίησε μικρότερη εικόνα ή screenshot.");
      e.target.value = "";
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setForm((f) => ({ ...f, screenshot: dataUrl }));
    } catch {
      console.warn("Αδυναμία φόρτωσης εικόνας");
    }
  };

  const validate = (f = form) => {
    const er = {};
    if (!f.date) er.date = "Απαιτείται";
    if (!f.asset.trim()) er.asset = "Απαιτείται";
    if (f.entry === "" || isNaN(parseFloat(f.entry))) er.entry = "Μη έγκυρο";
    if (f.exit === "" || isNaN(parseFloat(f.exit))) er.exit = "Μη έγκυρο";
    if (f.plEur === "" || isNaN(parseFloat(f.plEur))) er.plEur = "Μη έγκυρο";
    if (f.plPct === "" || isNaN(parseFloat(f.plPct))) er.plPct = "Μη έγκυρο (ή πέρνα P/L € για αυτόματο)";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const buildPayload = () => ({
    date: form.date,
    asset: form.asset.trim().toUpperCase(),
    assetType: form.assetType,
    direction: form.direction,
    entry: parseFloat(form.entry),
    stopLoss: form.stopLoss === "" ? null : parseFloat(form.stopLoss),
    exit: parseFloat(form.exit),
    risk: form.risk === "" ? null : parseFloat(form.risk),
    plEur: parseFloat(form.plEur),
    plPct: parseFloat(form.plPct),
    pips: form.pips === "" ? null : parseFloat(form.pips),
    rValue: form.rValue === "" ? null : parseFloat(form.rValue),
    setup: form.setup || "aplus",
    notes: form.notes.trim(),
    screenshot: form.screenshot,
  });

  const saveTrade = async () => {
    if (!validate()) {
      setTimeout(() => {
        document.getElementById("form-error-banner")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, TRADES_COLLECTION, editingId), buildPayload());
        setEditingId(null);
      } else {
        await addDoc(collection(db, TRADES_COLLECTION), buildPayload());
      }
      setForm({ ...emptyForm, date: form.date });
      setErrors({});
    } catch (err) {
      console.error("Firestore save error:", err);
      alert("Αποτυχία αποθήκευσης. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.");
    }
  };

  const deleteTrade = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteDoc(doc(db, TRADES_COLLECTION, confirmId));
      if (editingId === confirmId) cancelEdit();
    } catch (err) {
      console.error("Firestore delete error:", err);
      alert("Αποτυχία διαγραφής. Δοκίμασε ξανά.");
    } finally {
      setConfirmId(null);
    }
  };

  const cancelDelete = () => setConfirmId(null);

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      date: t.date,
      asset: t.asset,
      assetType: t.assetType || "forex",
      direction: t.direction,
      entry: String(t.entry),
      stopLoss: t.stopLoss != null ? String(t.stopLoss) : "",
      exit: String(t.exit),
      risk: t.risk != null ? String(t.risk) : "",
      plEur: String(t.plEur),
      plPct: String(t.plPct),
      pips: t.pips != null ? String(t.pips) : "",
      rValue: t.rValue != null ? String(t.rValue) : "",
      setup: t.setup || "aplus",
      notes: t.notes || "",
      screenshot: t.screenshot || "",
    });
    setErrors({});
    setTimeout(() => {
      document.getElementById("trade-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  return {
    trades, loading,
    form, setForm,
    editingId,
    errors,
    confirmId,
    handleChange, handleScreenshot,
    saveTrade, deleteTrade, confirmDelete, cancelDelete, startEdit, cancelEdit,
  };
}
