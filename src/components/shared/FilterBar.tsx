import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  /** Filter controls — SearchBar, Select, etc. */
  children: ReactNode;
  /** Trailing slot, e.g. a "Clear filters" ghost button. */
  action?: ReactNode;
  className?: string;
}

/**
 * Lays out a row of filter controls consistently and wraps gracefully at
 * narrow widths instead of overflowing. Purely presentational — filter
 * state and logic live in whichever page composes this.
 */
export function FilterBar({ children, action, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
