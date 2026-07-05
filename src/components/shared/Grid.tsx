import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GridCols = 2 | 3 | 4;

export interface GridProps {
  /** Column count at the desktop baseline (1280px+); collapses gracefully below that. */
  cols?: GridCols;
  className?: string;
  children: ReactNode;
}

const colsClassMap: Record<GridCols, string> = {
  2: "grid-cols-2 max-sm:grid-cols-1",
  3: "grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1",
  4: "grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1",
};

/**
 * Desktop-first responsive grid for arranging cards (StatCard rows, etc.).
 * Authored at the full desktop column count and collapses downward via
 * `max-*` variants, matching the project's desktop-first breakpoint
 * strategy (docs/architecture.md — responsive requirements).
 */
export function Grid({ cols = 4, className, children }: GridProps) {
  return <div className={cn("grid gap-4", colsClassMap[cols], className)}>{children}</div>;
}
