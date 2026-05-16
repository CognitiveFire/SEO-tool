import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[color:var(--border-strong)] bg-[color:var(--foreground)] px-4 py-2 text-[color:var(--background)] shadow-[0_12px_40px_rgba(17,24,39,0.12)] hover:bg-[color:var(--foreground-soft)]",
        accent:
          "border-orange-600/30 bg-[color:var(--accent)] px-4 py-2 text-white shadow-[0_12px_40px_rgba(240,90,40,0.25)] hover:opacity-90",
        secondary:
          "border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-[color:var(--foreground)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]",
        ghost: "border-transparent px-3 py-2 text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
