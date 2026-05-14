import { describe, it, expect } from 'vitest';
import { fmt, monthKey, monthLabel } from '../utils';

describe('fmt', () => {
  it('formats positive number', () => {
    expect(fmt(1234.5)).toBe('1.234,50');
  });

  it('formats negative number', () => {
    expect(fmt(-445)).toBe('-445,00');
  });

  it('formats zero', () => {
    expect(fmt(0)).toBe('0,00');
  });

  it('returns dash for null', () => {
    expect(fmt(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(fmt(undefined)).toBe('—');
  });

  it('returns dash for NaN', () => {
    expect(fmt(NaN)).toBe('—');
  });

  it('respects custom maximumFractionDigits', () => {
    expect(fmt(1.123456, { maximumFractionDigits: 6 })).toBe('1,123456');
  });
});

describe('monthKey', () => {
  it('extracts YYYY-MM from date string', () => {
    expect(monthKey('2026-05-14')).toBe('2026-05');
  });
});

describe('monthLabel', () => {
  it('returns Greek month name and year', () => {
    expect(monthLabel('2026-05')).toBe('Μάι 2026');
  });

  it('handles January', () => {
    expect(monthLabel('2026-01')).toBe('Ιαν 2026');
  });

  it('handles December', () => {
    expect(monthLabel('2026-12')).toBe('Δεκ 2026');
  });
});
