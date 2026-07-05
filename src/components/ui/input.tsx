import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { DISABLED_CONTROL_CLASSES } from "@/lib/variants";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-control-md w-full rounded-md border bg-surface px-3 text-body-sm text-text placeholder:text-text-faint outline-none transition-colors",
        "focus-visible:shadow-focus-ring",
        error
          ? "border-danger focus-visible:border-danger focus-visible:shadow-focus-ring-danger"
          : "border-border-strong focus-visible:border-primary-700",
        DISABLED_CONTROL_CLASSES,
        className,
      )}
      aria-invalid={error || undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";
