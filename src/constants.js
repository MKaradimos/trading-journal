export const TRADES_COLLECTION = "trades";
export const TRANSACTIONS_COLLECTION = "transactions";
export const INITIAL_CAPITAL = 2500;
export const MONTHLY_TARGET_PCT = 64.8;

export const ASSET_TYPES = [
  { value: "forex",  label: "Forex",  multiplier: 10000 },
  { value: "jpy",    label: "Forex JPY", multiplier: 100 },
  { value: "index",  label: "Index",  multiplier: 1 },
  { value: "crypto", label: "Crypto", multiplier: 1 },
];

const INDEX_PATTERNS = /^(US30|US100|US500|SPX|NAS|DAX|FTSE|DOW|NDX|SP500|CAC|NIKKEI|ASX|UK100|GER|FRA)/i;
const CRYPTO_PATTERNS = /^(BTC|ETH|XRP|SOL|BNB|ADA|DOGE|LTC|AVAX|DOT|MATIC|LINK)/i;
const JPY_PATTERNS = /JPY/i;

export function detectAssetType(asset) {
  if (!asset) return null;
  const a = asset.trim().toUpperCase();
  if (INDEX_PATTERNS.test(a)) return "index";
  if (CRYPTO_PATTERNS.test(a)) return "crypto";
  if (JPY_PATTERNS.test(a)) return "jpy";
  return "forex";
}

export const MONTHLY_R_TARGET = { min: 7, max: 9 };

export const MONTHLY_CAPITAL_TARGETS = {
  "2026-07": 4119,
  "2026-08": 6786,
  "2026-09": 11180,
  "2026-10": 18420,
  "2026-11": 30348,
  "2026-12": 50000,
  "2027-01": 82377,
  "2027-02": 135720,
  "2027-03": 223605,
  "2027-04": 368400,
  "2027-05": 606957,
  "2027-06": 1000000,
};

export const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  asset: "",
  assetType: "forex",
  direction: "long",
  entry: "",
  stopLoss: "",
  exit: "",
  risk: "",
  plEur: "",
  plPct: "",
  pips: "",
  rValue: "",
  notes: "",
  screenshot: "",
  energy: "",
  stress: "",
  confidence: "",
  followedPlan: null,
};
