import { describe, it, expect } from 'vitest';

// validate logic extracted for testing (mirrors useTrades.js)
function validate(f) {
  const er = {};
  if (!f.date) er.date = 'Απαιτείται';
  if (!f.asset.trim()) er.asset = 'Απαιτείται';
  if (f.entry === '' || isNaN(parseFloat(f.entry))) er.entry = 'Μη έγκυρο';
  if (f.exit === '' || isNaN(parseFloat(f.exit))) er.exit = 'Μη έγκυρο';
  if (f.plEur === '' || isNaN(parseFloat(f.plEur))) er.plEur = 'Μη έγκυρο';
  if (f.plPct === '' || isNaN(parseFloat(f.plPct))) er.plPct = 'Μη έγκυρο (ή πέρνα P/L € για αυτόματο)';
  return er;
}

// auto P/L % logic (mirrors handleChange in useTrades.js)
function calcPlPct(plEur, currentCapital) {
  return ((plEur / currentCapital) * 100);
}

describe('validate', () => {
  const validForm = {
    date: '2026-05-14',
    asset: 'US30',
    direction: 'short',
    entry: '40000',
    exit: '40500',
    plEur: '-445',
    plPct: '-9.89',
    risk: '',
    notes: '',
    screenshot: '',
  };

  it('passes with valid form', () => {
    expect(validate(validForm)).toEqual({});
  });

  it('fails when date is missing', () => {
    expect(validate({ ...validForm, date: '' })).toHaveProperty('date');
  });

  it('fails when asset is empty', () => {
    expect(validate({ ...validForm, asset: '' })).toHaveProperty('asset');
  });

  it('fails when asset is only whitespace', () => {
    expect(validate({ ...validForm, asset: '   ' })).toHaveProperty('asset');
  });

  it('fails when entry is empty', () => {
    expect(validate({ ...validForm, entry: '' })).toHaveProperty('entry');
  });

  it('fails when entry is not a number', () => {
    expect(validate({ ...validForm, entry: 'abc' })).toHaveProperty('entry');
  });

  it('fails when exit is empty', () => {
    expect(validate({ ...validForm, exit: '' })).toHaveProperty('exit');
  });

  it('fails when plEur is empty', () => {
    expect(validate({ ...validForm, plEur: '' })).toHaveProperty('plEur');
  });

  it('fails when plPct is empty', () => {
    expect(validate({ ...validForm, plPct: '' })).toHaveProperty('plPct');
  });

  it('allows negative values for plEur', () => {
    expect(validate({ ...validForm, plEur: '-445' })).toEqual({});
  });

  it('returns multiple errors at once', () => {
    const errors = validate({ ...validForm, asset: '', entry: '' });
    expect(Object.keys(errors)).toHaveLength(2);
  });
});

describe('auto P/L % calculation', () => {
  it('calculates correct % for a loss', () => {
    expect(calcPlPct(-445, 4500)).toBeCloseTo(-9.89, 1);
  });

  it('calculates correct % for a gain', () => {
    expect(calcPlPct(200, 4500)).toBeCloseTo(4.44, 1);
  });

  it('calculates 0% for breakeven', () => {
    expect(calcPlPct(0, 4500)).toBe(0);
  });

  it('is negative when plEur is negative', () => {
    expect(calcPlPct(-100, 4500)).toBeLessThan(0);
  });

  it('is positive when plEur is positive', () => {
    expect(calcPlPct(100, 4500)).toBeGreaterThan(0);
  });

  it('scales correctly with capital', () => {
    // same loss, bigger capital = smaller %
    const pct1 = calcPlPct(-100, 1000);
    const pct2 = calcPlPct(-100, 2000);
    expect(Math.abs(pct1)).toBeGreaterThan(Math.abs(pct2));
  });
});
