import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { DISABLED_CONTROL_CLASSES } from "@/lib/variants";

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:border-primary-700 focus-visible:shadow-focus-ring ${DISABLED_CONTROL_CLASSES}`,
  {
    variants: {
      variant: {
        primary: "border border-primary-700 bg-primary-700 text-on-primary hover:bg-primary-800 hover:border-primary-800 active:bg-primary-900 active:border-primary-900",
        secondary: "border border-border-strong bg-surface text-text hover:bg-surface-subtle",
        ghost: "border border-transparent bg-transparent text-primary-700 hover:bg-primary-subtle",
        destructive: "border border-critical-500 bg-critical-500 text-white hover:bg-critical-600 hover:border-critical-600",
      },
      size: {
        sm: "h-control-sm px-3 text-caption",
        md: "h-control-md px-4 text-body-sm",
        lg: "h-control-lg px-5 text-body",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
