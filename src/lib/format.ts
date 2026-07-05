const RELATIVE_UNITS: { limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 2592000, divisor: 86400, unit: "day" },
  { limit: 31536000, divisor: 2592000, unit: "month" },
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Formats an ISO timestamp as "2h ago" / "3 days ago" relative to now. */
export function formatRelativeTime(iso: string): string {
  const diffSeconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const absSeconds = Math.abs(diffSeconds);

  for (const { limit, divisor, unit } of RELATIVE_UNITS) {
    if (absSeconds < limit) {
      return relativeTimeFormatter.format(Math.round(diffSeconds / divisor), unit);
    }
  }

  return relativeTimeFormatter.format(Math.round(diffSeconds / 31536000), "year");
}

/** Formats USD without forcing decimals for whole numbers (e.g. "$553" not "$553.00"). */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

/** Formats the duration since an ISO timestamp as "2d 4h" / "3h 12m" / "12m" — VM uptime. */
export function formatDuration(startIso: string): string {
  const totalMinutes = Math.max(0, Math.floor((Date.now() - new Date(startIso).getTime()) / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
