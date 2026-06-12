import { useMemo } from "react";
import { Plus, Filter } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { SearchBar } from "@/components/opportunities/SearchBar";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { OpportunityDetail } from "@/components/opportunities/OpportunityDetail";
import { PublishForm } from "@/components/opportunities/PublishForm";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useUserStore } from "@/store/userStore";
import { Link } from "react-router-dom";

export default function OpportunitiesPage() {
  const all = useOpportunityStore((s) => s.opportunities);
  const filters = useOpportunityStore((s) => s.filters);
  const getFilteredOpportunities = useOpportunityStore((s) => s.getFilteredOpportunities);
  const togglePublish = useOpportunityStore((s) => s.togglePublishModal);
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const favorites = useUserStore((s) => s.favorites);

  const filtered = useMemo(
    () => getFilteredOpportunities(),
    [all, filters]
  );
  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  const hasFilters =
    filters.keyword ||
    filters.city ||
    filters.industry ||
    filters.salaryMin !== null ||
    filters.sortBy !== "latest";

  return (
    <PageContainer>
      <PageHeader
        title="机会广场"
        subtitle={`共 ${all.length} 个精选内推机会，${favorites.length} 个已收藏`}
        actions={
          <>
            <Badge variant="success" size="sm" dot>
              {all.filter((o) => o.status === "open").length} 个在招
            </Badge>
            <Button leftIcon={<Plus size={16} />} onClick={() => togglePublish(true)}>
              发布机会
            </Button>
          </>
        }
      />

      <SearchBar />

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-5 animate-[fade-in-up_0.3s_ease-out]">
          <Filter size={14} className="text-neutral-400" />
          {filters.keyword && (
            <Badge variant="primary" size="sm">
              关键词：{filters.keyword}
            </Badge>
          )}
          {filters.city && (
            <Badge variant="primary" size="sm">
              城市：{filters.city}
            </Badge>
          )}
          {filters.industry && (
            <Badge variant="primary" size="sm">
              行业：{filters.industry}
            </Badge>
          )}
          {filters.salaryMin !== null && (
            <Badge variant="primary" size="sm">
              薪资：{filters.salaryMin}K 以上
            </Badge>
          )}
          <span className="text-sm text-neutral-500">
            匹配到 <span className="font-semibold text-primary-600">{filtered.length}</span> 个机会
          </span>
        </div>
      )}

      {curUser && curUser.role !== "employee" && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-warning-50 via-primary-50/50 to-success-50 border border-primary-100/60 animate-[fade-in-up_0.4s_ease-out] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg font-semibold text-neutral-800 mb-1 flex items-center gap-2">
              💡 成为认证内推人
            </h4>
            <p className="text-sm text-neutral-600">
              完成公司认证即可发布你公司的内推机会，与平台用户进行资源交换。
            </p>
          </div>
          <Link to="/profile">
            <Button variant="secondary" size="sm">
              立即认证
            </Button>
          </Link>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="没有找到匹配的机会"
          description="试试调整筛选条件，或清除筛选查看全部机会"
          action={
            <Link to="/opportunities">
              <Button variant="secondary">清除筛选条件</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      )}

      <PublishForm />
      <OpportunityDetail />
    </PageContainer>
  );
}
