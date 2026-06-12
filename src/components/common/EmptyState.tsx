import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon = <Inbox size={48} className="text-neutral-300" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-5 p-5 rounded-full bg-neutral-50">{icon}</div>
      <h4 className="font-serif text-lg font-semibold text-neutral-800 mb-2">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};
