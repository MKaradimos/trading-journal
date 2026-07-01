export const TRADES_COLLECTION = "trades";
export const TRANSACTIONS_COLLECTION = "transactions";
export const INITIAL_CAPITAL = 2500;

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
  "2026-07": 3250,
  "2026-08": 4225,
  "2026-09": 5493,
  "2026-10": 7141,
  "2026-11": 9283,
  "2026-12": 12068,
  "2027-01": 15688,
  "2027-02": 20394,
  "2027-03": 26512,
  "2027-04": 34466,
  "2027-05": 44806,
  "2027-06": 58248,
  "2027-07": 75722,
  "2027-08": 98439,
  "2027-09": 127971,
  "2027-10": 166362,
  "2027-11": 216271,
  "2027-12": 281152,
  "2028-01": 365498,
  "2028-02": 475147,
  "2028-03": 617691,
  "2028-04": 802998,
  "2028-05": 1043897,
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
