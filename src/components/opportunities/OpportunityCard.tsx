import {
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Eye,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import type { Opportunity, User } from "@/types";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useUserStore } from "@/store/userStore";
import { formatRelativeTime, formatSalary } from "@/utils/format";
import { cn } from "@/utils/helpers";

interface Props {
  opportunity: Opportunity;
  publisher?: User;
  index?: number;
}

const statusBadgeMap: Record<Opportunity["status"], { variant: any; label: string }> = {
  open: { variant: "success", label: "招聘中" },
  paused: { variant: "warning", label: "已暂停" },
  closed: { variant: "default", label: "已关闭" },
};

const visibilityMap: Record<Opportunity["visibility"], string> = {
  public: "公开",
  verified: "认证可见",
  network: "人脉可见",
};

export const OpportunityCard = ({ opportunity, publisher, index = 0 }: Props) => {
  const selectOpportunity = useOpportunityStore((s) => s.selectOpportunity);
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const getUserById = useUserStore((s) => s.getUserById);

  const opp = opportunity;
  const publisherData = publisher || getUserById(opp.publisherId);
  const isFav = favorites.includes(opp.id);
  const badge = statusBadgeMap[opp.status];

  return (
    <div
      onClick={() => selectOpportunity(opp)}
      className={cn(
        "card-base card-hover cursor-pointer relative overflow-hidden animate-[fade-in-up_0.5s_ease-out_both]"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {opp.matchScore && opp.matchScore >= 85 && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-br from-success-400 to-success-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
            <Sparkles size={12} />
            高度匹配 {opp.matchScore}%
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-100 to-primary-50 border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-serif text-xl font-bold text-primary-700">
              {opp.company.slice(0, 1)}
            </span>
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="font-serif text-lg font-semibold text-neutral-900 mb-1 truncate group-hover:text-primary-700 transition">
              {opp.position}
            </h3>
            <div className="flex items-center gap-2 text-sm text-neutral-600 flex-wrap">
              <span className="font-medium text-neutral-700">{opp.company}</span>
              <span className="text-neutral-300">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} className="text-neutral-400" />
                {opp.city}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-success-600 font-semibold">
                {formatSalary(opp.salaryMin, opp.salaryMax, opp.salaryUnit)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="default" size="sm">
            <Briefcase size={11} />
            {opp.experience}
          </Badge>
          <Badge variant="default" size="sm">
            <GraduationCap size={11} />
            {opp.education}
          </Badge>
          <Badge variant="primary" size="sm">
            {opp.industry}
          </Badge>
          <Badge variant={badge.variant as any} size="sm" dot>
            {badge.label}
          </Badge>
        </div>

        {opp.desiredExchange.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-warning-50/60 border border-warning-100">
            <div className="text-xs font-medium text-warning-700 mb-1.5 flex items-center gap-1">
              <Sparkles size={12} />
              期望交换
            </div>
            <div className="flex flex-wrap gap-1.5">
              {opp.desiredExchange.slice(0, 2).map((d, i) => (
                <span
                  key={i}
                  className="inline-block text-xs bg-white px-2 py-1 rounded-md text-warning-700 border border-warning-200"
                >
                  {d}
                </span>
              ))}
              {opp.desiredExchange.length > 2 && (
                <span className="inline-block text-xs px-2 py-1 text-warning-600 font-medium">
                  +{opp.desiredExchange.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2.5 min-w-0">
            {publisherData && (
              <>
                <Avatar name={publisherData.name} size="sm" src={publisherData.avatar} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-neutral-700 truncate flex items-center gap-1">
                    {publisherData.name}
                    {publisherData.verifiedCompany && (
                      <ShieldCheck
                        size={13}
                        className="text-primary-500 shrink-0"
                      />
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {publisherData.title}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <Users size={12} />
                {opp.applicationCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={12} />
                {opp.viewCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {formatRelativeTime(opp.createdAt)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(opp.id);
              }}
              className={cn(
                "p-2 rounded-btn transition",
                isFav
                  ? "bg-warning-50 text-warning-600"
                  : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              )}
            >
              {isFav ? (
                <BookmarkCheck size={18} />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
