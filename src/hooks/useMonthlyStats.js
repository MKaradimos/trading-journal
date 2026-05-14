import { useMemo } from "react";
import { INITIAL_CAPITAL } from "../constants";
import { monthKey, monthLabel } from "../utils";

export function useMonthlyStats(trades, selectedMonth) {
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
    };
  }, [trades]);

  const displayedStats = useMemo(() => {
    if (selectedMonth === "all") return allTimeStats;
    return monthlyStats.find((m) => m.month === selectedMonth) || null;
  }, [selectedMonth, monthlyStats, allTimeStats]);

  const currentCapital = useMemo(() => {
    const totalPl = trades.reduce((s, t) => s + (t.plEur || 0), 0);
    return INITIAL_CAPITAL + totalPl;
  }, [trades]);

  const displayedTrades = useMemo(() => {
    if (selectedMonth === "all") return trades;
    return trades.filter((t) => monthKey(t.date) === selectedMonth);
  }, [trades, selectedMonth]);

  return { monthlyStats, availableMonths, displayedStats, currentCapital, displayedTrades };
}
