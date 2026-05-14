export const fmt = (n, opts = {}) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return new Intl.NumberFormat("el-GR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  }).format(n);
};

export const monthKey = (dateStr) => dateStr.slice(0, 7);

export const monthLabel = (key) => {
  const [y, m] = key.split("-");
  const names = [
    "Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιούν",
    "Ιούλ", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ",
  ];
  return `${names[parseInt(m, 10) - 1]} ${y}`;
};

export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
