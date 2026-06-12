import {
  ChevronRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  FileText,
  UserCheck,
  Briefcase,
  XCircle,
  Send,
  Eye,
  Star,
  ArrowRightLeft,
  Plus,
  Building2,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Card } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { useApplicationStore } from "@/store/applicationStore";
import { useUserStore } from "@/store/userStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useMessageStore } from "@/store/messageStore";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatRelativeTime,
  formatDateTime,
  formatSalary,
  statusTextMap,
} from "@/utils/format";
import { cn } from "@/utils/helpers";
import type { Application, ApplicationStatus } from "@/types";
import { APPLICATION_STATUS_OPTIONS } from "@/utils/constants";

const statusColorMap: Record<ApplicationStatus, any> = {
  pending: "warning",
  accepted: "primary",
  rejected: "danger",
  in_progress: "primary",
  interview: "primary",
  offer: "success",
  hired: "success",
  failed: "danger",
};

const statusIconMap: Record<ApplicationStatus, any> = {
  pending: Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
  in_progress: FileText,
  interview: UserCheck,
  offer: Star,
  hired: Building2,
  failed: XCircle,
};

const activeStatuses: ApplicationStatus[] = [
  "pending",
  "accepted",
  "in_progress",
  "interview",
];

interface Props {
  app: Application;
  index: number;
  isSent: boolean;
}

export const ApplicationCard = ({ app, index, isSent }: Props) => {
  const selectApp = useApplicationStore((s) => s.selectApplication);
  const getUser = useUserStore((s) => s.getUserById);
  const getOpp = useOpportunityStore((s) =>
    s.opportunities.find((o) => o.id === app.opportunityId)
  );

  const otherUserId = isSent ? app.publisherId : app.applicantId;
  const other = getUser(otherUserId);
  const StatusIcon = statusIconMap[app.status];
  const statusColor = statusColorMap[app.status];
  const isActive = activeStatuses.includes(app.status);

  return (
    <div
      onClick={() => selectApp(app)}
      className={cn(
        "card-base card-hover cursor-pointer relative overflow-hidden animate-[fade-in-up_0.4s_ease-out_both]"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          app.status === "pending" && "bg-warning-500",
          activeStatuses.includes(app.status) &&
            app.status !== "pending" &&
            "bg-primary-500",
          (app.status === "hired" || app.status === "offer") &&
            "bg-success-500",
          (app.status === "rejected" || app.status === "failed") &&
            "bg-danger-500"
        )}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar
              name={other?.name || "用户"}
              size="md"
              src={other?.avatar}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-neutral-800">
                  {isSent ? "发给：" : "来自："}
                  {other?.name}
                </span>
                <Badge variant={statusColor} size="sm" dot>
                  <StatusIcon size={11} />
                  {statusTextMap[app.status]}
                </Badge>
              </div>
              <div className="text-xs text-neutral-500">
                {other?.title} · {other?.company}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-neutral-400">
              {formatRelativeTime(app.createdAt)}
            </div>
            <ChevronRight size={18} className="text-neutral-300 mt-1 ml-auto" />
          </div>
        </div>

        {getOpp && (
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={13} className="text-primary-500 shrink-0" />
              <span className="font-semibold text-neutral-800 text-sm truncate">
                {getOpp.position}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 size={11} className="text-neutral-400" />
                {getOpp.company}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-neutral-400" />
                {getOpp.city}
              </span>
              <span>·</span>
              <span className="text-success-600 font-medium flex items-center gap-1">
                <DollarSign size={11} className="text-success-500" />
                {formatSalary(getOpp.salaryMin, getOpp.salaryMax)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            {app.progressTimeline.slice(-1)[0] && (
              <>
                <Clock size={12} />
                <span>最新：{app.progressTimeline.slice(-1)[0].status}</span>
                <span>·</span>
                <span>
                  {formatRelativeTime(app.progressTimeline.slice(-1)[0].time)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {app.messageThreadId && (
              <Badge variant="primary" size="sm">
                <MessageSquare size={11} />
                会话中
              </Badge>
            )}
            <span className="chip">
              进度 {app.progressTimeline.length}/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ApplicationDetail = () => {
  const navigate = useNavigate();
  const open = useApplicationStore((s) => s.showApplicationDetail);
  const app = useApplicationStore((s) => s.selectedApplication);
  const onClose = () => useApplicationStore.getState().toggleDetail(false);

  const updateStatus = useApplicationStore((s) => s.updateApplicationStatus);
  const getUser = useUserStore((s) => s.getUserById);
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const getOpp = useOpportunityStore((s) => s.opportunities);
  const markThreadRead = useMessageStore((s) => s.markThreadRead);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  if (!app) return null;
  const isPublisher = app.publisherId === curUser?.id;
  const applicant = getUser(app.applicantId);
  const publisher = getUser(app.publisherId);
  const opp = getOpp.find((o) => o.id === app.opportunityId);

  const goToChat = () => {
    if (app.messageThreadId) {
      markThreadRead(app.messageThreadId, curUser?.id || "");
    }
    navigate("/messages");
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="w-[540px]"
      title="申请详情"
      subtitle={statusTextMap[app.status]}
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-success-50 border border-primary-100/60">
          <div className="flex -space-x-3">
            <Avatar name={applicant?.name || ""} size="md" className="ring-2 ring-white" />
            <Avatar name={publisher?.name || ""} size="md" className="ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 truncate">
                {applicant?.name}
              </span>
              <ArrowRightLeft size={14} className="text-primary-500 shrink-0" />
              <span className="font-semibold text-neutral-800 truncate">
                {publisher?.name}
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              申请于 {formatDateTime(app.createdAt)}
            </div>
          </div>
          <Badge variant={statusColorMap[app.status]} size="md">
            {statusTextMap[app.status]}
          </Badge>
        </div>

        {opp && (
          <div>
            <h4 className="font-semibold text-neutral-800 mb-2.5 text-sm flex items-center gap-2">
              <Briefcase size={15} className="text-primary-500" />
              关联岗位
            </h4>
            <div className="p-4 rounded-xl bg-white border border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neutral-100 to-primary-50 flex items-center justify-center shrink-0">
                  <span className="font-serif font-bold text-primary-700">
                    {opp.company.slice(0, 1)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-800 mb-0.5 truncate">
                    {opp.position}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {opp.company} · {opp.city} ·{" "}
                    <span className="text-success-600 font-medium">
                      {formatSalary(opp.salaryMin, opp.salaryMax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {applicant && !isPublisher && (
          <div>
            <h4 className="font-semibold text-neutral-800 mb-2.5 text-sm flex items-center gap-2">
              <FileText size={15} className="text-success-500" />
              简历摘要
            </h4>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {app.resumeSummary}
              </p>
            </div>
          </div>
        )}

        {app.coverLetter && (
          <div>
            <h4 className="font-semibold text-neutral-800 mb-2.5 text-sm flex items-center gap-2">
              <Send size={15} className="text-warning-500" />
              申请附言
            </h4>
            <p className="p-4 rounded-xl bg-warning-50/60 border border-warning-100 text-sm text-warning-800 leading-relaxed">
              {app.coverLetter}
            </p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-neutral-800 mb-3 text-sm flex items-center gap-2">
            <Clock size={15} className="text-primary-500" />
            进度时间线
          </h4>
          <div className="relative pl-6">
            {app.progressTimeline.map((step, i) => (
              <div key={i} className="relative pb-5 last:pb-0">
                <div className="absolute left-[-24px] top-0.5 w-6 flex justify-center">
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded-full border-4 border-white shadow-sm",
                      i === app.progressTimeline.length - 1
                        ? "bg-primary-500 ring-4 ring-primary-100 animate-pulse-soft"
                        : "bg-success-500"
                    )}
                  />
                </div>
                {i < app.progressTimeline.length - 1 && (
                  <div className="absolute left-[-18px] top-5 bottom-0 w-0.5 bg-gradient-to-b from-success-300 to-neutral-200" />
                )}
                <div className="pt-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-neutral-800 text-sm">
                      {step.status}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDateTime(step.time)}
                    </span>
                  </div>
                  {step.note && (
                    <p className="text-sm text-neutral-600 leading-relaxed mt-1 p-2 rounded-lg bg-neutral-50">
                      {step.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isPublisher &&
          (app.status === "pending" ||
            app.status === "accepted" ||
            app.status === "in_progress") && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50/60 via-white to-warning-50/40 border border-primary-100/60">
              <h4 className="font-semibold text-neutral-800 mb-3 text-sm flex items-center gap-2">
                <Plus size={15} className="text-primary-500" />
                更新申请进度
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {APPLICATION_STATUS_OPTIONS.filter((o) => {
                  if (app.status === "pending")
                    return ["accepted", "rejected"].includes(o.value);
                  if (app.status === "accepted")
                    return ["in_progress", "rejected"].includes(o.value);
                  if (app.status === "in_progress")
                    return ["interview", "failed"].includes(o.value);
                  return false;
                }).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateStatus(
                        app.id,
                        opt.value as ApplicationStatus,
                        opt.value === "accepted"
                          ? "简历已阅，背景匹配，帮你推进到下一步"
                          : opt.value === "rejected"
                            ? "很遗憾，方向不太匹配，祝你早日找到理想机会！"
                            : opt.value === "in_progress"
                              ? "简历已发送给部门负责人，等待进一步反馈"
                              : opt.value === "interview"
                                ? "恭喜通过简历筛选！已安排面试"
                                : "面试未通过，建议继续打磨相关技能"
                      );
                    }}
                    className={cn(
                      "p-3 rounded-xl border text-left text-sm font-medium transition hover:shadow-sm",
                      opt.color === "danger"
                        ? "bg-white border-danger-200 text-danger-700 hover:bg-danger-50"
                        : "bg-white border-primary-200 text-primary-700 hover:bg-primary-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                placeholder="添加备注（选填）..."
                className="input-base resize-none !text-sm"
              />
            </div>
          )}

        <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-gradient-to-t from-white via-white to-transparent pt-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" fullWidth onClick={goToChat}>
              <MessageSquare size={16} />
              站内沟通
            </Button>
            <Button
              fullWidth
              onClick={() => {
                if (app.status === "pending" && isPublisher) {
                  updateStatus(
                    app.id,
                    "accepted",
                    "接受申请，已建立会话通道，请在消息中沟通细节"
                  );
                }
              }}
              disabled={
                !(app.status === "pending" && isPublisher) &&
                !(["offer", "hired", "interview"].includes(app.status))
              }
            >
              {app.status === "pending" && isPublisher ? (
                <>
                  <CheckCircle2 size={16} />
                  接受申请
                </>
              ) : (
                <>
                  <Star size={16} />
                  去评价
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
