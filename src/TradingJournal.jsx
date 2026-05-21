import { useState } from "react";
import { X, LogOut } from "lucide-react";
import { logout } from "./firebase";

import { useTrades } from "./hooks/useTrades";
import { useMonthlyStats } from "./hooks/useMonthlyStats";
import { useTransactions } from "./hooks/useTransactions";

import CapitalPanel from "./components/CapitalPanel";
import TransactionPanel from "./components/TransactionPanel";
import TradeForm from "./components/TradeForm";
import MonthSelector from "./components/MonthSelector";
import StatsSection from "./components/StatsSection";
import MonthlyChart from "./components/MonthlyChart";
import TradeTable from "./components/TradeTable";
import MonthlySummary from "./components/MonthlySummary";
import ReportModal from "./components/ReportModal";
import { ConfirmDialog } from "./components/ui";

export default function TradingJournal({ user }) {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);

  const {
    trades, loading,
    form, setForm,
    editingId, errors,
    confirmId,
    handleChange, handleScreenshot,
    saveTrade, deleteTrade, confirmDelete, cancelDelete, startEdit, cancelEdit,
  } = useTrades();

  const {
    transactions,
    txForm, setTxForm,
    txError,
    saveTransaction, deleteTransaction,
    netTransactions,
  } = useTransactions();

  const {
    monthlyStats, availableMonths,
    displayedStats, currentCapital, displayedTrades, monthTarget,
  } = useMonthlyStats(trades, selectedMonth, netTransactions);

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200 font-sans">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 z-10 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full w-7 h-7 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={lightbox} alt="screenshot" className="max-h-[85vh] rounded-lg object-contain" />
          </div>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Θέλεις σίγουρα να διαγράψεις αυτό το trade;"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {reportOpen && (
        <ReportModal
          availableMonths={availableMonths}
          monthlyStats={monthlyStats}
          trades={trades}
          onDelete={deleteTrade}
          onClose={() => setReportOpen(false)}
          initialMonth={displayedStats?.month ?? availableMonths[0]?.month}
          currentCapital={currentCapital}
          monthTarget={monthTarget}
        />
      )}

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a0e14]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-400 font-mono text-sm">Σύνδεση...</span>
            </div>
          </div>
        )}

        <header className="mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-emerald-400 rounded-sm" />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Trading Journal</h1>
              </div>
              <p className="text-slate-500 text-sm font-mono ml-5">// καταγραφή • ανάλυση • βελτίωση</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {user.photoURL && (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-slate-700" />
              )}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {!loading && (
          <CapitalPanel
            currentCapital={currentCapital}
            monthTarget={monthTarget}
            currentMonthStats={monthlyStats.find((m) => m.month === new Date().toISOString().slice(0, 7)) ?? null}
          />
        )}

        {!loading && (
          <TransactionPanel
            transactions={transactions}
            txForm={txForm}
            setTxForm={setTxForm}
            txError={txError}
            saveTransaction={saveTransaction}
            deleteTransaction={deleteTransaction}
          />
        )}

        <TradeForm
          form={form} setForm={setForm}
          editingId={editingId} errors={errors}
          handleChange={handleChange} handleScreenshot={handleScreenshot}
          saveTrade={saveTrade} cancelEdit={cancelEdit}
          currentCapital={currentCapital}
        />

        <MonthSelector
          availableMonths={availableMonths}
          displayedStats={displayedStats}
          setSelectedMonth={setSelectedMonth}
          onOpenReport={() => setReportOpen(true)}
        />

        <StatsSection displayedStats={displayedStats} />

        <MonthlyChart monthlyStats={monthlyStats} />

        <section className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Ιστορικό Trades</h2>
            <span className="text-xs text-slate-500 font-mono">
              {displayedTrades.length} {displayedTrades.length === 1 ? "καταχώρηση" : "καταχωρήσεις"}
            </span>
          </div>
          <TradeTable
            trades={displayedTrades}
            onEdit={startEdit}
            onDelete={deleteTrade}
            onLightbox={setLightbox}
          />
        </section>

        <MonthlySummary trades={displayedTrades} stats={displayedStats} />

        <footer className="mt-10 text-center text-xs text-slate-600 font-mono">
          Firebase Firestore · real-time sync
        </footer>
      </div>
    </div>
  );
}
