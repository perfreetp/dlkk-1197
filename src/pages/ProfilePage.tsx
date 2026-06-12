import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Tabs } from "@/components/common/Tabs";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { Bookmark, Briefcase, FileText, ShieldCheck } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useCreditStore } from "@/store/creditStore";
import { OpportunityDetail } from "@/components/opportunities/OpportunityDetail";
import { PublishForm } from "@/components/opportunities/PublishForm";
import { formatRelativeTime, statusTextMap } from "@/utils/format";
import { cn } from "@/utils/helpers";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const favorites = useUserStore((s) => s.favorites);
  const allOpps = useOpportunityStore((s) => s.opportunities);
  const reviews = useCreditStore((s) => s.reviews);
  const getUser = useUserStore((s) => s.getUserById);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  const myOpps = useMemo(
    () => allOpps.filter((o) => o.publisherId === curUser?.id),
    [allOpps, curUser?.id]
  );
  const favOpps = useMemo(
    () => allOpps.filter((o) => favorites.includes(o.id)),
    [allOpps, favorites]
  );
  const myReviews = useMemo(
    () => (curUser ? reviews.filter((r) => r.revieweeId === curUser.id) : []),
    [reviews, curUser?.id]
  );

  const [tab, setTab] = useState("published");

  const tabs = [
    { value: "published", label: "我发布的机会", count: myOpps.length, icon: <Briefcase size={15} /> },
    { value: "favorites", label: "我的收藏", count: favOpps.length, icon: <Bookmark size={15} /> },
    { value: "reviews", label: "我的评价", count: myReviews.length, icon: <ShieldCheck size={15} /> },
  ];

  return (
    <PageContainer>
      <ProfileCard />

      <Card className="overflow-hidden animate-[fade-in-up_0.4s_ease-out_50ms]">
        <div className="px-1 pt-1">
          <Tabs tabs={tabs} activeValue={tab} onChange={setTab} />
        </div>

        <div className="p-5">
          {tab === "published" && (
            <div>
              {myOpps.length === 0 ? (
                <EmptyState
                  title="还没有发布机会"
                  description="完成公司认证后，即可发布你公司的内推机会与他人交换"
                  action={
                    <Link to="/opportunities">
                      <Button>发布我的第一个机会</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {myOpps.map((opp, i) => (
                    <div
                      key={opp.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition animate-[fade-in-up_0.4s_ease-out_both]"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="md:col-span-7">
                        <OpportunityCard opportunity={opp} index={0} />
                      </div>
                      <div className="md:col-span-5 flex flex-col justify-between gap-3">
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-50">
                          <div className="text-center">
                            <div className="text-xs text-neutral-500">浏览</div>
                            <div className="font-semibold text-neutral-800 text-sm">
                              {opp.viewCount}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-neutral-500">申请</div>
                            <div className="font-semibold text-neutral-800 text-sm">
                              {opp.applicationCount}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-neutral-500">状态</div>
                            <div
                              className={cn(
                                "font-semibold text-sm",
                                opp.status === "open"
                                  ? "text-success-600"
                                  : opp.status === "paused"
                                    ? "text-warning-600"
                                    : "text-neutral-500"
                              )}
                            >
                              {statusTextMap[opp.status]}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to="/applications" className="flex-1">
                            <Button variant="secondary" size="sm" fullWidth>
                              <FileText size={14} />
                              查看申请
                            </Button>
                          </Link>
                          <Button
                            variant={opp.status === "open" ? "ghost" : "primary"}
                            size="sm"
                          >
                            {opp.status === "open" ? "暂停" : "开启"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "favorites" && (
            <div>
              {favOpps.length === 0 ? (
                <EmptyState
                  icon={<Bookmark size={48} className="text-neutral-300" />}
                  title="收藏夹是空的"
                  description="看到感兴趣的机会，点击卡片上的书签图标即可收藏"
                  action={
                    <Link to="/opportunities">
                      <Button>去机会广场看看</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favOpps.map((opp, i) => (
                    <OpportunityCard key={opp.id} opportunity={opp} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div>
              {myReviews.length === 0 ? (
                <EmptyState
                  title="还没有收到评价"
                  description="完成首次内推交换并互评后，评价将展示在这里"
                  action={
                    <Link to="/credits">
                      <Button variant="secondary">查看信用记录</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {myReviews.map((r, i) => {
                    const reviewer = getUser(r.reviewerId);
                    return (
                      <div
                        key={r.id}
                        className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition animate-[fade-in-up_0.4s_ease-out_both]"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar
                            name={reviewer?.name || "用户"}
                            size="md"
                            src={reviewer?.avatar}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-neutral-800">
                                {reviewer?.name || "匿名用户"}
                              </span>
                              <Badge variant="default" size="sm">
                                {reviewer?.title || "用户"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <span className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={cn(
                                      idx < r.rating
                                        ? "text-warning-500"
                                        : "text-neutral-300"
                                    )}
                                  >
                                    ★
                                  </span>
                                ))}
                              </span>
                              <span>·</span>
                              <span>{formatRelativeTime(r.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                          {r.content}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                          {Object.entries(r.dimensions).map(([k, v]) => (
                            <div key={k} className="flex items-center gap-1.5">
                              <span className="capitalize text-neutral-400">
                                {k === "responseSpeed"
                                  ? "响应速度"
                                  : k === "keepingPromise"
                                    ? "守约率"
                                    : k === "communication"
                                      ? "沟通态度"
                                      : "推荐质量"}
                              </span>
                              <div className="w-16 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-primary-400 to-success-500"
                                  style={{ width: `${(v / 5) * 100}%` }}
                                />
                              </div>
                              <span className="font-medium text-neutral-600">
                                {v}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <OpportunityDetail />
      <PublishForm />
    </PageContainer>
  );
}
