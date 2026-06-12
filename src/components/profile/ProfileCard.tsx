import {
  ShieldCheck,
  Building2,
  GraduationCap,
  UserCheck,
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle2,
  Clock,
  Edit3,
  UploadCloud,
  FileText,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { useUserStore } from "@/store/userStore";
import { useCreditStore } from "@/store/creditStore";
import { cn } from "@/utils/helpers";
import { VISIBILITY_OPTIONS } from "@/utils/constants";
import { useMemo, useState } from "react";
import { roleTextMap, formatDate } from "@/utils/format";

interface Props {
  onEdit?: () => void;
}

export const ProfileCard = ({ onEdit }: Props) => {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const reviews = useCreditStore((s) => s.reviews);
  const getAverageDimensions = useCreditStore((s) => s.getAverageDimensions);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  const avgDims = useMemo(
    () => getAverageDimensions(curUser?.id || ""),
    [reviews, curUser?.id]
  );
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [editResume, setEditResume] = useState(false);
  const [resumeText, setResumeText] = useState(curUser?.resumeSummary || "");
  const [skillInput, setSkillInput] = useState("");

  if (!curUser) return null;

  const totalVerified = [
    curUser.verifiedIdentity,
    curUser.verifiedCompany,
    curUser.verifiedEducation,
  ].filter(Boolean).length;

  const visibilityInfo = VISIBILITY_OPTIONS.find(
    (o) => o.value === curUser.privacyLevel
  );

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || curUser.skills.includes(s)) return;
    updateProfile({ skills: [...curUser.skills, s] });
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    updateProfile({ skills: curUser.skills.filter((x) => x !== s) });
  };

  const saveResume = () => {
    updateProfile({ resumeSummary: resumeText });
    setEditResume(false);
  };

  return (
    <>
      <Card className="overflow-hidden mb-6 animate-[fade-in-up_0.4s_ease-out]">
        <div className="relative h-36 md:h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400" />
          <div className="absolute inset-0 bg-noise-texture opacity-20 mix-blend-overlay" />
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-success-400/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-warning-400/25 blur-3xl" />

          <button
            onClick={onEdit}
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition backdrop-blur-sm"
          >
            <Edit3 size={14} />
            编辑资料
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10 md:-mt-12 mb-5">
            <div className="relative shrink-0">
              <Avatar
                name={curUser.name}
                size="xl"
                src={curUser.avatar}
                className="!ring-4 !ring-white !w-24 !h-24 md:!w-28 md:!h-28 shadow-xl"
              />
              {totalVerified >= 2 && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-success-400 to-success-600 text-white flex items-center justify-center ring-4 ring-white shadow-lg">
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                  {curUser.name}
                </h2>
                <Badge variant={curUser.role === "employee" ? "primary" : "success"}>
                  {roleTextMap[curUser.role]}
                </Badge>
                {curUser.verifiedIdentity && (
                  <Badge variant="success" size="sm" dot>
                    <ShieldCheck size={11} />
                    实名认证
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-neutral-600 text-sm md:text-base">
                <span className="font-medium text-neutral-700">{curUser.title}</span>
                <span className="text-neutral-300 hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <Building2 size={13} className="text-neutral-400" />
                  {curUser.company}
                </span>
                <span className="text-neutral-300 hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-neutral-400" />
                  {curUser.city}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6 shrink-0">
              <div className="text-center">
                <div className="font-serif text-xl md:text-2xl font-bold text-neutral-900">
                  {curUser.creditScore}
                </div>
                <div className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                  <Star size={11} className="text-warning-500 fill-warning-500" />
                  守约分
                </div>
              </div>
              <div className="text-center">
                <div className="font-serif text-xl md:text-2xl font-bold text-neutral-900">
                  {totalVerified}/3
                </div>
                <div className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                  <CheckCircle2 size={11} className="text-success-500" />
                  认证项
                </div>
              </div>
              <div className="text-center">
                <div className="font-serif text-xl md:text-2xl font-bold text-neutral-900">
                  {formatDate(curUser.createdAt, "M月")}
                </div>
                <div className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                  <Clock size={11} className="text-primary-500" />
                  加入
                </div>
              </div>
            </div>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-5 text-sm md:text-base">
            {curUser.bio}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            {[
              {
                icon: <UserCheck size={16} />,
                label: "身份认证",
                desc: "真实身份核验",
                color: "success",
                done: curUser.verifiedIdentity,
              },
              {
                icon: <Building2 size={16} />,
                label: "公司认证",
                desc: "在职员工凭证",
                color: "primary",
                done: curUser.verifiedCompany,
              },
              {
                icon: <GraduationCap size={16} />,
                label: "学历认证",
                desc: "最高学历验证",
                color: "warning",
                done: curUser.verifiedEducation,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-xl border-2 flex items-start gap-3 transition",
                  item.done
                    ? `bg-${item.color}-50/60 border-${item.color}-200`
                    : "bg-neutral-50 border-neutral-200"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    item.done
                      ? `bg-${item.color}-100 text-${item.color}-600`
                      : "bg-neutral-200 text-neutral-400"
                  )}
                >
                  {item.done ? item.icon : <Lock size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-neutral-800 text-sm">
                      {item.label}
                    </span>
                    {item.done && (
                      <CheckCircle2
                        size={13}
                        className={`text-${item.color}-500`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
                {!item.done && (
                  <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 shrink-0">
                    去认证
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-800 mb-3 text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail size={14} className="text-primary-500" />
                  联系方式
                </span>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-xs font-normal text-neutral-500 flex items-center gap-1 hover:text-primary-600"
                >
                  <Eye size={11} />
                  {visibilityInfo?.label}
                </button>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail size={14} className="text-neutral-400 w-4" />
                  <span className="text-neutral-500 w-14">邮箱</span>
                  <span className="font-medium text-neutral-700">{curUser.email}</span>
                </div>
                {curUser.phone ? (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone size={14} className="text-neutral-400 w-4" />
                    <span className="text-neutral-500 w-14">手机</span>
                    <span className="font-medium text-neutral-700">{curUser.phone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Phone size={14} className="w-4" />
                    <span className="text-neutral-500 w-14">手机</span>
                    <span>未设置（仅认证用户可见）</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-800 mb-3 text-sm flex items-center gap-2">
                <Sparkles size={14} className="text-warning-500" />
                技能标签
                <span className="ml-auto text-xs font-normal text-neutral-400">
                  {curUser.skills.length} 项
                </span>
              </h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {curUser.skills.map((s) => (
                  <span
                    key={s}
                    className="group relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-neutral-700 text-xs font-medium border border-neutral-200 hover:border-primary-300 hover:text-primary-700 transition"
                  >
                    {s}
                    <button
                      onClick={() => removeSkill(s)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full text-neutral-400 hover:text-danger-500 transition"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="输入技能标签回车添加"
                  className="input-base !py-1.5 !text-xs"
                />
                <Button size="sm" variant="secondary" onClick={addSkill}>
                  添加
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-primary-50/50 via-white to-warning-50/40 border border-primary-100/50">
            <div className="flex items-start justify-between mb-3 gap-4">
              <h4 className="font-semibold text-neutral-800 text-sm flex items-center gap-2">
                <FileText size={14} className="text-primary-500" />
                简历摘要
                <span className="ml-1 text-xs font-normal text-neutral-500">
                  （完善后申请时可一键使用）
                </span>
              </h4>
              {!editResume ? (
                <button
                  onClick={() => {
                    setResumeText(curUser.resumeSummary || "");
                    setEditResume(true);
                  }}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0"
                >
                  <Edit3 size={11} />
                  编辑
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditResume(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    取消
                  </button>
                  <Button size="sm" onClick={saveResume}>
                    保存
                  </Button>
                </div>
              )}
            </div>
            {!editResume ? (
              curUser.resumeSummary ? (
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {curUser.resumeSummary}
                </p>
              ) : (
                <div className="text-center py-6 text-neutral-400">
                  <UploadCloud size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">尚未填写简历摘要</p>
                  <p className="text-xs mt-0.5">建议填写，能大幅提升匹配率和申请通过率</p>
                </div>
              )
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value.slice(0, 500))}
                rows={5}
                placeholder="教育背景、工作经历、核心技能、项目亮点..."
                className="input-base resize-none !text-sm"
              />
            )}
            {!editResume && curUser.resumeSummary && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="w-28 h-2 rounded-full bg-neutral-200 overflow-hidden">
                    <span
                      className="block h-full bg-gradient-to-r from-success-400 to-success-600"
                      style={{
                        width: `${Math.min(100, (curUser.resumeSummary!.length / 250) * 100)}%`,
                      }}
                    />
                  </span>
                  简历完整度 {Math.min(100, Math.round((curUser.resumeSummary!.length / 250) * 100))}%
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Eye size={11} />
                  {visibilityInfo?.desc}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Modal
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        size="md"
        title="隐私可见范围设置"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPrivacy(false)}>
              关闭
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {VISIBILITY_OPTIONS.map((opt) => {
            const active = curUser.privacyLevel === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  updateProfile({ privacyLevel: opt.value });
                }}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition flex items-start gap-3",
                  active
                    ? "border-primary-400 bg-primary-50/60 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    active ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-400"
                  )}
                >
                  {active ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        "font-semibold",
                        active ? "text-primary-700" : "text-neutral-800"
                      )}
                    >
                      {opt.label}
                    </span>
                    {active && <CheckCircle2 size={14} className="text-primary-600" />}
                  </div>
                  <p className="text-sm text-neutral-500">{opt.desc}</p>
                </div>
              </button>
            );
          })}
          <p className="text-xs text-neutral-400 pt-2">
            * 隐私设置将对联系方式、简历内容生效，内推申请时对方仍可查看你主动提交的简历摘要。
          </p>
        </div>
      </Modal>
    </>
  );
};
