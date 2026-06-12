import { create } from "zustand";
import type { User, TodoItem, Statistics } from "@/types";
import { mockUsers, CURRENT_USER_ID } from "@/data/mockUsers";
import { withPersist } from "@/store/persist";

interface UserState {
  users: User[];
  currentUserId: string;
  todos: TodoItem[];
  statistics: Statistics;
  favorites: string[];
  getCurrentUser: () => User | undefined;
  getUserById: (id: string) => User | undefined;
  toggleFavorite: (oppId: string) => void;
  markTodoDone: (todoId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateUserCreditScore: (userId: string, delta: number) => void;
}

const initialTodos: TodoItem[] = [
  {
    id: "todo-001",
    type: "application",
    title: "有 2 份申请等待处理",
    description: "郑思琪等人申请了你的内推岗位",
    relatedId: "app-002",
    priority: "high",
    createdAt: "2024-06-12T09:00:00Z",
  },
  {
    id: "todo-002",
    type: "message",
    title: "有 6 条未读消息",
    description: "来自周铭轩、林诗雨等的新消息",
    relatedId: "/messages",
    priority: "high",
    createdAt: "2024-06-12T15:20:00Z",
  },
  {
    id: "todo-003",
    type: "review",
    title: "有 1 次待评价的交换",
    description: "孙远航已完成面试，等待你的互评",
    relatedId: "app-001",
    priority: "medium",
    createdAt: "2024-06-12T10:00:00Z",
  },
  {
    id: "todo-004",
    type: "resume",
    title: "完善简历摘要",
    description: "简历完整度 75%，补充可获得更多匹配",
    relatedId: "/profile",
    priority: "low",
    createdAt: "2024-06-11T20:00:00Z",
  },
];

const initialStatistics: Statistics = {
  totalSuccessReferrals: 28,
  monthlyGrowth: 12,
  activeApplications: 5,
  opportunitiesThisMonth: 3,
  creditScore: 92,
  monthlyTrend: [
    { month: "1月", count: 2 },
    { month: "2月", count: 3 },
    { month: "3月", count: 5 },
    { month: "4月", count: 4 },
    { month: "5月", count: 6 },
    { month: "6月", count: 8 },
  ],
};

export const useUserStore = create<UserState>()(
  withPersist(
    (set, get) => ({
      users: mockUsers,
      currentUserId: CURRENT_USER_ID,
      todos: initialTodos,
      statistics: initialStatistics,
      favorites: ["opp-003", "opp-011"],

      getCurrentUser: () => get().users.find((u) => u.id === get().currentUserId),
      getUserById: (id) => get().users.find((u) => u.id === id),

      toggleFavorite: (oppId) =>
        set((state) => ({
          favorites: state.favorites.includes(oppId)
            ? state.favorites.filter((id) => id !== oppId)
            : [...state.favorites, oppId],
        })),

      markTodoDone: (todoId) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== todoId),
        })),

      updateProfile: (updates) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === state.currentUserId ? { ...u, ...updates } : u
          ),
        })),

      updateUserCreditScore: (userId, delta) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? { ...u, creditScore: Math.max(0, Math.min(100, u.creditScore + delta)) }
              : u
          ),
        })),
    }),
    {
      name: "user-store",
      version: 3,
      partialize: (state) => ({
        users: state.users,
        currentUserId: state.currentUserId,
        todos: state.todos,
        statistics: state.statistics,
        favorites: state.favorites,
      }),
    }
  )
);
