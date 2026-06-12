import {
  FileText,
  MessageSquare,
  Star,
  FileUser,
  ChevronRight,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TodoItem } from "@/types";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";

const typeConfig: Record<
  TodoItem["type"],
  { icon: typeof FileText; color: string; bg: string; label: string }
> = {
  application: {
    icon: FileText,
    color: "text-warning-600",
    bg: "bg-warning-500",
    label: "申请",
  },
  message: {
    icon: MessageSquare,
    color: "text-primary-600",
    bg: "bg-primary-400",
    label: "消息",
  },
  review: {
    icon: Star,
    color: "text-success-600",
    bg: "bg-success-500",
    label: "评价",
  },
  resume: {
    icon: FileUser,
    color: "text-danger-600",
    bg: "bg-danger-500",
    label: "简历",
  },
};

const priorityBadge: Record<TodoItem["priority"], string> = {
  high: "chip-danger",
  medium: "chip-warning",
  low: "chip",
};

interface TodoListProps {
  todos: TodoItem[];
  onDone: (id: string) => void;
}

export const TodoList = ({ todos, onDone }: TodoListProps) => {
  const navigate = useNavigate();

  const handleTodoClick = (todo: TodoItem) => {
    if (todo.type === "application") navigate("/applications");
    else if (todo.type === "message") navigate("/messages");
    else if (todo.type === "review") navigate("/applications");
    else if (todo.relatedId.startsWith("/")) navigate(todo.relatedId);
    else navigate("/profile");
  };

  if (todos.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h3 className="font-serif text-lg font-semibold text-neutral-800">
            待办事项
          </h3>
        </Card.Header>
        <EmptyState
          title="全部处理完毕！"
          description="没有待办事项，享受今天的好心情吧～"
        />
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h3 className="font-serif text-lg font-semibold text-neutral-800">
          待办事项
        </h3>
        <span className="chip-primary">
          {todos.filter((t) => t.priority === "high").length} 个紧急
        </span>
      </Card.Header>
      <div className="divide-y divide-neutral-100">
        {todos.map((todo, i) => {
          const cfg = typeConfig[todo.type];
          const Icon = cfg.icon;
          return (
            <div
              key={todo.id}
              className={cn(
                "group flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/80 transition cursor-pointer animate-[fade-in-up_0.4s_ease-out_both]",
              )}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => handleTodoClick(todo)}
            >
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    cfg.bg + "/10"
                  )}
                >
                  <Icon size={22} className={cfg.color} />
                </div>
                <div
                  className={cn(
                    "absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-10 rounded-full",
                    cfg.bg
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-neutral-800 truncate group-hover:text-primary-600 transition">
                    {todo.title}
                  </p>
                  <span
                    className={cn(
                      priorityBadge[todo.priority],
                      "text-[10px] shrink-0"
                    )}
                  >
                    {todo.priority === "high"
                      ? "紧急"
                      : todo.priority === "medium"
                        ? "中等"
                        : "普通"}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 truncate">
                  {todo.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDone(todo.id);
                  }}
                  className="p-2 rounded-btn text-neutral-400 hover:bg-success-50 hover:text-success-600 transition opacity-0 group-hover:opacity-100"
                  title="标记完成"
                >
                  <Check size={18} />
                </button>
                <ChevronRight
                  size={18}
                  className="text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>
          );
        })}
      </div>
      <Card.Footer>
        <div className="text-sm text-neutral-500">
          共 <span className="font-semibold text-neutral-700">{todos.length}</span> 项待处理
        </div>
        <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
          查看全部
        </Button>
      </Card.Footer>
    </Card>
  );
};
