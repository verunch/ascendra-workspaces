import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { PageTitle } from "./PageTitle";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Every route page repeated the same Breadcrumbs + PageTitle pairing —
 * this consolidates it into one reusable block so pages compose it once
 * instead of hand-wiring the pair each time (docs/architecture.md §9).
 */
export function PageHeader({ breadcrumbs, title, description, action, className }: PageHeaderProps) {
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  return (
    <div className={cn(className)}>
      {hasBreadcrumbs && <Breadcrumbs items={breadcrumbs!} />}
      <PageTitle
        title={title}
        description={description}
        action={action}
        className={hasBreadcrumbs ? "mt-2" : undefined}
      />
    </div>
  );
}
