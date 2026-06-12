import { cn } from "@/utils/helpers";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const Button = ({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
