/**
 * Charting libraries render SVG and can't consume Tailwind utility
 * classes for fill/stroke — these are the same literal values as the
 * corresponding tokens in tailwind.config.ts, kept here as the single
 * JS-side source so chart color usage stays traceable to the Design
 * System instead of ad-hoc hex scattered across chart components.
 */
export const CHART_COLORS = {
  primary: "#465D58", // primary-700
  primaryTint: "#A4BFBA", // primary-300
  success: "#3E9268",
  warning: "#C68A2E",
  danger: "#D95032",
  info: "#3E6FA8",
  neutral: "#8C8C8C", // text-muted
  grid: "#E4E4E4", // border
} as const;
