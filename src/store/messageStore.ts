import { create } from "zustand";
import type { Message, MessageThread } from "@/types";
import { mockThreads, mockMessages } from "@/data/mockMessages";

interface MessageState {
  threads: MessageThread[];
  messages: Message[];
  activeThreadId: string | null;
  draftText: string;

  selectThread: (threadId: string) => void;
  setDraftText: (text: string) => void;
  sendMessage: (
    senderId: string,
    threadId: string,
    content: string,
    type?: Message["type"]
  ) => void;
  createThread: (
    participants: string[],
    applicationId?: string
  ) => string;
  getThreadMessages: (threadId: string) => Message[];
  getThreadsByUser: (userId: string) => MessageThread[];
  getTotalUnread: (userId: string) => number;
  markThreadRead: (threadId: string, userId: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  threads: mockThreads,
  messages: mockMessages,
  activeThreadId: mockThreads[0]?.id || null,
  draftText: "",

  selectThread: (threadId) => set({ activeThreadId: threadId, draftText: "" }),

  setDraftText: (text) => set({ draftText: text }),

  sendMessage: (senderId, threadId, content, type = "text") => {
    const newMsg: Message = {
      id: "m-" + Date.now(),
      threadId,
      senderId,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      messages: [...state.messages, newMsg],
      threads: state.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastMessage: content,
              lastMessageTime: newMsg.timestamp,
              unreadCount:
                t.participants[0] === senderId
                  ? t.unreadCount + 1
                  : t.unreadCount,
            }
          : t
      ),
      draftText: "",
    }));
  },

  createThread: (participants, applicationId) => {
    const existing = get().threads.find(
      (t) =>
        t.participants.length === participants.length &&
        t.participants.every((p) => participants.includes(p))
    );
    if (existing) return existing.id;

    const id = "thread-" + Date.now();
    const newThread: MessageThread = {
      id,
      participants,
      lastMessage: "会话已建立，开始沟通吧～",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      applicationId,
      isOnline: true,
    };
    set((state) => ({ threads: [newThread, ...state.threads] }));
    return id;
  },

  getThreadMessages: (threadId) =>
    get()
      .messages.filter((m) => m.threadId === threadId)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),

  getThreadsByUser: (userId) =>
    get()
      .threads.filter((t) => t.participants.includes(userId))
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      ),

  getTotalUnread: (userId) =>
    get()
      .threads.filter((t) => t.participants.includes(userId))
      .reduce((sum, t) => sum + t.unreadCount, 0),

  markThreadRead: (threadId) =>
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t
      ),
      messages: state.messages.map((m) =>
        m.threadId === threadId ? { ...m, read: true } : m
      ),
    })),
}));
