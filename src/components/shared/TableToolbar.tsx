import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TableToolbarProps {
  title: string;
  description?: string;
  /** Primary action, e.g. a "+ New" button. */
  action?: ReactNode;
  /** Optional filter row (SearchBar/FilterBar) rendered below the title row. */
  children?: ReactNode;
  className?: string;
}

/**
 * Header strip for a table-containing Card — title/action row, plus an
 * optional filter row beneath it. Mirrors CardHeader's surface-subtle
 * treatment intentionally, but isn't built on CardHeader directly since it
 * needs a second row that CardHeader's shape doesn't accommodate.
 */
export function TableToolbar({ title, description, action, children, className }: TableToolbarProps) {
  return (
    <div className={cn("rounded-t-md border-b border-border bg-surface-subtle", className)}>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <h3 className="text-title-sm text-text-heading">{title}</h3>
          {description && <p className="mt-0.5 text-caption text-text-muted">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children && <div className="border-t border-border px-5 py-3">{children}</div>}
    </div>
  );
}
