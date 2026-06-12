import { useMemo } from "react";
import {
  Briefcase,
  Users,
  ShieldCheck,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/home/StatCard";
import { TodoList } from "@/components/home/TodoList";
import { QuickActions } from "@/components/home/QuickActions";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Avatar } from "@/components/common/Avatar";
import { useUserStore } from "@/store/userStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useApplicationStore } from "@/store/applicationStore";
import { formatRelativeTime } from "@/utils/format";

export default function HomePage() {
  const stats = useUserStore((s) => s.statistics);
  const todos = useUserStore((s) => s.todos);
  const markTodoDone = useUserStore((s) => s.markTodoDone);
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const filters = useOpportunityStore((s) => s.filters);
  const getFilteredOpportunities = useOpportunityStore((s) => s.getFilteredOpportunities);
  const applications = useApplicationStore((s) => s.applications);
  const getApplicationsByUser = useApplicationStore((s) => s.getApplicationsByUser);

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId), [users, currentUserId]);
  const topOpportunities = useMemo(
    () => getFilteredOpportunities().slice(0, 3),
    [opportunities, filters]
  );
  const appsResult = useMemo(
    () => getApplicationsByUser(currentUser?.id || ""),
    [applications, currentUser?.id]
  );
  const activeApps = appsResult.received.filter(
    (a) =>
      a.status === "pending" ||
      a.status === "accepted" ||
      a.status === "in_progress" ||
      a.status === "interview"
  ).length;

  return (
    <PageContainer>
      <div className="mb-8 overflow-hidden rounded-2xl relative animate-[fade-in-up_0.5s_ease-out]">
        <div className="absolute inset-0 bg-gradient-primary opacity-95" />
        <div className="absolute inset-0 bg-noise-texture opacity-30 mix-blend-overlay" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-400/30 blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-success-400/20 blur-3xl" />

        <div className="relative px-6 md:px-10 py-8 md:py-12 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 mb-4">
                <Sparkles size={14} className="text-warning-400" />
                <span>下午好，{currentUser?.name}！今天有 {todos.length} 件事等你处理</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 tracking-tight text-balance">
                信任连接人才，内推成就彼此
              </h1>
              <p className="text-white/80 text-base md:text-lg leading-relaxed text-balance">
                通过建立安全、透明的内推交换生态，让每一次推荐都值得信赖。
                你的信用评分 <span className="font-semibold text-warning-400">{stats.creditScore}</span> 已超过平台 92% 的用户。
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link to="/opportunities">
                  <Button
                    size="lg"
                    className="bg-white !text-primary-700 hover:bg-white/90 shadow-lg shadow-primary-900/20"
                    rightIcon={<ArrowRight size={18} />}
                  >
                    浏览内推机会
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="!text-white border border-white/25 hover:bg-white/10"
                  >
                    完善个人资料
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex -space-x-3">
                {["林诗雨", "王浩然", "赵雅婷", "周铭轩"].map((name, i) => (
                  <Avatar
                    key={name}
                    name={name}
                    size="md"
                    className="ring-2 ring-[#172d4c]"
                  />
                ))}
              </div>
              <div className="text-sm text-white/80">
                <div className="font-semibold text-white">2,847+</div>
                本月成功交换
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="累计成功推荐"
          value={stats.totalSuccessReferrals}
          icon={<Target size={22} />}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
          trend={stats.monthlyGrowth}
          trendLabel="环比"
          chartData={stats.monthlyTrend}
          accent="from-primary-400 to-primary-600"
          delay={50}
        />
        <StatCard
          label="进行中申请"
          value={activeApps}
          icon={<Briefcase size={22} />}
          iconBg="bg-success-100"
          iconColor="text-success-600"
          trend={15}
          trendLabel="周增"
          accent="from-success-400 to-success-600"
          delay={100}
        />
        <StatCard
          label="守约评分"
          value={stats.creditScore}
          icon={<ShieldCheck size={22} />}
          iconBg="bg-warning-100"
          iconColor="text-warning-600"
          trend={3}
          trendLabel="上升"
          accent="from-warning-400 to-warning-600"
          delay={150}
        />
        <StatCard
          label="本月新机会"
          value={stats.opportunitiesThisMonth}
          icon={<Zap size={22} />}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          trend={25}
          trendLabel="月增"
          accent="from-pink-400 to-pink-600"
          delay={200}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodoList todos={todos} onDone={markTodoDone} />

          <Card>
            <Card.Header>
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-lg font-semibold text-neutral-800">
                  最新内推机会
                </h3>
                <Badge variant="primary" size="sm" dot>
                  实时更新
                </Badge>
              </div>
              <Link to="/opportunities">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                  查看全部
                </Button>
              </Link>
            </Card.Header>
            <div className="divide-y divide-neutral-100">
              {topOpportunities.map((opp, i) => (
                <Link
                  key={opp.id}
                  to="/opportunities"
                  className="group flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/80 transition animate-[fade-in-up_0.4s_ease-out_both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <span className="font-serif text-lg font-bold text-primary-700">
                      {opp.company.slice(0, 1)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-neutral-800 group-hover:text-primary-700 transition truncate">
                        {opp.position}
                      </span>
                      {opp.matchScore && opp.matchScore >= 85 && (
                        <Badge variant="success" size="sm">
                          匹配 {opp.matchScore}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span>{opp.company}</span>
                      <span className="text-neutral-300">·</span>
                      <span>{opp.city}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-success-600 font-medium">
                        {opp.salaryMin}-{opp.salaryMax}
                        {opp.salaryUnit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-neutral-400">
                      {formatRelativeTime(opp.createdAt)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      <Users size={12} className="inline mr-1 -mt-0.5" />
                      {opp.applicationCount} 人已申请
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <QuickActions />

          <Card>
            <Card.Header>
              <h3 className="font-serif text-lg font-semibold text-neutral-800">
                平台动态
              </h3>
            </Card.Header>
            <div className="p-5 space-y-4">
              {[
                {
                  icon: <Users size={16} />,
                  text: "王浩然 成功推荐 孙远航 入职天猫数据分析",
                  time: "10分钟前",
                  color: "bg-success-50 text-success-600",
                },
                {
                  icon: <Sparkles size={16} />,
                  text: "林诗雨 发布了新机会「游戏运营经理」",
                  time: "25分钟前",
                  color: "bg-primary-50 text-primary-600",
                },
                {
                  icon: <ShieldCheck size={16} />,
                  text: "黄俊杰 获得了周铭轩的五星好评",
                  time: "1小时前",
                  color: "bg-warning-50 text-warning-600",
                },
                {
                  icon: <Zap size={16} />,
                  text: "本周新增内推机会 42 个，覆盖 8 个行业",
                  time: "今天 09:00",
                  color: "bg-pink-50 text-pink-600",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 animate-[fade-in-up_0.4s_ease-out_both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {item.text}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
