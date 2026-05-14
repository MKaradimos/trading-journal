import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMonthlyStats } from '../hooks/useMonthlyStats';

const trades = [
  { id: '1', date: '2026-05-01', asset: 'US30',   direction: 'short', entry: 40000, exit: 40500, risk: 1,    plEur: -445,  plPct: -9.89,  notes: '' },
  { id: '2', date: '2026-05-10', asset: 'EURUSD',  direction: 'long',  entry: 1.10,  exit: 1.12,  risk: 1.5,  plEur: 200,   plPct: 4.44,   notes: '' },
  { id: '3', date: '2026-04-15', asset: 'BTCUSDT', direction: 'long',  entry: 80000, exit: 85000, risk: 2,    plEur: 300,   plPct: 6.67,   notes: '' },
];

describe('useMonthlyStats', () => {
  it('groups trades by month correctly', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, 'all'));
    expect(result.current.monthlyStats).toHaveLength(2);
  });

  it('calculates wins and losses per month', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, '2026-05'));
    const may = result.current.monthlyStats.find((m) => m.month === '2026-05');
    expect(may.wins).toBe(1);
    expect(may.losses).toBe(1);
    expect(may.total).toBe(2);
  });

  it('calculates winRate correctly', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, '2026-05'));
    const may = result.current.monthlyStats.find((m) => m.month === '2026-05');
    expect(may.winRate).toBe(50);
  });

  it('calculates totalEur correctly for a month', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, '2026-05'));
    const may = result.current.monthlyStats.find((m) => m.month === '2026-05');
    expect(may.totalEur).toBeCloseTo(-245, 1);
  });

  it('returns all-time stats when selectedMonth is all', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, 'all'));
    const stats = result.current.displayedStats;
    expect(stats.total).toBe(3);
    expect(stats.wins).toBe(2);
    expect(stats.losses).toBe(1);
    expect(stats.totalEur).toBeCloseTo(55, 1);
    expect(stats.label).toBe('Όλοι οι μήνες');
  });

  it('all-time winRate is correct', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, 'all'));
    expect(result.current.displayedStats.winRate).toBeCloseTo(66.67, 1);
  });

  it('identifies best and worst trade', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, 'all'));
    const stats = result.current.displayedStats;
    expect(stats.best.id).toBe('3');
    expect(stats.worst.id).toBe('1');
  });

  it('calculates currentCapital correctly', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, 'all'));
    // INITIAL_CAPITAL=4500, totalPl = -445+200+300 = 55
    expect(result.current.currentCapital).toBe(4555);
  });

  it('filters displayedTrades by month', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, '2026-04'));
    expect(result.current.displayedTrades).toHaveLength(1);
    expect(result.current.displayedTrades[0].id).toBe('3');
  });

  it('returns all trades when selectedMonth is all', () => {
    const { result } = renderHook(() => useMonthlyStats(trades, 'all'));
    expect(result.current.displayedTrades).toHaveLength(3);
  });

  it('returns null displayedStats when no trades', () => {
    const { result } = renderHook(() => useMonthlyStats([], 'all'));
    expect(result.current.displayedStats).toBeNull();
  });
});
