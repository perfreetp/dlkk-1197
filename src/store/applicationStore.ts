import { create } from "zustand";
import type { Application, ApplicationStatus, ProgressStep } from "@/types";
import { mockApplications } from "@/data/mockApplications";

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  showApplicationDetail: boolean;
  activeTab: "sent" | "received";

  setActiveTab: (tab: "sent" | "received") => void;
  selectApplication: (app: Application | null) => void;
  toggleDetail: (open: boolean) => void;
  createApplication: (
    app: Omit<
      Application,
      "id" | "status" | "progressTimeline" | "createdAt" | "updatedAt"
    >
  ) => void;
  updateApplicationStatus: (
    id: string,
    status: ApplicationStatus,
    note?: string
  ) => void;
  getApplicationsByUser: (
    userId: string
  ) => { sent: Application[]; received: Application[] };
  getApplicationById: (id: string) => Application | undefined;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: mockApplications,
  selectedApplication: null,
  showApplicationDetail: false,
  activeTab: "received",

  setActiveTab: (tab) => set({ activeTab: tab }),

  selectApplication: (app) =>
    set({
      selectedApplication: app,
      showApplicationDetail: app !== null,
    }),

  toggleDetail: (open) => set({ showApplicationDetail: open }),

  createApplication: (appData) => {
    const newApp: Application = {
      ...appData,
      id: "app-" + Date.now(),
      status: "pending",
      progressTimeline: [
        { status: "申请已提交", time: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ applications: [newApp, ...state.applications] }));
  },

  updateApplicationStatus: (id, status, note) => {
    const stepMap: Record<ApplicationStatus, string> = {
      pending: "申请已提交",
      accepted: "内推人已接受",
      rejected: "已拒绝",
      in_progress: "简历已投递",
      interview: "面试邀请",
      offer: "已发 Offer",
      hired: "已入职",
      failed: "未通过",
    };
    const newStep: ProgressStep = {
      status: stepMap[status] || status,
      time: new Date().toISOString(),
      note,
    };
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              progressTimeline: [...a.progressTimeline, newStep],
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));
  },

  getApplicationsByUser: (userId) => {
    const all = get().applications;
    return {
      sent: all.filter((a) => a.applicantId === userId),
      received: all.filter((a) => a.publisherId === userId),
    };
  },

  getApplicationById: (id) => get().applications.find((a) => a.id === id),
}));
