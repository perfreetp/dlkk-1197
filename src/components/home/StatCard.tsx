import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ResponsiveContainerProps } from "recharts";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/utils/helpers";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: number;
  trendLabel?: string;
  chartData?: { month: string; count: number }[];
  accent?: string;
  delay?: number;
}

const Responsive = ResponsiveContainer as unknown as React.FC<
  ResponsiveContainerProps & { children: ReactNode }
>;

export const StatCard = ({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendLabel,
  chartData,
  accent = "from-primary-400 to-primary-600",
  delay = 0,
}: StatCardProps) => {
  const isTrendUp = trend && trend > 0;

  return (
    <div
      className={cn(
        "card-base card-hover relative overflow-hidden animate-[fade-in-up_0.5s_ease-out_both]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl pointer-events-none",
          accent
        )}
      />

      <div className="p-5 relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              iconBg
            )}
          >
            <div className={iconColor}>{icon}</div>
          </div>

          {typeof trend === "number" && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                isTrendUp
                  ? "bg-success-50 text-success-600"
                  : "bg-danger-50 text-danger-600"
              )}
            >
              {isTrendUp ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {Math.abs(trend)}%
              {trendLabel && <span className="opacity-70"> {trendLabel}</span>}
            </div>
          )}
        </div>

        <div className="mb-1">
          <span className="text-sm text-neutral-500 font-medium">{label}</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
            {value}
          </span>
        </div>

        {chartData && chartData.length > 0 && (
          <div className="mt-4 h-16 -mx-1">
            <Responsive width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(v: number) => [`${v} 次`, label]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill={`url(#grad-${label})`}
                />
                <XAxis
                  dataKey="month"
                  hide
                />
                <YAxis hide />
              </AreaChart>
            </Responsive>
          </div>
        )}
      </div>
    </div>
  );
};
