import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export interface QuickActionCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Reusable quick-action button. Not wired to any backend yet (matches
 * the brief's own "Connect button can be a non-functional stub" pattern)
 * — real, focusable, and fully styled rather than a disabled placeholder.
 */
export function QuickActionCard({ icon: Icon, label, description, onClick, className }: QuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-md border border-border bg-surface p-4 text-left shadow-card transition-colors",
        "hover:border-primary-300 hover:bg-primary-subtle",
        "focus-visible:outline-none focus-visible:border-primary-700 focus-visible:shadow-focus-ring",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-body-sm font-semibold text-text-heading">{label}</span>
        <span className="block text-caption text-text-muted">{description}</span>
      </span>
    </button>
  );
}
