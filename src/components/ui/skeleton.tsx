import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** A single shimmering placeholder block — layout-preserving loading primitive. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-border motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
