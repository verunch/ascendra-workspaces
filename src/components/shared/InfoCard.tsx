import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface InfoRow {
  label: string;
  value: ReactNode;
}

export interface InfoCardProps {
  title?: string;
  action?: ReactNode;
  /** Label/value rows rendered as a two-column list (metadata pattern). */
  rows?: InfoRow[];
  /** Fully custom content — used instead of `rows` when needed. */
  children?: ReactNode;
  className?: string;
}

/** Grouped metadata panel (e.g. VM specs, template details) — label left, value right. */
export function InfoCard({ title, action, rows, children, className }: InfoCardProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <h3 className="text-title-sm text-text-heading">{title}</h3>
          {action}
        </CardHeader>
      )}
      <CardContent>
        {rows ? (
          <dl className="divide-y divide-border">
            {rows.map((row, index) => (
              <div key={index} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                <dt className="text-body-sm text-text-secondary">{row.label}</dt>
                <dd className="font-mono text-body-sm text-text tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
