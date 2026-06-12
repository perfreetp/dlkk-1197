import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useUserStore } from "@/store/userStore";
import { CITIES, INDUSTRIES, SALARY_RANGES } from "@/utils/constants";
import { cn } from "@/utils/helpers";

export const SearchBar = () => {
  const filters = useOpportunityStore((s) => s.filters);
  const setFilters = useOpportunityStore((s) => s.setFilters);
  const resetFilters = useOpportunityStore((s) => s.resetFilters);
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const [showFilters, setShowFilters] = useState(false);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  const activeCount = [
    filters.city,
    filters.industry,
    filters.salaryMin !== null,
    filters.sortBy !== "latest",
  ].filter(Boolean).length;

  return (
    <div className="card-base p-5 mb-6 animate-[fade-in-up_0.4s_ease-out]">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="搜索岗位名称、公司名称或关键词..."
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            className="input-base pl-11 pr-4 !py-3 text-base"
          />
          {filters.keyword && (
            <button
              onClick={() => setFilters({ keyword: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:max-w-[60%]">
          <div className="relative flex-1 min-w-[140px]">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <select
              value={filters.city}
              onChange={(e) => setFilters({ city: e.target.value })}
              className="input-base !pl-9 !py-3 appearance-none pr-8 cursor-pointer"
            >
              <option value="">全部城市</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <Building2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ industry: e.target.value })}
              className="input-base !pl-9 !py-3 appearance-none pr-8 cursor-pointer"
            >
              <option value="">全部行业</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
          </div>

          <div className="relative flex-1 min-w-[140px]">
            <DollarSign
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <select
              value={
                filters.salaryMin === null
                  ? ""
                  : `${filters.salaryMin}-${filters.salaryMax || "+"}`
              }
              onChange={(e) => {
                const range = SALARY_RANGES.find(
                  (r) =>
                    `${r.min ?? ""}-${r.max ?? "+"}` === e.target.value
                );
                setFilters({
                  salaryMin: range ? range.min : null,
                  salaryMax: range ? range.max : null,
                });
              }}
              className="input-base !pl-9 !py-3 appearance-none pr-8 cursor-pointer"
            >
              <option value="">薪资不限</option>
              {SALARY_RANGES.slice(1).map((r) => (
                <option key={r.label} value={`${r.min}-${r.max ?? "+"}`}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 rounded-btn border px-4 py-3 font-medium text-sm transition",
              showFilters || activeCount > 0
                ? "bg-primary-50 border-primary-200 text-primary-700"
                : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <SlidersHorizontal size={16} />
            高级
            {activeCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary-600 text-white text-[11px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-100 animate-[fade-in-up_0.3s_ease-out]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-sm">排序方式：</span>
              {(
                [
                  { v: "latest", l: "最新发布" },
                  { v: "match", l: "匹配度最高" },
                  { v: "popular", l: "最热门" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setFilters({ sortBy: opt.v })}
                  className={cn(
                    "px-3 py-1.5 rounded-btn text-sm font-medium transition",
                    filters.sortBy === opt.v
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  {opt.l}
                </button>
              ))}
            </div>

            {activeCount > 0 && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-sm text-danger-600 font-medium hover:text-danger-700"
              >
                <X size={14} />
                清除全部筛选
              </button>
            )}
          </div>

          {currentUser && (
            <div className="mt-4 p-3 rounded-xl bg-primary-50/50 border border-primary-100">
              <p className="text-sm text-primary-700">
                💡 小提示：完善简历和认证信息可提升匹配度，基于你的{" "}
                <span className="font-semibold">{currentUser.skills.slice(0, 3).join("、")}</span>{" "}
                技能已为你智能排序机会。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
