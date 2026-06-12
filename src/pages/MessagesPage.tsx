import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Search,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  FileText,
  Check,
  CheckCheck,
  ArrowLeft,
  Users,
  Image,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { useMessageStore } from "@/store/messageStore";
import { useUserStore } from "@/store/userStore";
import { useApplicationStore } from "@/store/applicationStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { formatChatTime, formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/helpers";

interface Props {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const ThreadList = ({ sidebarOpen, onToggleSidebar }: Props) => {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const threads = useMessageStore((s) => s.threads);
  const getThreadsByUser = useMessageStore((s) => s.getThreadsByUser);
  const activeThreadId = useMessageStore((s) => s.activeThreadId);
  const selectThread = useMessageStore((s) => s.selectThread);
  const markRead = useMessageStore((s) => s.markThreadRead);
  const [search, setSearch] = useState("");

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  const userThreads = useMemo(
    () => getThreadsByUser(curUser?.id || ""),
    [threads, curUser?.id]
  );

  const filtered = useMemo(
    () => userThreads.filter((t) => {
      if (!search) return true;
      const otherId = t.participants.find((p) => p !== curUser?.id);
      const other = otherId ? users.find((u) => u.id === otherId) : undefined;
      return other?.name.toLowerCase().includes(search.toLowerCase());
    }),
    [userThreads, search, users, curUser?.id]
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full lg:h-[calc(100vh-12rem)] border-r border-neutral-200 bg-white transition-all duration-300",
        "fixed lg:static inset-0 z-30 lg:z-auto bg-white",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={{ width: "100%", maxWidth: "360px" }}
    >
      <div className="px-4 py-4 border-b border-neutral-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="lg:hidden">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-btn text-neutral-600 hover:bg-neutral-100"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
          <h3 className="font-serif text-lg font-semibold text-neutral-800">
            消息中心
          </h3>
          <Badge variant="primary" size="sm" dot>
            {userThreads.reduce((s, t) => s + t.unreadCount, 0)} 条未读
          </Badge>
        </div>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索联系人..."
            className="input-base !pl-9 !py-2 !text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <EmptyState
            title="暂无会话"
            description="发起内推申请后将自动建立会话"
            className="!py-10"
          />
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((thread, i) => {
              const otherId = thread.participants.find(
                (p) => p !== curUser?.id
              );
              const other = otherId ? users.find((u) => u.id === otherId) : undefined;
              const isActive = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    selectThread(thread.id);
                    markRead(thread.id, curUser?.id || "");
                    if (window.innerWidth < 1024) onToggleSidebar();
                  }}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 text-left transition",
                    isActive
                      ? "bg-primary-50/60 border-l-2 border-primary-500"
                      : "hover:bg-neutral-50 border-l-2 border-transparent",
                    "animate-[fade-in-up_0.3s_ease-out_both]"
                  )}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      name={other?.name || "用户"}
                      size="md"
                      src={other?.avatar}
                    />
                    {thread.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={cn(
                            "truncate",
                            thread.unreadCount > 0
                              ? "font-semibold text-neutral-800"
                              : "font-medium text-neutral-700"
                          )}
                        >
                          {other?.name}
                        </span>
                        {other?.verifiedCompany && (
                          <ShieldCheck
                            size={12}
                            className="text-primary-500 shrink-0"
                          />
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 shrink-0">
                        {formatChatTime(thread.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm truncate",
                          thread.unreadCount > 0
                            ? "text-neutral-700 font-medium"
                            : "text-neutral-500"
                        )}
                      >
                        {thread.lastMessage}
                      </p>
                      {thread.unreadCount > 0 && (
                        <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm animate-pulse-soft">
                          {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatWindow = ({ sidebarOpen, onToggleSidebar }: Props) => {
  const users = useUserStore((s) => s.users);
  const currentUserId = useUserStore((s) => s.currentUserId);
  const activeThreadId = useMessageStore((s) => s.activeThreadId);
  const threads = useMessageStore((s) => s.threads);
  const allMessages = useMessageStore((s) => s.messages);
  const getThreadMessages = useMessageStore((s) => s.getThreadMessages);
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const applications = useApplicationStore((s) => s.applications);
  const draft = useMessageStore((s) => s.draftText);
  const setDraft = useMessageStore((s) => s.setDraftText);
  const sendMessage = useMessageStore((s) => s.sendMessage);
  const scrollRef = useRef<HTMLDivElement>(null);

  const curUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );
  const messages = useMemo(
    () => (activeThreadId ? getThreadMessages(activeThreadId) : []),
    [allMessages, activeThreadId]
  );

  const thread = useMemo(
    () => threads.find((t) => t.id === activeThreadId),
    [threads, activeThreadId]
  );
  const otherId = thread?.participants.find((p) => p !== curUser?.id);
  const other = useMemo(
    () => (otherId ? users.find((u) => u.id === otherId) : undefined),
    [users, otherId]
  );

  const app = useMemo(
    () => applications.find((a) => a.id === thread?.applicationId),
    [applications, thread?.applicationId]
  );
  const opp = useMemo(
    () => (app ? opportunities.find((o) => o.id === app?.opportunityId) : undefined),
    [opportunities, app?.opportunityId]
  );

  const handleSend = () => {
    if (!draft.trim() || !thread || !curUser) return;
    sendMessage(curUser.id, thread.id, draft.trim());
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, activeThreadId]);

  if (!thread || !other) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 h-full lg:h-[calc(100vh-12rem)]">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-full bg-white shadow-card flex items-center justify-center mx-auto mb-5">
            <Users size={36} className="text-primary-400" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-neutral-800 mb-2">
            选择一个会话开始沟通
          </h3>
          <p className="text-sm text-neutral-500 mb-5">
            发起内推申请后将自动与内推人建立会话，也可以在此管理所有站内沟通
          </p>
          <div className="lg:hidden">
            <Button onClick={onToggleSidebar}>选择会话</Button>
          </div>
        </div>
      </div>
    );
  }

  let lastDate = "";

  return (
    <div className="flex-1 flex flex-col h-full lg:h-[calc(100vh-12rem)] bg-white">
      <div className="flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-neutral-200 shrink-0 bg-gradient-to-r from-white to-neutral-50">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-btn text-neutral-600 hover:bg-neutral-100 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <Avatar name={other.name} size="md" src={other.avatar} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-800 truncate">
                {other.name}
              </span>
              {other.verifiedCompany && (
                <ShieldCheck size={13} className="text-primary-500 shrink-0" />
              )}
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              {other.title}
              <span>·</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
                在线
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {opp && (
            <Badge variant="primary" size="sm">
              <FileText size={11} />
              {opp.position}
            </Badge>
          )}
          <button className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 transition">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 transition">
            <Video size={18} />
          </button>
          <button className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 transition">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {opp && (
        <div className="px-4 md:px-6 py-3 bg-primary-50/50 border-b border-primary-100/50 shrink-0">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-primary-700 text-sm">
                {opp.company.slice(0, 1)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-neutral-800 text-sm truncate">
                {opp.position}
              </div>
              <div className="text-xs text-neutral-500">
                {opp.company} · {opp.city} · {opp.salaryMin}-{opp.salaryMax}
                {opp.salaryUnit}
              </div>
            </div>
            <span className="text-xs text-primary-600 font-medium shrink-0">
              关联申请 · {formatRelativeTime(app?.createdAt || opp.createdAt)}
            </span>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 py-5 bg-neutral-50/60 bg-noise-texture space-y-4"
      >
        {messages.map((msg, i) => {
          const isMine = msg.senderId === curUser?.id;
          const dateKey = formatChatTime(msg.timestamp).split(" ")[0];
          const showDate = dateKey !== lastDate;
          lastDate = dateKey;

          return (
            <div key={msg.id} className="animate-[fade-in-up_0.3s_ease-out_both]" style={{ animationDelay: `${i * 20}ms` }}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-[11px] text-neutral-400 px-3 py-1 rounded-full bg-white border border-neutral-200">
                    {formatChatTime(msg.timestamp)}
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "flex items-end gap-2.5",
                  isMine ? "justify-end" : "justify-start"
                )}
              >
                {!isMine && (
                  <Avatar name={other.name} size="sm" src={other.avatar} />
                )}
                <div
                  className={cn(
                    "max-w-[75%] md:max-w-[65%]",
                    isMine && "order-1"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                      isMine
                        ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md"
                        : "bg-white text-neutral-700 border border-neutral-200 rounded-bl-md"
                    )}
                  >
                    {msg.type === "file" || msg.type === "resume" ? (
                      <div className="flex items-center gap-2.5 min-w-[220px]">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            isMine ? "bg-white/20" : "bg-primary-50"
                          )}
                        >
                          {msg.type === "resume" ? (
                            <FileText
                              size={18}
                              className={isMine ? "text-white" : "text-primary-600"}
                            />
                          ) : (
                            <Image
                              size={18}
                              className={isMine ? "text-white" : "text-primary-600"}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "font-medium truncate",
                              isMine ? "text-white" : "text-neutral-800"
                            )}
                          >
                            {msg.fileName || msg.content}
                          </div>
                          <div
                            className={cn(
                              "text-xs",
                              isMine ? "text-white/70" : "text-neutral-400"
                            )}
                          >
                            点击下载 · 245KB
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-1 text-[11px] text-neutral-400",
                      isMine ? "justify-end" : "justify-start"
                    )}
                  >
                    <span>{formatChatTime(msg.timestamp).split(" ").slice(-1)[0]}</span>
                    {isMine &&
                      (msg.read ? (
                        <CheckCheck size={12} className="text-primary-400" />
                      ) : (
                        <Check size={12} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 px-4 md:px-6 py-3.5 border-t border-neutral-200 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 transition">
              <Paperclip size={18} />
            </button>
            <button className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 hover:text-warning-500 transition">
              <Image size={18} />
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
              className="input-base resize-none !py-2.5 !pr-11 max-h-32 scrollbar-thin"
              style={{ minHeight: "42px" }}
            />
            <button className="absolute right-2 bottom-2 p-1.5 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-warning-500 transition">
              <Smile size={16} />
            </button>
          </div>
          <Button
            size="md"
            onClick={handleSend}
            disabled={!draft.trim()}
            leftIcon={<Send size={16} />}
            className="shrink-0"
          >
            发送
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["请问简历多久有反馈？", "面试安排好了吗？", "方便电话沟通吗？"].map(
            (q, i) => (
              <button
                key={i}
                onClick={() => setDraft(q)}
                className="chip hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition"
              >
                {q}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default function MessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PageContainer className="!py-4 !px-0 md:!py-6 md:!px-4 lg:!px-6">
      <div className="hidden md:block px-4 lg:px-0 mb-4">
        <PageHeader
          title="消息中心"
          subtitle="与内推伙伴实时沟通，跟踪申请进展"
          actions={
            <Badge variant="warning" size="sm" dot>
              新消息
            </Badge>
          }
        />
      </div>
      <Card className="overflow-hidden !rounded-2xl !border-neutral-200 !shadow-card p-0">
        <div className="flex min-h-[500px] overflow-hidden">
          <ThreadList
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <ChatWindow sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(true)} />
        </div>
      </Card>
    </PageContainer>
  );
}
