import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  MessageSquare,
  ShieldCheck,
  User,
  Bell,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { useUserStore } from "@/store/userStore";
import { useMessageStore } from "@/store/messageStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useApplicationStore } from "@/store/applicationStore";
import { cn } from "@/utils/helpers";

const NAV_ITEMS = [
  { path: "/", label: "首页", icon: Home },
  { path: "/opportunities", label: "机会广场", icon: Briefcase },
  { path: "/applications", label: "交换申请", icon: FileText },
  { path: "/messages", label: "消息中心", icon: MessageSquare },
  { path: "/credits", label: "信用记录", icon: ShieldCheck },
];

export const Navbar = () => {
  const location = useLocation();
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const threads = useMessageStore((s) => s.threads);
  const applications = useApplicationStore((s) => s.applications);
  const getTotalUnread = useMessageStore((s) => s.getTotalUnread);
  const togglePublishModal = useOpportunityStore(
    (s) => s.togglePublishModal
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  const totalUnread = useMemo(
    () => getTotalUnread(currentUser?.id || ""),
    [threads, currentUser?.id]
  );
  const pendingCount = useMemo(
    () =>
      applications.filter(
        (a) => a.publisherId === currentUser?.id && a.status === "pending"
      ).length,
    [applications, currentUser?.id]
  );

  const currentBadgeCounts: Record<string, number> = {
    "/applications": pendingCount,
    "/messages": totalUnread,
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-gradient-primary shadow-lg">
        <div className="container">
          <div className="flex items-center h-16 gap-8">
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                <span className="font-serif text-white text-lg font-bold">推</span>
              </div>
              <span className="font-serif text-white text-xl font-semibold tracking-wide">
                推易换
              </span>
            </NavLink>

            <div className="hidden md:flex items-center gap-1 flex-1 max-w-md">
              <div className="relative w-full">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  type="text"
                  placeholder="搜索岗位、公司、行业..."
                  className="w-full h-10 pl-11 pr-4 rounded-btn bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/25 focus:outline-none transition backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" && location.pathname.startsWith(item.path));
                const count = currentBadgeCounts[item.path];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative px-4 py-2.5 rounded-btn text-sm font-medium flex items-center gap-2 transition-all",
                      isActive
                        ? "bg-white/15 text-white shadow-inner"
                        : "text-white/80 hover:text-white hover:bg-white/8"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {count && count > 0 ? (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1.5 rounded-full bg-danger-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg animate-pulse-soft">
                        {count > 99 ? "99+" : count}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePublishModal(true)}
                className="text-white/90 hover:bg-white/15 hover:text-white !px-3"
                leftIcon={<Plus size={18} />}
              >
                <span className="hidden sm:inline">发布机会</span>
              </Button>

              <button className="relative p-2 rounded-btn text-white/80 hover:bg-white/10 hover:text-white transition">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-[#172d4c]" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-btn hover:bg-white/10 transition"
                >
                  <Avatar
                    name={currentUser?.name || "用户"}
                    size="sm"
                    src={currentUser?.avatar}
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <div className="text-sm text-white font-medium leading-tight">
                      {currentUser?.name}
                    </div>
                    <div className="text-[11px] text-white/60 leading-tight">
                      {currentUser?.role === "employee" ? "在职员工" : "求职者"}
                    </div>
                  </div>
                  <ChevronDown size={14} className="text-white/60" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-card shadow-modal border border-neutral-200 overflow-hidden animate-[fade-in-up_0.2s_ease-out] z-20">
                      <div className="px-4 py-3 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-white">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={currentUser?.name || ""}
                            size="md"
                            src={currentUser?.avatar}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-neutral-800 truncate">
                              {currentUser?.name}
                            </div>
                            <div className="text-xs text-neutral-500 truncate">
                              {currentUser?.title}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <Badge variant="primary" size="sm" dot>
                            信用 {currentUser?.creditScore}
                          </Badge>
                          {currentUser?.verifiedCompany && (
                            <Badge variant="success" size="sm">
                              已认证
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="py-1.5">
                        <NavLink
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <User size={16} className="text-neutral-500" />
                          个人主页
                        </NavLink>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left">
                          <Settings size={16} className="text-neutral-500" />
                          账号设置
                        </button>
                      </div>
                      <div className="border-t border-neutral-100 py-1.5">
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 w-full text-left">
                          <LogOut size={16} />
                          退出登录
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-6">
          {[
            ...NAV_ITEMS,
            { path: "/profile", label: "我的", icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const count = currentBadgeCounts[item.path];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 gap-1 relative",
                  isActive ? "text-primary-600" : "text-neutral-500"
                )}
              >
                <div className="relative">
                  <Icon size={20} />
                  {count && count > 0 ? (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};
