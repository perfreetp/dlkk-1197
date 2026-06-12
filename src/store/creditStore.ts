import { create } from "zustand";
import type { Review, CreditRecordItem, ReviewDimensions } from "@/types";
import { mockReviews, mockCreditRecords } from "@/data/mockReviews";

interface CreditState {
  reviews: Review[];
  creditRecords: CreditRecordItem[];
  showReportModal: boolean;
  showReviewModal: boolean;
  targetApplicationId: string | null;

  toggleReportModal: (open: boolean) => void;
  toggleReviewModal: (
    open: boolean,
    applicationId?: string | null
  ) => void;
  addReview: (
    reviewerId: string,
    revieweeId: string,
    applicationId: string,
    rating: number,
    dimensions: ReviewDimensions,
    content: string
  ) => void;
  addCreditRecord: (record: Omit<CreditRecordItem, "id" | "createdAt">) => void;
  getReviewsByUserId: (userId: string) => Review[];
  getAverageDimensions: (userId: string) => ReviewDimensions;
  getCreditRecordsByUserId: (userId: string) => CreditRecordItem[];
}

export const useCreditStore = create<CreditState>((set, get) => ({
  reviews: mockReviews,
  creditRecords: mockCreditRecords,
  showReportModal: false,
  showReviewModal: false,
  targetApplicationId: null,

  toggleReportModal: (open) => set({ showReportModal: open }),

  toggleReviewModal: (open, applicationId = null) =>
    set({ showReviewModal: open, targetApplicationId: applicationId }),

  addReview: (reviewerId, revieweeId, applicationId, rating, dimensions, content) => {
    const newReview: Review = {
      id: "rev-" + Date.now(),
      reviewerId,
      revieweeId,
      applicationId,
      rating,
      dimensions,
      content,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ reviews: [newReview, ...state.reviews] }));
  },

  addCreditRecord: (record) => {
    const newRecord: CreditRecordItem = {
      ...record,
      id: "cr-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ creditRecords: [newRecord, ...state.creditRecords] }));
  },

  getReviewsByUserId: (userId) =>
    get()
      .reviews.filter((r) => r.revieweeId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),

  getAverageDimensions: (userId) => {
    const reviews = get().reviews.filter((r) => r.revieweeId === userId);
    if (reviews.length === 0)
      return { responseSpeed: 0, keepingPromise: 0, communication: 0, quality: 0 };
    const sum = reviews.reduce(
      (acc, r) => ({
        responseSpeed: acc.responseSpeed + r.dimensions.responseSpeed,
        keepingPromise: acc.keepingPromise + r.dimensions.keepingPromise,
        communication: acc.communication + r.dimensions.communication,
        quality: acc.quality + r.dimensions.quality,
      }),
      { responseSpeed: 0, keepingPromise: 0, communication: 0, quality: 0 }
    );
    const len = reviews.length;
    return {
      responseSpeed: Number((sum.responseSpeed / len).toFixed(1)),
      keepingPromise: Number((sum.keepingPromise / len).toFixed(1)),
      communication: Number((sum.communication / len).toFixed(1)),
      quality: Number((sum.quality / len).toFixed(1)),
    };
  },

  getCreditRecordsByUserId: (userId) =>
    get()
      .creditRecords.filter((r) => r.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
}));
