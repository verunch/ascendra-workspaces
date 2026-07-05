import { useEffect, useRef } from "react";

/**
 * Recharts renders a raw <svg> and — depending on version/chart type —
 * can auto-inject `role="application"` and a `tabindex`, making the whole
 * chart an independently focusable stop that screen readers announce as
 * a jumbled concatenation of every text node inside it. The fix is the
 * standard SVG-accessibility pattern: describe the chart once via
 * `role="img"` + `aria-label` on a wrapping element (spread the return
 * value onto that element), and hide/un-focus the SVG itself so it isn't
 * separately (and confusingly) exposed to assistive tech.
 */
export function useChartAccessibility<T extends HTMLElement>(ariaLabel: string) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.removeAttribute("tabindex");
    svg.removeAttribute("role");
  });

  return { ref: containerRef, role: "img" as const, "aria-label": ariaLabel };
}
