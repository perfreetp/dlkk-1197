import { useMemo, useState } from "react";
import {
  Star,
  ShieldCheck,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { useUserStore } from "@/store/userStore";
import { useCreditStore } from "@/store/creditStore";
import { useApplicationStore } from "@/store/applicationStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { cn } from "@/utils/helpers";
import { formatRelativeTime, statusTextMap } from "@/utils/format";
import { REPORT_REASONS } from "@/utils/constants";
import type { ReviewDimensions } from "@/types";

export const ReviewModal = () => {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const showReport = useCreditStore((s) => s.showReportModal);
  const toggleReport = useCreditStore((s) => s.toggleReportModal);
  const showReview = useCreditStore((s) => s.showReviewModal);
  const toggleReview = useCreditStore((s) => s.toggleReviewModal);
  const addReview = useCreditStore((s) => s.addReview);
  const appForReview = useApplicationStore((s) => s.selectedApplicationForReview);
  const opportunities = useOpportunityStore((s) => s.opportunities);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  const reviewTarget = useMemo(() => {
    if (!appForReview || !curUser) return null;
    const targetId = appForReview.publisherId === curUser.id
      ? appForReview.applicantId
      : appForReview.publisherId;
    const targetUser = users.find((u) => u.id === targetId);
    const opp = opportunities.find((o) => o.id === appForReview.opportunityId);
    return { user: targetUser, opp, app: appForReview };
  }, [appForReview, curUser, users, opportunities]);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [dims, setDims] = useState<ReviewDimensions>({
    responseSpeed: 5,
    keepingPromise: 5,
    communication: 5,
    quality: 5,
  });
  const [reviewText, setReviewText] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const resetReviewForm = () => {
    setReviewSubmitted(false);
    setReviewText("");
    setRating(5);
    setDims({ responseSpeed: 5, keepingPromise: 5, communication: 5, quality: 5 });
  };

  const resetReportForm = () => {
    setReportSubmitted(false);
    setReportReason("");
    setReportDetail("");
  };

  const handleCloseReview = () => {
    toggleReview(false);
    useApplicationStore.getState().selectApplicationForReview(null);
    resetReviewForm();
  };

  const handleCloseReport = () => {
    toggleReport(false);
    resetReportForm();
  };

  const handleSubmitReview = () => {
    if (!curUser || !reviewTarget) return;
    addReview(
      curUser.id,
      reviewTarget.user?.id || "",
      reviewTarget.app.id,
      rating,
      dims,
      reviewText
    );
    setReviewSubmitted(true);
    setTimeout(() => {
      handleCloseReview();
    }, 1800);
  };

  const handleSubmitReport = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      handleCloseReport();
    }, 1800);
  };

  return (
    <>
      <Modal
        open={showReport}
        onClose={handleCloseReport}
        size="md"
        title="举报异常行为"
        footer={
          !reportSubmitted ? (
            <>
              <Button variant="secondary" onClick={handleCloseReport}>
                取消
              </Button>
              <Button
                variant="danger"
                leftIcon={<Flag size={16} />}
                onClick={handleSubmitReport}
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
              平台审核团队将在 24 小时内核实并处理。我们会严格保密举报人的信息。
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-warning-50/60 border border-warning-100">
              <p className="text-sm text-warning-800 leading-relaxed flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                请如实填写举报信息，恶意举报将影响你的守约评分。我们将在24小时内完成核实。
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                举报类型 <span className="text-danger-500">*</span>
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
                被举报用户
              </label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <Avatar name="其他用户" size="sm" />
                <div className="flex-1">
                  <select className="input-base !py-1.5 !text-sm !bg-white">
                    <option>选择会话/申请记录中的用户...</option>
                  </select>
                </div>
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
                placeholder="请描述异常行为的具体情况、时间、聊天记录截图等证据..."
                className="input-base resize-none"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showReview}
        onClose={handleCloseReview}
        size="md"
        title="互评守约情况"
        footer={
          !reviewSubmitted ? (
            <>
              <Button variant="secondary" onClick={handleCloseReview}>
                暂不评价
              </Button>
              <Button
                leftIcon={<CheckCircle2 size={16} />}
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || !reviewTarget}
              >
                提交评价
              </Button>
            </>
          ) : undefined
        }
      >
        {reviewSubmitted ? (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-5 animate-[pulse-soft_2s_ease-in-out_infinite]">
              <CheckCircle2 size={42} className="text-success-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-800 mb-2">
              评价提交成功
            </h3>
            <p className="text-neutral-500 max-w-sm">
              感谢你的评价，互评已计入双方守约评分。期待下次愉快的交换！
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50/60 via-white to-success-50/50 border border-primary-100/60">
              <div className="flex items-center gap-3">
                <Avatar name={reviewTarget?.user?.name || "交换伙伴"} size="lg" src={reviewTarget?.user?.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-800">{reviewTarget?.user?.name || "选择评价对象"}</div>
                  <div className="text-xs text-neutral-500">
                    {reviewTarget?.user?.title} · {reviewTarget?.user?.company}
                    {reviewTarget?.opp && ` · 「${reviewTarget.opp.position}」申请`}
                  </div>
                </div>
                <Badge variant="success" size="sm" dot>
                  {reviewTarget?.app ? statusTextMap[reviewTarget.app.status] : "已完成"}
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="label-sm mb-2">综合评分</div>
              <div className="inline-flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const active = (hoverRating || rating) > i;
                  return (
                    <button
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(i + 1)}
                      className="p-1 transition hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={cn(
                          "transition-colors",
                          active
                            ? "text-warning-500 fill-warning-500"
                            : "text-neutral-300"
                        )}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 font-serif text-3xl font-bold text-warning-600">
                  {rating}.0
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                分项评分
              </label>
              <div className="space-y-2.5">
                {(Object.keys(dims) as (keyof ReviewDimensions)[]).map((k) => {
                  const labels: Record<keyof ReviewDimensions, string> = {
                    responseSpeed: "响应速度",
                    keepingPromise: "守约情况",
                    communication: "沟通态度",
                    quality: "推荐质量",
                  };
                  return (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-3 py-1"
                    >
                      <span className="text-sm text-neutral-700 w-20 shrink-0">
                        {labels[k]}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setDims({ ...dims, [k]: i + 1 })
                            }
                            className="p-0.5 transition"
                          >
                            <Star
                              size={16}
                              className={cn(
                                i < dims[k]
                                  ? "text-primary-500 fill-primary-500"
                                  : "text-neutral-300",
                                "hover:scale-110 transition"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-primary-700 w-8 text-right">
                        {dims[k]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                评价内容 <span className="text-danger-500">*</span>
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value.slice(0, 300))}
                rows={4}
                placeholder="分享你的交换体验，比如对方的响应速度、是否守约、沟通是否顺畅等..."
                className="input-base resize-none"
              />
              <div className="text-xs text-neutral-400 mt-1 text-right">
                {reviewText.length}/300
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
