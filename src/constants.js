export const TRADES_COLLECTION = "trades";
export const INITIAL_CAPITAL = 4500;

export const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  asset: "",
  direction: "long",
  entry: "",
  exit: "",
  risk: "",
  plEur: "",
  plPct: "",
  notes: "",
  screenshot: "",
};
