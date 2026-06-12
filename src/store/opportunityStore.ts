import { create } from "zustand";
import type { Opportunity, SearchFilters } from "@/types";
import { mockOpportunities } from "@/data/mockOpportunities";
import { withPersist } from "@/store/persist";

interface OpportunityState {
  opportunities: Opportunity[];
  filters: SearchFilters;
  selectedOpportunity: Opportunity | null;
  showPublishModal: boolean;
  showDetailDrawer: boolean;

  setFilters: (f: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  selectOpportunity: (opp: Opportunity | null) => void;
  toggleDetailDrawer: (open: boolean) => void;
  togglePublishModal: (open: boolean) => void;
  publishOpportunity: (opp: Omit<Opportunity, "id" | "viewCount" | "applicationCount" | "matchScore" | "createdAt" | "updatedAt" | "publisherId">) => void;
  updateOpportunityStatus: (id: string, status: Opportunity["status"]) => void;
  getFilteredOpportunities: () => Opportunity[];
  getMyOpportunities: (publisherId: string) => Opportunity[];
}

const initialFilters: SearchFilters = {
  keyword: "",
  city: "",
  industry: "",
  salaryMin: null,
  salaryMax: null,
  sortBy: "latest",
};

export const useOpportunityStore = create<OpportunityState>()(
  withPersist(
    (set, get) => ({
      opportunities: mockOpportunities,
      filters: initialFilters,
      selectedOpportunity: null,
      showPublishModal: false,
      showDetailDrawer: false,

      setFilters: (f) =>
        set((state) => ({ filters: { ...state.filters, ...f } })),

      resetFilters: () => set({ filters: initialFilters }),

      selectOpportunity: (opp) =>
        set({ selectedOpportunity: opp, showDetailDrawer: opp !== null }),

      toggleDetailDrawer: (open) => set({ showDetailDrawer: open }),

      togglePublishModal: (open) => set({ showPublishModal: open }),

      publishOpportunity: (oppData) => {
        const newOpp: Opportunity = {
          ...oppData,
          id: "opp-" + Date.now(),
          publisherId: get().opportunities[0]?.publisherId || "user-001",
          viewCount: 0,
          applicationCount: 0,
          matchScore: Math.floor(Math.random() * 40) + 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          opportunities: [newOpp, ...state.opportunities],
          showPublishModal: false,
        }));
      },

      updateOpportunityStatus: (id, status) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        })),

      getFilteredOpportunities: () => {
        const { opportunities, filters } = get();
        let list = opportunities.filter((o) => o.status === "open");

        if (filters.keyword) {
          const kw = filters.keyword.toLowerCase();
          list = list.filter(
            (o) =>
              o.position.toLowerCase().includes(kw) ||
              o.company.toLowerCase().includes(kw) ||
              o.description.toLowerCase().includes(kw)
          );
        }
        if (filters.city) list = list.filter((o) => o.city === filters.city);
        if (filters.industry)
          list = list.filter((o) => o.industry === filters.industry);
        if (filters.salaryMin !== null)
          list = list.filter((o) => o.salaryMax >= filters.salaryMin!);
        if (filters.salaryMax !== null)
          list = list.filter((o) => o.salaryMin <= filters.salaryMax!);

        if (filters.sortBy === "latest") {
          list.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (filters.sortBy === "match") {
          list.sort(
            (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
          );
        } else if (filters.sortBy === "popular") {
          list.sort((a, b) => b.viewCount - a.viewCount);
        }

        return list;
      },

      getMyOpportunities: (publisherId) =>
        get().opportunities.filter((o) => o.publisherId === publisherId),
    }),
    {
      name: "opportunity-store",
      version: 2,
      partialize: (state) => ({
        opportunities: state.opportunities,
        filters: state.filters,
      }),
    }
  )
);
