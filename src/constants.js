export const TRADES_COLLECTION = "trades";
export const TRANSACTIONS_COLLECTION = "transactions";
export const INITIAL_CAPITAL = 270;
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
  "2026-09": 445,
  "2026-10": 733,
  "2026-11": 1208,
  "2026-12": 1992,
  "2027-01": 3282,
  "2027-02": 5409,
  "2027-03": 8914,
  "2027-04": 14690,
  "2027-05": 24209,
  "2027-06": 39897,
  "2027-07": 65750,
  "2027-08": 108355,
  "2027-09": 178570,
  "2027-10": 294283,
  "2027-11": 484978,
  "2027-12": 799243,
  "2028-01": 1317153,
  "2028-02": 2170668,
  "2028-03": 3577262,
  "2028-04": 5895327,
  "2028-05": 9715499,
  "2028-06": 16011143,
  "2028-07": 26386363,
  "2028-08": 43484726,
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
