import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
  {
    variants: {
      variant: {
        default:
          "border border-primary-border bg-primary-muted text-primary",
        secondary:
          "border border-border bg-surface-hover text-foreground",
        destructive:
          "border border-destructive-border bg-destructive-muted text-destructive",
        purple:
          "border border-role-admin-border bg-role-admin-muted text-role-admin",
        amber:
          "border border-warning-border bg-warning-muted text-warning",
        outline: "border border-border text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
