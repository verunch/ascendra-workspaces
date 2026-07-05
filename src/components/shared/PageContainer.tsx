import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Consistent page padding for every route. Deliberately full-width (no
 * max-width cap) — this is a dense enterprise dashboard, so tables and
 * charts should use the available viewport rather than letterboxing at
 * 1280px on 1600–1920px screens. Prose-like content can opt into
 * `max-w-content` / `max-w-measure` itself where appropriate.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("px-6 py-8 xl:px-8", className)}>{children}</div>;
}
