import { useMemo, useState } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Users,
  Eye,
  ShieldCheck,
  Clock,
  Star,
  Flag,
  Bookmark,
  BookmarkCheck,
  Send,
  FileText,
  Share2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Modal } from "@/components/common/Modal";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useUserStore } from "@/store/userStore";
import { useApplicationStore } from "@/store/applicationStore";
import { useMessageStore } from "@/store/messageStore";
import { formatRelativeTime, formatSalary, roleTextMap } from "@/utils/format";
import { cn } from "@/utils/helpers";
import { REPORT_REASONS } from "@/utils/constants";

export const OpportunityDetail = () => {
  const open = useOpportunityStore((s) => s.showDetailDrawer);
  const opp = useOpportunityStore((s) => s.selectedOpportunity);
  const onClose = () => useOpportunityStore.getState().toggleDetailDrawer(false);

  const getUser = useUserStore((s) => s.getUserById);
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  const createApplication = useApplicationStore((s) => s.createApplication);
  const createThread = useMessageStore((s) => s.createThread);

  const [showApply, setShowApply] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [resumeText, setResumeText] = useState(curUser?.resumeSummary || "");
  const [coverLetter, setCoverLetter] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const publisher = opp ? getUser(opp.publisherId) : undefined;
  const isFav = opp ? favorites.includes(opp.id) : false;

  const handleApply = () => {
    if (!opp || !curUser) return;
    const threadId = createThread([curUser.id, opp.publisherId]);
    createApplication({
      opportunityId: opp.id,
      applicantId: curUser.id,
      publisherId: opp.publisherId,
      resumeSummary: resumeText,
      coverLetter,
      messageThreadId: threadId,
    });
    setSubmitted(true);
    setTimeout(() => {
      setShowApply(false);
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  const handleReport = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReport(false);
      setReportSubmitted(false);
      setReportReason("");
      setReportDetail("");
    }, 1800);
  };

  if (!opp) return null;

  return (
    <>
      <Drawer open={open} onClose={onClose} width="w-[520px]">
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-90" />
          <div className="absolute inset-0 bg-noise-texture opacity-20 mix-blend-overlay" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-btn bg-white/15 text-white hover:bg-white/25 transition backdrop-blur-sm"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-0 left-6 translate-y-1/2 flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center shrink-0">
              <span className="font-serif text-2xl font-bold text-primary-700">
                {opp.company.slice(0, 1)}
              </span>
            </div>
            <div className="pb-2 min-w-0">
              <h2 className="font-serif text-xl font-bold text-white truncate pr-4">
                {opp.position}
              </h2>
              <p className="text-white/80 text-sm">{opp.company}</p>
            </div>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" size="sm" dot>
              招聘中
            </Badge>
            <Badge variant="primary" size="sm">
              {opp.industry}
            </Badge>
            <Badge variant="default" size="sm">
              <MapPin size={11} />
              {opp.city}
            </Badge>
            <Badge variant="default" size="sm">
              <DollarSign size={11} />
              {formatSalary(opp.salaryMin, opp.salaryMax, opp.salaryUnit)}
            </Badge>
            <Badge variant="default" size="sm">
              <Briefcase size={11} />
              {opp.experience || "经验不限"}
            </Badge>
            <Badge variant="default" size="sm">
              <GraduationCap size={11} />
              {opp.education || "学历不限"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <div>
              <div className="text-xs text-neutral-500 mb-1">浏览</div>
              <div className="font-semibold text-neutral-800">{opp.viewCount}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 mb-1">申请</div>
              <div className="font-semibold text-neutral-800">
                {opp.applicationCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 mb-1">发布时间</div>
              <div className="font-semibold text-neutral-800 text-xs">
                {formatRelativeTime(opp.createdAt)}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-800 mb-2.5 flex items-center gap-2">
              <FileText size={16} className="text-primary-500" />
              岗位描述
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-800 mb-2.5 flex items-center gap-2">
              <Star size={16} className="text-warning-500" />
              内推说明
            </h4>
            <div className="p-4 rounded-xl bg-warning-50/60 border border-warning-100">
              <p className="text-sm text-warning-800 leading-relaxed">
                {opp.referralNote}
              </p>
            </div>
          </div>

          {opp.desiredExchange.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-800 mb-2.5 flex items-center gap-2">
                <ShieldCheck size={16} className="text-success-500" />
                期望交换条件
              </h4>
              <div className="flex flex-wrap gap-2">
                {opp.desiredExchange.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-50 text-success-700 text-sm font-medium border border-success-100"
                  >
                    <CheckCircle2 size={12} />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="divider" />

          {publisher && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-primary-50/40 border border-neutral-100">
              <div className="flex items-start gap-4 mb-3">
                <Avatar
                  name={publisher.name}
                  size="lg"
                  src={publisher.avatar}
                  badge={
                    publisher.verifiedCompany ? (
                      <div className="w-4 h-4 rounded-full bg-success-500 text-white flex items-center justify-center ring-2 ring-white">
                        <ShieldCheck size={10} />
                      </div>
                    ) : undefined
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-neutral-800">
                      {publisher.name}
                    </span>
                    <Badge variant="primary" size="sm">
                      {roleTextMap[publisher.role]}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500 truncate">
                    {publisher.title} · {publisher.company}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Star size={11} className="text-warning-500 fill-warning-500" />
                      信用 {publisher.creditScore}
                    </span>
                    <span>·</span>
                    <span>{publisher.city}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed mb-3 line-clamp-3">
                {publisher.bio}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {[
                  publisher.verifiedIdentity && {
                    label: "身份认证",
                    color: "success",
                  },
                  publisher.verifiedCompany && {
                    label: "公司认证",
                    color: "primary",
                  },
                  publisher.verifiedEducation && {
                    label: "学历认证",
                    color: "warning",
                  },
                ]
                  .filter(Boolean)
                  .map((item: any, i) => (
                    <Badge key={i} variant={item.color} size="sm" dot>
                      <ShieldCheck size={10} />
                      {item.label}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 sticky bottom-0 bg-white -mx-6 px-6 py-4 border-t border-neutral-100">
            <button
              onClick={() => toggleFavorite(opp.id)}
              className={cn(
                "p-3 rounded-btn border transition",
                isFav
                  ? "bg-warning-50 border-warning-200 text-warning-600"
                  : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
              )}
            >
              {isFav ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
            <button
              onClick={() => setShowReport(true)}
              className="p-3 rounded-btn border bg-white border-neutral-200 text-neutral-500 hover:bg-danger-50 hover:border-danger-200 hover:text-danger-600 transition"
            >
              <Flag size={20} />
            </button>
            <Button
              fullWidth
              size="lg"
              leftIcon={<Send size={18} />}
              onClick={() => {
                setResumeText(curUser?.resumeSummary || "");
                setShowApply(true);
              }}
            >
              发起内推申请
            </Button>
          </div>
        </div>
      </Drawer>

      <Modal
        open={showApply}
        onClose={() => setShowApply(false)}
        size="md"
        title="发起内推申请"
        footer={
          !submitted ? (
            <>
              <Button variant="secondary" onClick={() => setShowApply(false)}>
                取消
              </Button>
              <Button
                leftIcon={<Send size={16} />}
                onClick={handleApply}
                disabled={!resumeText.trim()}
              >
                确认提交
              </Button>
            </>
          ) : undefined
        }
      >
        {submitted ? (
          <div className="py-10 flex flex-col items-center text-center animate-[fade-in-up_0.4s_ease-out]">
            <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-5 animate-[pulse-soft_2s_ease-in-out_infinite]">
              <CheckCircle2 size={42} className="text-success-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-800 mb-2">
              申请提交成功！
            </h3>
            <p className="text-neutral-500 max-w-sm">
              你的申请已发送给 {publisher?.name}，对方通常会在 24 小时内处理。
              请在消息中心留意回复。
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <span className="font-serif text-lg font-bold text-primary-700">
                  {opp.company.slice(0, 1)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-neutral-800 truncate">
                  {opp.position}
                </div>
                <div className="text-sm text-neutral-500">
                  {opp.company} · {opp.city} ·{" "}
                  <span className="text-success-600 font-medium">
                    {formatSalary(opp.salaryMin, opp.salaryMax)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                简历摘要 <span className="text-danger-500">*</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={5}
                placeholder="简要介绍你的教育背景、工作经历、核心技能、项目亮点..."
                className="input-base resize-none"
              />
              {!curUser?.resumeSummary && (
                <p className="text-xs text-warning-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} />
                  建议在个人主页完善简历摘要，以后可直接一键使用
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                附言
                <span className="ml-2 text-xs text-neutral-400 font-normal">
                  选填
                </span>
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="一句话打动内推人，比如你为什么适合这个岗位..."
                className="input-base resize-none"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showReport}
        onClose={() => setShowReport(false)}
        size="md"
        title="举报机会"
        footer={
          !reportSubmitted ? (
            <>
              <Button variant="secondary" onClick={() => setShowReport(false)}>
                取消
              </Button>
              <Button
                variant="danger"
                leftIcon={<Flag size={16} />}
                onClick={handleReport}
                disabled={!reportReason}
              >
                提交举报
              </Button>
            </>
          ) : undefined
        }
      >
        {reportSubmitted ? (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-5">
              <ShieldCheck size={42} className="text-primary-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-800 mb-2">
              举报已受理
            </h3>
            <p className="text-neutral-500 max-w-sm">
              感谢你的反馈，平台审核团队将在 24 小时内核实并处理。
              你的个人信息将严格保密。
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                举报原因 <span className="text-danger-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReportReason(r)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-left text-sm font-medium transition",
                      reportReason === r
                        ? "border-danger-400 bg-danger-50 text-danger-700"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                详细描述
                <span className="ml-2 text-xs text-neutral-400 font-normal">
                  选填，不超过 300 字
                </span>
              </label>
              <textarea
                value={reportDetail}
                onChange={(e) => setReportDetail(e.target.value.slice(0, 300))}
                rows={4}
                placeholder="请提供具体的异常行为描述，如有证据可在消息中心发送给客服..."
                className="input-base resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
