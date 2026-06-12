import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";

type Variant = "default" | "primary" | "success" | "warning" | "danger";
type Size = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  dot?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: "chip",
  primary: "chip-primary",
  success: "chip-success",
  warning: "chip-warning",
  danger: "chip-danger",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-xs px-3 py-1",
};

const dotColors: Record<Variant, string> = {
  default: "bg-neutral-500",
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
  dot = false,
  icon,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            dotColors[variant],
            "animate-pulse-soft"
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
