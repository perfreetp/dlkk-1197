import {
  Plus,
  Search,
  MessageSquare,
  FileUser,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOpportunityStore } from "@/store/opportunityStore";
import { Card } from "@/components/common/Card";
import { cn } from "@/utils/helpers";

const actions = [
  {
    key: "publish",
    title: "发布内推机会",
    desc: "分享你能内推的岗位",
    icon: Plus,
    gradient: "from-primary-400 to-primary-600",
    path: "/opportunities",
    onClickAction: (nav: (p: string) => void, togglePublish: () => void) => {
      togglePublish();
      nav("/opportunities");
    },
  },
  {
    key: "search",
    title: "搜索理想岗位",
    desc: "15+ 精选内推机会",
    icon: Search,
    gradient: "from-success-400 to-success-600",
    path: "/opportunities",
  },
  {
    key: "message",
    title: "查看沟通消息",
    desc: "与内推伙伴保持联系",
    icon: MessageSquare,
    gradient: "from-warning-400 to-warning-600",
    path: "/messages",
  },
  {
    key: "resume",
    title: "完善我的简历",
    desc: "简历越好匹配率越高",
    icon: FileUser,
    gradient: "from-pink-400 to-pink-600",
    path: "/profile",
  },
];

export const QuickActions = () => {
  const navigate = useNavigate();
  const togglePublish = useOpportunityStore((s) => s.togglePublishModal);

  return (
    <Card>
      <Card.Header>
        <h3 className="font-serif text-lg font-semibold text-neutral-800">
          快捷操作
        </h3>
      </Card.Header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={() => {
                if (action.onClickAction)
                  action.onClickAction(navigate, () => togglePublish(true));
                else navigate(action.path);
              }}
              className={cn(
                "group relative p-5 rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-neutral-50 hover:shadow-card-hover hover:border-neutral-200 transition-all duration-300 text-left animate-[fade-in-up_0.4s_ease-out_both]",
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg",
                  action.gradient
                )}
              >
                <Icon size={24} />
              </div>
              <div className="font-semibold text-neutral-800 mb-1 group-hover:text-primary-700 transition flex items-center gap-1">
                {action.title}
                <ArrowRight
                  size={14}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {action.desc}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
