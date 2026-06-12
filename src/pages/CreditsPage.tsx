import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Star,
  TrendingUp,
  Award,
  Flag,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  Plus,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer as RC,
  ResponsiveContainerProps,
} from "recharts";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { useUserStore } from "@/store/userStore";
import { useCreditStore } from "@/store/creditStore";
import { useApplicationStore } from "@/store/applicationStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { cn } from "@/utils/helpers";
import { formatRelativeTime, statusTextMap } from "@/utils/format";
import type { ReviewDimensions } from "@/types";

const Responsive = RC as unknown as React.FC<ResponsiveContainerProps & { children: React.ReactNode }>;

export default function CreditsPage() {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const stats = useUserStore((s) => s.statistics);
  const allReviews = useCreditStore((s) => s.reviews);
  const allRecords = useCreditStore((s) => s.creditRecords);
  const getAverageDimensions = useCreditStore((s) => s.getAverageDimensions);
  const toggleReport = useCreditStore((s) => s.toggleReportModal);
  const toggleReview = useCreditStore((s) => s.toggleReviewModal);
  const opportunities = useOpportunityStore((s) => s.opportunities);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  
  const reviews = useMemo(
    () => (curUser ? allReviews.filter((r) => r.revieweeId === curUser.id) : []),
    [allReviews, curUser?.id]
  );
  const records = useMemo(
    () => (curUser ? allRecords.filter((r) => r.userId === curUser.id) : []),
    [allRecords, curUser?.id]
  );
  const avgDims = useMemo(
    () => getAverageDimensions(curUser?.id || ""),
    [allReviews, curUser?.id]
  );

  const [tab, setTab] = useState("overview");

  const radarData = [
    { subject: "响应速度", A: avgDims.responseSpeed, full: 5 },
    { subject: "守约率", A: avgDims.keepingPromise, full: 5 },
    { subject: "沟通态度", A: avgDims.communication, full: 5 },
    { subject: "推荐质量", A: avgDims.quality, full: 5 },
  ];

  const tabs = [
    { value: "overview", label: "评分概览", icon: <BarChart3 size={15} /> },
    { value: "reviews", label: "评价列表", count: reviews.length, icon: <Star size={15} /> },
    { value: "records", label: "信用记录", count: records.length, icon: <Award size={15} /> },
  ];

  const scoreProgress = ((curUser?.creditScore || 0) / 100) * 283;

  return (
    <PageContainer>
      <PageHeader
        title="信用记录"
        subtitle="守约评分是平台信任体系的核心，守约越多，匹配机会越多"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => toggleReview(true)}
            >
              去评价
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Flag size={14} />}
              onClick={() => toggleReport(true)}
            >
              举报异常
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card className="xl:col-span-1 overflow-hidden animate-[fade-in-up_0.4s_ease-out]">
          <div className="relative p-8 pb-6 text-center bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-success-400/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium mb-4">
                <ShieldCheck size={13} />
                综合守约评分
              </div>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${scoreProgress} 283`}
                    style={{ transition: "stroke-dasharray 1s ease-out" }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-5xl font-bold text-white drop-shadow-sm">
                    {curUser?.creditScore}
                  </span>
                  <span className="text-xs text-white/70 mt-0.5">/ 100</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-2 text-sm">
                <TrendingUp size={14} className="text-success-300" />
                <span>本月上升 3 分，超过平台</span>
                <span className="font-semibold text-warning-300">92%</span>
                <span>用户</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-white/15">
                <div>
                  <div className="font-serif text-2xl font-bold">{reviews.length}</div>
                  <div className="text-xs text-white/70">评价数</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold">
                    {stats.totalSuccessReferrals}
                  </div>
                  <div className="text-xs text-white/70">成功推荐</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold">
                    {curUser ? (
                      [
                        curUser.verifiedIdentity,
                        curUser.verifiedCompany,
                        curUser.verifiedEducation,
                      ].filter(Boolean).length
                    ) : 0}
                    /3
                  </div>
                  <div className="text-xs text-white/70">认证</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2 animate-[fade-in-up_0.4s_ease-out_100ms]">
          <Card.Header>
            <h3 className="font-serif text-lg font-semibold text-neutral-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-500" />
              五维能力雷达
            </h3>
            <Badge variant="primary" size="sm">
              基于 {reviews.length} 条真实评价
            </Badge>
          </Card.Header>
          <Card.Body className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <Responsive width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="80%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fontSize: 12,
                        fill: "#475569",
                        fontWeight: 500,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 5]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="评分"
                      dataKey="A"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fill="#0ea5e9"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </Responsive>
              </div>
              <div className="space-y-3 flex flex-col justify-center">
                {(Object.keys(avgDims) as (keyof ReviewDimensions)[]).map(
                  (key, i) => {
                    const labels: Record<keyof ReviewDimensions, string> = {
                      responseSpeed: "响应速度",
                      keepingPromise: "守约率",
                      communication: "沟通态度",
                      quality: "推荐质量",
                    };
                    const v = avgDims[key];
                    return (
                      <div
                        key={key}
                        className="animate-[fade-in-up_0.3s_ease-out_both]"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-700">
                            {labels[key]}
                          </span>
                          <span className="text-sm font-semibold text-primary-700">
                            {v.toFixed(1)} / 5.0
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-success-500 transition-all duration-700 ease-out"
                            style={{ width: `${(v / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
                <div className="pt-3 mt-2 border-t border-neutral-100 p-3 rounded-xl bg-success-50/60 border border-success-100">
                  <p className="text-xs text-success-700 leading-relaxed flex items-start gap-1.5">
                    <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                    你的守约评分处于平台前 10%，可解锁优先推荐、特权岗位等多项权益。
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card className="overflow-hidden animate-[fade-in-up_0.4s_ease-out_200ms]">
        <div className="px-1 pt-1">
          <Tabs tabs={tabs} activeValue={tab} onChange={setTab} />
        </div>
        <Card.Body>
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.length === 0 ? (
                <div className="md:col-span-2">
                  <EmptyState title="暂无信用记录" />
                </div>
              ) : (
                records.slice(0, 6).map((r, i) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition animate-[fade-in-up_0.3s_ease-out_both]"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          r.type === "success" &&
                            "bg-success-100 text-success-600",
                          r.type === "review" &&
                            "bg-warning-100 text-warning-600",
                          r.type === "warning" &&
                            "bg-danger-100 text-danger-600",
                          (!r.type || r.type === "report") &&
                            "bg-neutral-100 text-neutral-500"
                        )}
                      >
                        {r.type === "success" ? (
                          <Award size={18} />
                        ) : r.type === "review" ? (
                          <Star size={18} />
                        ) : r.type === "warning" ? (
                          <AlertTriangle size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-semibold text-neutral-800 text-sm">
                            {r.title}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-bold shrink-0",
                              r.scoreChange > 0
                                ? "text-success-600"
                                : "text-danger-600"
                            )}
                          >
                            {r.scoreChange > 0 ? "+" : ""}
                            {r.scoreChange} 分
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {r.description}
                        </p>
                        <div className="text-[11px] text-neutral-400 mt-1.5 flex items-center gap-1">
                          <Clock size={10} />
                          {formatRelativeTime(r.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div>
              {reviews.length === 0 ? (
                <EmptyState
                  title="还没有评价"
                  description="完成首次内推交换并互评后，评价将展示在这里"
                />
              ) : (
                <div className="space-y-3">
                  {reviews.map((r, i) => {
                    const reviewer = useUserStore
                      .getState()
                      .getUserById(r.reviewerId);
                    return (
                      <div
                        key={r.id}
                        className="p-5 rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 hover:shadow-sm transition animate-[fade-in-up_0.3s_ease-out_both]"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex items-start gap-4 mb-3">
                          <Avatar
                            name={reviewer?.name || "用户"}
                            size="md"
                            src={reviewer?.avatar}
                            badge={
                              reviewer?.verifiedCompany ? (
                                <div className="w-4 h-4 rounded-full bg-success-500 text-white flex items-center justify-center ring-2 ring-white">
                                  <ShieldCheck size={10} />
                                </div>
                              ) : undefined
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-neutral-800 truncate">
                                  {reviewer?.name}
                                </span>
                                <Badge variant="default" size="sm">
                                  {reviewer?.title || "用户"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    size={15}
                                    className={cn(
                                      idx < r.rating
                                        ? "text-warning-500 fill-warning-500"
                                        : "text-neutral-300"
                                    )}
                                  />
                                ))}
                                <span className="ml-1 text-sm font-semibold text-warning-600">
                                  {r.rating}.0
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-neutral-400">
                              {formatRelativeTime(r.createdAt)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed mb-4 pl-14">
                          {r.content}
                        </p>
                        <div className="flex flex-wrap gap-4 pl-14 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                          {Object.entries(r.dimensions).map(([k, v]) => {
                            const labels: Record<string, string> = {
                              responseSpeed: "响应速度",
                              keepingPromise: "守约率",
                              communication: "沟通态度",
                              quality: "推荐质量",
                            };
                            return (
                              <div
                                key={k}
                                className="flex items-center gap-1.5"
                              >
                                <span className="text-neutral-400">
                                  {labels[k] || k}
                                </span>
                                <div className="w-14 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-success-400"
                                    style={{ width: `${(v / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="font-medium text-neutral-600">
                                  {v}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "records" && (
            <div className="relative pl-8">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-success-400 via-primary-400 to-neutral-200 rounded-full" />
              {records.length === 0 ? (
                <EmptyState title="暂无信用明细" />
              ) : (
                <div className="space-y-4">
                  {records.map((r, i) => (
                    <div
                      key={r.id}
                      className="relative animate-[fade-in-up_0.3s_ease-out_both]"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div
                        className={cn(
                          "absolute -left-5 top-1 w-6 h-6 rounded-full ring-4 ring-white flex items-center justify-center shadow-sm",
                          r.type === "success" && "bg-success-500",
                          r.type === "review" && "bg-warning-500",
                          r.type === "warning" && "bg-danger-500",
                          (!r.type || r.type === "report") && "bg-neutral-400"
                        )}
                      >
                        {r.type === "success" ? (
                          <CheckCircle2 size={12} className="text-white" />
                        ) : r.type === "review" ? (
                          <Star size={12} className="text-white" />
                        ) : r.type === "warning" ? (
                          <XCircle size={12} className="text-white" />
                        ) : (
                          <Flag size={12} className="text-white" />
                        )}
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition">
                        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                          <div>
                            <div className="font-semibold text-neutral-800 flex items-center gap-2">
                              {r.title}
                              {r.scoreChange !== 0 && (
                                <span
                                  className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    r.scoreChange > 0
                                      ? "bg-success-100 text-success-700"
                                      : "bg-danger-100 text-danger-700"
                                  )}
                                >
                                  {r.scoreChange > 0 ? "+" : ""}
                                  {r.scoreChange}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {formatRelativeTime(r.createdAt)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              r.type === "success"
                                ? "success"
                                : r.type === "review"
                                  ? "warning"
                                  : r.type === "warning"
                                    ? "danger"
                                    : "default"
                            }
                            size="sm"
                          >
                            {r.type === "success"
                              ? "成功案例"
                              : r.type === "review"
                                ? "评价"
                                : r.type === "warning"
                                  ? "警告"
                                  : "系统"}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
}
