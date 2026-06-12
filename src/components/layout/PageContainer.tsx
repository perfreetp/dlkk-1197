import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <main className={`container py-6 pb-24 lg:pb-6 animate-[fade-in-up_0.4s_ease-out] ${className}`}>
      {children}
    </main>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  className = "",
}: PageHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
      <div className="min-w-0">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm md:text-base text-neutral-500 mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
