import { useMemo } from "react";
import {
  ArrowRightLeft,
  Inbox,
  Send,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Tabs } from "@/components/common/Tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  ApplicationCard,
  ApplicationDetail,
} from "@/components/applications/ApplicationCard";
import { useApplicationStore } from "@/store/applicationStore";
import { useUserStore } from "@/store/userStore";
import { APPLICATION_STATUS_OPTIONS } from "@/utils/constants";
import { cn } from "@/utils/helpers";
import { Link } from "react-router-dom";

export default function ApplicationsPage() {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const activeTab = useApplicationStore((s) => s.activeTab);
  const setTab = useApplicationStore((s) => s.setActiveTab);
  const applications = useApplicationStore((s) => s.applications);
  const getApps = useApplicationStore((s) => s.getApplicationsByUser);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  const appsResult = useMemo(
    () => getApps(curUser?.id || ""),
    [applications, curUser?.id]
  );
  const { sent, received } = appsResult;

  const tabs = [
    { value: "received", label: "收到的申请", count: received.length, icon: <Inbox size={15} /> },
    { value: "sent", label: "我发起的申请", count: sent.length, icon: <Send size={15} /> },
  ];

  const list = activeTab === "received" ? received : sent;

  const pendingCount = list.filter((a) => a.status === "pending").length;
  const activeCount = list.filter(
    (a) =>
      a.status === "accepted" ||
      a.status === "in_progress" ||
      a.status === "interview"
  ).length;
  const successCount = list.filter(
    (a) => a.status === "offer" || a.status === "hired"
  ).length;

  return (
    <PageContainer>
      <PageHeader
        title="交换申请"
        subtitle="管理所有内推申请与交换进度"
        actions={
          <Badge variant="primary" size="sm">
            <Clock size={12} />
            {pendingCount} 个待处理
          </Badge>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "申请总数",
            value: list.length,
            color: "text-primary-600",
            bg: "bg-primary-50",
          },
          {
            label: "待处理",
            value: pendingCount,
            color: "text-warning-600",
            bg: "bg-warning-50",
          },
          {
            label: "进行中",
            value: activeCount,
            color: "text-primary-600",
            bg: "bg-primary-50/60",
          },
          {
            label: "成功",
            value: successCount,
            color: "text-success-600",
            bg: "bg-success-50",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card-base card-hover p-4 animate-[fade-in-up_0.4s_ease-out_both]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={cn("w-10 h-10 rounded-xl", s.bg, "flex items-center justify-center mb-3")}>
              <ArrowRightLeft size={18} className={s.color} />
            </div>
            <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-bold text-neutral-900">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden animate-[fade-in-up_0.4s_ease-out_200ms]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100">
          <Tabs tabs={tabs} activeValue={activeTab} onChange={setTab} variant="pill" className="!w-full md:!w-auto" />
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:flex-none md:w-60">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="搜索申请人或岗位..."
                className="input-base !pl-9 !py-2 !text-sm"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50">
              <Filter size={14} />
              筛选
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-neutral-50/50 border-b border-neutral-100">
          <span className="label-sm">快速筛选：</span>
          <button className="chip-primary !bg-primary-600 !text-white !border-primary-600">
            全部 {list.length}
          </button>
          {APPLICATION_STATUS_OPTIONS.slice(0, 6).map((s) => {
            const c = list.filter((a) => a.status === s.value).length;
            if (c === 0) return null;
            return (
              <button
                key={s.value}
                className={cn(
                  "chip hover:bg-neutral-200 transition",
                  c === 0 && "opacity-50"
                )}
              >
                {s.label} {c}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {list.length === 0 ? (
            <EmptyState
              icon={
                activeTab === "sent" ? (
                  <Send size={48} className="text-neutral-300" />
                ) : (
                  <Inbox size={48} className="text-neutral-300" />
                )
              }
              title={activeTab === "sent" ? "还没有发起申请" : "还没有收到申请" }
              description={
                activeTab === "sent"
                  ? "去机会广场看看，找到合适的内推机会就发起申请吧"
                  : "发布内推机会后，匹配的候选人就会向你发起申请"
              }
              action={
                <Link to="/opportunities">
                  <Button>
                    {activeTab === "sent" ? "浏览机会广场" : "发布内推机会"}
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((app, i) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  index={i}
                  isSent={activeTab === "sent"}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      <ApplicationDetail />
    </PageContainer>
  );
}
