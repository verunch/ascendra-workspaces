import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 items-center gap-1.5 rounded-md border px-2.5 text-caption font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-border bg-bg text-text-secondary",
        primary: "border-primary-200 bg-primary-subtle text-primary-900",
        success: "border-success-border bg-success-subtle text-success-foreground",
        warning: "border-warning-border bg-warning-subtle text-warning-foreground",
        danger: "border-danger-border bg-danger-subtle text-danger-foreground",
        info: "border-info-border bg-info-subtle text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

const dotColorByVariant: Record<NonNullable<VariantProps<typeof badgeVariants>["variant"]>, string> = {
  neutral: "bg-text-muted",
  primary: "bg-primary-700",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Renders a small colored dot before the label — status is never color-only. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", dot = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", dotColorByVariant[variant ?? "neutral"])}
        />
      )}
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";
