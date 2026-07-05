import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps {
  /** Number of skeleton rows to render (ignored when variant="cards"). */
  rows?: number;
  /** "lines" for text-list placeholders, "cards" for a stat/card-grid placeholder. */
  variant?: "lines" | "cards";
  /** Number of placeholder cards to render when variant="cards". */
  cards?: number;
  className?: string;
}

/**
 * Layout-preserving shimmer placeholder for any async data surface.
 * Every future page should reuse this instead of a bespoke skeleton.
 */
export function LoadingSkeleton({
  rows = 4,
  variant = "lines",
  cards = 4,
  className,
}: LoadingSkeletonProps) {
  if (variant === "cards") {
    return (
      <div
        role="status"
        aria-label="Loading"
        className={cn("grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1", className)}
      >
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="rounded-md border border-border bg-surface p-5 shadow-card"
          >
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="mt-3 h-7 w-1/2" />
          </div>
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "space-y-3 rounded-md border border-border bg-surface px-6 py-8 shadow-card",
        className,
      )}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className={cn("h-4", index === rows - 1 ? "w-2/3" : "w-full")} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
