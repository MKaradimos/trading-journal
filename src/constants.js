export const TRADES_COLLECTION = "trades";
export const TRANSACTIONS_COLLECTION = "transactions";
export const INITIAL_CAPITAL = 400;
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
  "2026-09": 659,
  "2026-10": 1086,
  "2026-11": 1790,
  "2026-12": 2950,
  "2027-01": 4862,
  "2027-02": 8013,
  "2027-03": 13206,
  "2027-04": 21763,
  "2027-05": 35865,
  "2027-06": 59106,
  "2027-07": 97407,
  "2027-08": 160526,
  "2027-09": 264548,
  "2027-10": 435974,
  "2027-11": 718486,
  "2027-12": 1184064,
  "2028-01": 1951338,
  "2028-02": 3215805,
  "2028-03": 5299647,
  "2028-04": 8733818,
  "2028-05": 14393332,
  "2028-06": 23720211,
  "2028-07": 39090908,
  "2028-08": 64421817,
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
