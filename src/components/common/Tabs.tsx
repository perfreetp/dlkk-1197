import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";

interface TabItem {
  value: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeValue: string;
  onChange: (value: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

export const Tabs = ({
  tabs,
  activeValue,
  onChange,
  variant = "underline",
  className,
}: TabsProps) => {
  return (
    <div
      role="tablist"
      className={cn(
        variant === "underline"
          ? "flex items-center gap-1 border-b border-neutral-200"
          : "flex items-center gap-1 p-1 bg-neutral-100 rounded-btn",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        if (variant === "underline") {
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "text-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <span className="inline-flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-xs font-medium",
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "bg-neutral-200 text-neutral-600"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-full" />
              )}
            </button>
          );
        }
        return (
          <button
            key={tab.value}
            role="tab"
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex-1 px-4 py-2 rounded-btn text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-white text-neutral-800 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <span className="inline-flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full px-1.5 text-[11px] font-medium",
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "bg-neutral-200 text-neutral-600"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
