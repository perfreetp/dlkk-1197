import { useState } from "react";
import {
  X,
  CheckCircle2,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Eye,
  Sparkles,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { useOpportunityStore } from "@/store/opportunityStore";
import type { Opportunity } from "@/types";
import { CITIES, INDUSTRIES, EXPERIENCES, EDUCATIONS, VISIBILITY_OPTIONS } from "@/utils/constants";
import { cn } from "@/utils/helpers";

const STEPS = [
  { key: "basic", label: "基本信息", icon: Building2 },
  { key: "detail", label: "岗位详情", icon: FileText },
  { key: "exchange", label: "交换条件", icon: Sparkles },
];

export const PublishForm = () => {
  const open = useOpportunityStore((s) => s.showPublishModal);
  const onClose = () => useOpportunityStore.getState().togglePublishModal(false);
  const publish = useOpportunityStore((s) => s.publishOpportunity);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    company: "",
    position: "",
    city: "",
    industry: "",
    salaryMin: 20,
    salaryMax: 40,
    salaryUnit: "K" as Opportunity["salaryUnit"],
    experience: "",
    education: "",
    description: "",
    referralNote: "",
    desiredExchange: [""] as string[],
    visibility: "public" as const,
    status: "open" as const,
    companyLogo: "",
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 0)
      return form.company && form.position && form.city && form.industry;
    if (step === 1)
      return form.description.trim().length >= 20;
    return true;
  };

  const handleSubmit = () => {
    publish({
      ...form,
      description: form.description,
      referralNote: form.referralNote || "内推人会及时跟进简历进度，欢迎投递。",
      desiredExchange: form.desiredExchange.filter((s) => s.trim()),
      status: form.status,
    });
    setStep(0);
    setForm({
      company: "",
      position: "",
      city: "",
      industry: "",
      salaryMin: 20,
      salaryMax: 40,
      salaryUnit: "K",
      experience: "",
      education: "",
      description: "",
      referralNote: "",
      desiredExchange: [""],
      visibility: "public",
      status: "open",
      companyLogo: "",
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="发布内推机会"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          {step > 0 && (
            <Button
              variant="secondary"
              leftIcon={<ChevronLeft size={16} />}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              上一步
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              disabled={!canNext()}
              rightIcon={<ChevronRight size={16} />}
              onClick={() => setStep((s) => s + 1)}
            >
              下一步
            </Button>
          ) : (
            <Button
              leftIcon={<CheckCircle2 size={16} />}
              onClick={handleSubmit}
              disabled={!canNext()}
            >
              确认发布
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl transition",
                    active && "bg-primary-50 ring-1 ring-primary-200",
                    done && "text-success-600"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition",
                      active && "bg-primary-600 text-white",
                      done && "bg-success-500 text-white",
                      !active && !done && "bg-neutral-200 text-neutral-500"
                    )}
                  >
                    {done ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:inline",
                      active
                        ? "text-primary-700"
                        : done
                          ? "text-success-600"
                          : "text-neutral-500"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 rounded-full",
                      done ? "bg-success-400" : "bg-neutral-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Building2 size={14} className="inline mr-1.5 -mt-0.5" />
              公司名称 <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="如：字节跳动"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Briefcase size={14} className="inline mr-1.5 -mt-0.5" />
              岗位名称 <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
              placeholder="如：高级前端工程师"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
              工作城市 <span className="text-danger-500">*</span>
            </label>
            <select
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="input-base"
            >
              <option value="">请选择城市</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              所属行业 <span className="text-danger-500">*</span>
            </label>
            <select
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              className="input-base"
            >
              <option value="">请选择行业</option>
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <DollarSign size={14} className="inline mr-1.5 -mt-0.5" />
              薪资范围
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.salaryMin}
                onChange={(e) => update("salaryMin", Number(e.target.value))}
                className="input-base !w-24"
              />
              <span className="text-neutral-400">—</span>
              <input
                type="number"
                value={form.salaryMax}
                onChange={(e) => update("salaryMax", Number(e.target.value))}
                className="input-base !w-24"
              />
              <select
                value={form.salaryUnit}
                onChange={(e) => update("salaryUnit", e.target.value as Opportunity["salaryUnit"])}
                className="input-base !w-20"
              >
                <option value="K">K</option>
                <option value="W">万</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                经验要求
              </label>
              <select
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                className="input-base"
              >
                {EXPERIENCES.map((e) => (
                  <option key={e} value={e === "不限" ? "" : e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                学历要求
              </label>
              <select
                value={form.education}
                onChange={(e) => update("education", e.target.value)}
                className="input-base"
              >
                {EDUCATIONS.map((e) => (
                  <option key={e} value={e === "不限" ? "" : e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              岗位描述 <span className="text-danger-500">*</span>
              <span className="ml-2 text-xs text-neutral-400 font-normal">
                ({form.description.length}/500 字)
              </span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value.slice(0, 500))}
              rows={6}
              placeholder="请详细描述岗位职责、技术要求、团队介绍等，信息越完整越容易吸引合适的候选人..."
              className="input-base resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              内推说明
              <span className="ml-2 text-xs text-neutral-400 font-normal">
                选填，如：HC 情况、面试流程、简历跟进等
              </span>
            </label>
            <textarea
              value={form.referralNote}
              onChange={(e) => update("referralNote", e.target.value.slice(0, 300))}
              rows={3}
              placeholder="介绍你的内推优势，比如可以直达部门负责人、反馈速度快、帮做面试辅导等..."
              className="input-base resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-primary-50/60 border border-primary-100">
              <div className="text-sm font-semibold text-primary-700 mb-1">
                📌 填写技巧
              </div>
              <p className="text-xs text-primary-600/90 leading-relaxed">
                明确技术栈、职级范围、团队氛围能让匹配度提升 60%。
              </p>
            </div>
            <div className="p-4 rounded-xl bg-success-50/60 border border-success-100">
              <div className="text-sm font-semibold text-success-700 mb-1">
                ✨ 高质量示例
              </div>
              <p className="text-xs text-success-600/90 leading-relaxed">
                "React技术栈，P6-P7职级，团队20人，弹性工作制，技术分享氛围好"
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-700">
                <Sparkles size={14} className="inline mr-1.5 -mt-0.5 text-warning-500" />
                期望交换条件
              </label>
              <button
                onClick={() =>
                  update("desiredExchange", [...form.desiredExchange, ""])
                }
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                + 添加条件
              </button>
            </div>
            <div className="space-y-2">
              {form.desiredExchange.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = [...form.desiredExchange];
                      next[i] = e.target.value;
                      update("desiredExchange", next);
                    }}
                    placeholder="如：腾讯/阿里前端岗内推机会"
                    className="input-base"
                  />
                  {form.desiredExchange.length > 1 && (
                    <button
                      onClick={() =>
                        update(
                          "desiredExchange",
                          form.desiredExchange.filter((_, idx) => idx !== i)
                        )
                      }
                      className="p-2 rounded-btn text-neutral-400 hover:bg-danger-50 hover:text-danger-500 transition"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              💡 填写你希望获得的内推资源，系统会自动匹配合适的交换伙伴
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              <Eye size={14} className="inline mr-1.5 -mt-0.5" />
              隐私可见范围
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {VISIBILITY_OPTIONS.map((opt) => {
                const active = form.visibility === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => update("visibility", opt.value as any)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition",
                      active
                        ? "border-primary-400 bg-primary-50/60 shadow-sm"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {active && (
                        <CheckCircle2 size={16} className="text-primary-600" />
                      )}
                      <span
                        className={cn(
                          "font-semibold text-sm",
                          active ? "text-primary-700" : "text-neutral-700"
                        )}
                      >
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50 via-success-50/60 to-warning-50 border border-primary-100/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-success-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-800 mb-1">
                  即将发布，确认信息完整？
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  发布后机会将在机会广场展示，候选人可发起申请。
                  你将收到消息提醒并可随时管理申请进度。
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge variant="primary" size="sm">
                    {form.company || "待填写"}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {form.position || "待填写"}
                  </Badge>
                  <Badge variant="success" size="sm">
                    {form.city || "待填写"}
                  </Badge>
                  <Badge variant="warning" size="sm">
                    {form.salaryMin}-{form.salaryMax}
                    {form.salaryUnit}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
