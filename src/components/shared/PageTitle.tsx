import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageTitle({ title, description, action, className }: PageTitleProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-h1 text-text-heading">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-measure text-body-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
