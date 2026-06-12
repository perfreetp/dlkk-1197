import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  className,
  hoverable = false,
  onClick,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "card-base overflow-hidden",
        hoverable && "card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-4 border-b border-neutral-100",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

Card.Body = function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("p-5", className)}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-4 border-t border-neutral-100 bg-neutral-50/50",
        className
      )}
    >
      {children}
    </div>
  );
};
