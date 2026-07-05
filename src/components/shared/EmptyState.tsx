import type { ComponentType, ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-md border border-border bg-surface px-6 py-12 text-center shadow-card",
        className,
      )}
    >
      <div className="mb-3.5 flex size-11 items-center justify-center rounded-md border border-dashed border-primary-200 text-primary-300">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p className="text-title-sm text-text-heading">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-measure text-body-sm text-text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
