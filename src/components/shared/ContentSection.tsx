import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

export interface ContentSectionProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * A titled sub-section within a page (e.g. a card, table, or chart grouped
 * under its own heading). Pairs with PageHeader, which is for the page
 * itself — ContentSection is for the content blocks beneath it.
 */
export function ContentSection({
  title,
  description,
  action,
  className,
  children,
}: ContentSectionProps) {
  return (
    <section className={cn(className)}>
      {title && <SectionHeader title={title} description={description} action={action} />}
      <div className={cn(title ? "mt-4" : undefined)}>{children}</div>
    </section>
  );
}
