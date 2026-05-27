import { useMemo } from "react";
import { INITIAL_CAPITAL } from "../constants";
import { monthKey, monthLabel } from "../utils";

export function useMonthlyStats(trades, selectedMonth, netTransactions = 0) {
  const monthlyStats = useMemo(() => {
    const groups = {};
    trades.forEach((t) => {
      const k = monthKey(t.date);
      if (!groups[k]) groups[k] = [];
      groups[k].push(t);
    });

    return Object.entries(groups)
      .map(([month, list]) => {
        const wins = list.filter((t) => t.plEur > 0);
        const losses = list.filter((t) => t.plEur < 0);
        const totalEur = list.reduce((s, t) => s + t.plEur, 0);
        const totalPct = list.reduce((s, t) => s + t.plPct, 0);
        const best = list.reduce((b, t) => (b === null || t.plEur > b.plEur ? t : b), null);
        const worst = list.reduce((w, t) => (w === null || t.plEur < w.plEur ? t : w), null);
        const rTrades = list.filter((t) => t.rValue != null);
        const totalR = rTrades.reduce((s, t) => s + t.rValue, 0);
        const avgR = rTrades.length > 0 ? totalR / rTrades.length : null;
        return {
          month,
          label: monthLabel(month),
          total: list.length,
          wins: wins.length,
          losses: losses.length,
          winRate: list.length > 0 ? (wins.length / list.length) * 100 : 0,
          totalEur,
          totalPct,
          avgEur: list.length > 0 ? totalEur / list.length : 0,
          best,
          worst,
          totalR: rTrades.length > 0 ? totalR : null,
          avgR,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [trades]);

  const availableMonths = useMemo(
    () => [...monthlyStats].sort((a, b) => b.month.localeCompare(a.month)),
    [monthlyStats]
  );

  const allTimeStats = useMemo(() => {
    if (!trades.length) return null;
    const wins = trades.filter((t) => t.plEur > 0);
    const losses = trades.filter((t) => t.plEur < 0);
    const totalEur = trades.reduce((s, t) => s + t.plEur, 0);
    const totalPct = trades.reduce((s, t) => s + t.plPct, 0);
    const best = trades.reduce((b, t) => (b === null || t.plEur > b.plEur ? t : b), null);
    const worst = trades.reduce((w, t) => (w === null || t.plEur < w.plEur ? t : w), null);
    const rTrades = trades.filter((t) => t.rValue != null);
    const totalR = rTrades.reduce((s, t) => s + t.rValue, 0);
    const avgR = rTrades.length > 0 ? totalR / rTrades.length : null;
    return {
      month: "all",
      label: "Όλοι οι μήνες",
      total: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length > 0 ? (wins.length / trades.length) * 100 : 0,
      totalEur,
      totalPct,
      avgEur: trades.length > 0 ? totalEur / trades.length : 0,
      best,
      worst,
      totalR: rTrades.length > 0 ? totalR : null,
      avgR,
    };
  }, [trades]);

  const displayedStats = useMemo(() => {
    if (selectedMonth === "all") return allTimeStats;
    return monthlyStats.find((m) => m.month === selectedMonth) || null;
  }, [selectedMonth, monthlyStats, allTimeStats]);

  const currentCapital = useMemo(() => {
    const totalPl = trades.reduce((s, t) => s + (t.plEur || 0), 0);
    return INITIAL_CAPITAL + totalPl + netTransactions;
  }, [trades, netTransactions]);

  // Στόχος ξεκινάει από Ιούνιο 2026 — ο Μάιος είναι μεταβατικός μήνας
  const FIRST_TARGET_MONTH = "2026-06";

  const monthTarget = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (currentMonth < FIRST_TARGET_MONTH) return null;
    const thisMonthPl = trades
      .filter((t) => monthKey(t.date) === currentMonth)
      .reduce((s, t) => s + (t.plEur || 0), 0);
    const capitalAtMonthStart = currentCapital - thisMonthPl;
    const target = capitalAtMonthStart * 1.9;
    return { target, capitalAtMonthStart };
  }, [trades, currentCapital]);

  const displayedTrades = useMemo(() => {
    if (selectedMonth === "all") return trades;
    return trades.filter((t) => monthKey(t.date) === selectedMonth);
  }, [trades, selectedMonth]);

  return { monthlyStats, availableMonths, displayedStats, currentCapital, displayedTrades, monthTarget };
}
