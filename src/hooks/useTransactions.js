import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc,
  doc, onSnapshot, query, orderBy,
} from "firebase/firestore";
import { TRANSACTIONS_COLLECTION } from "../constants";

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [txForm, setTxForm] = useState({ amount: "", type: "deposit", date: new Date().toISOString().split("T")[0], notes: "" });
  const [txError, setTxError] = useState("");

  useEffect(() => {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingTx(false);
    }, (err) => {
      console.error("Firestore tx error:", err);
      setLoadingTx(false);
    });
    return unsub;
  }, []);

  const saveTransaction = async () => {
    const amount = parseFloat(txForm.amount);
    if (!txForm.amount || isNaN(amount) || amount <= 0) {
      setTxError("Βάλε έγκυρο ποσό (> 0)");
      return;
    }
    setTxError("");
    try {
      await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        amount,
        type: txForm.type,
        date: txForm.date,
        notes: txForm.notes.trim(),
      });
      setTxForm((f) => ({ ...f, amount: "", notes: "" }));
    } catch (err) {
      console.error("Firestore tx save error:", err);
      setTxError("Αποτυχία αποθήκευσης. Δοκίμασε ξανά.");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
    } catch (err) {
      console.error("Firestore tx delete error:", err);
    }
  };

  const netTransactions = transactions.reduce((s, t) => {
    return s + (t.type === "deposit" ? t.amount : -t.amount);
  }, 0);

  return {
    transactions, loadingTx,
    txForm, setTxForm,
    txError,
    saveTransaction, deleteTransaction,
    netTransactions,
  };
}
