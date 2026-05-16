export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelativeComplexity(value: number) {
  if (value >= 7) return "High complexity";
  if (value >= 4) return "Moderate complexity";
  return "Low complexity";
}
