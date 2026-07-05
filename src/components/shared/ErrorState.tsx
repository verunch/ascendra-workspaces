import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "The request failed. Your data is safe — try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-md border border-border bg-surface px-6 py-12 text-center shadow-card",
        className,
      )}
    >
      <div className="mb-3.5 flex size-11 items-center justify-center rounded-md bg-danger-subtle text-danger">
        <TriangleAlert className="size-5" aria-hidden="true" />
      </div>
      <p className="text-title-sm text-text-heading">{title}</p>
      <p className="mt-1.5 max-w-measure text-body-sm text-text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
