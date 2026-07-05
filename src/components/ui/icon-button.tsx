import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { DISABLED_CONTROL_CLASSES } from "@/lib/variants";

const iconButtonVariants = cva(
  `inline-flex shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:border-primary-700 focus-visible:shadow-focus-ring ${DISABLED_CONTROL_CLASSES}`,
  {
    variants: {
      variant: {
        primary: "border border-primary-700 bg-primary-700 text-on-primary hover:bg-primary-800 hover:border-primary-800 active:bg-primary-900 active:border-primary-900",
        secondary: "border border-border-strong bg-surface text-text-secondary hover:bg-surface-subtle",
        ghost: "border border-transparent bg-transparent text-text-secondary hover:bg-primary-subtle hover:text-primary-700",
        destructive: "border border-critical-500 bg-critical-500 text-white hover:bg-critical-600 hover:border-critical-600",
      },
      size: {
        sm: "h-control-sm w-control-sm [&_svg]:size-3.5",
        md: "h-control-md w-control-md [&_svg]:size-4",
        lg: "h-control-lg w-control-lg [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required — the button has no visible text label. */
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
