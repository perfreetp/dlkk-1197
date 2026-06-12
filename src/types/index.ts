export interface User {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  role: "seeker" | "employee";
  bio: string;
  email: string;
  phone?: string;
  city: string;
  verifiedIdentity: boolean;
  verifiedCompany: boolean;
  verifiedEducation: boolean;
  creditScore: number;
  privacyLevel: "public" | "verified" | "network";
  skills: string[];
  resumeSummary?: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  publisherId: string;
  company: string;
  companyLogo: string;
  position: string;
  city: string;
  industry: string;
  salaryMin: number;
  salaryMax: number;
  salaryUnit: "K" | "W";
  experience: string;
  education: string;
  description: string;
  referralNote: string;
  desiredExchange: string[];
  visibility: "public" | "verified" | "network";
  status: "open" | "paused" | "closed";
  matchScore?: number;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStep {
  status: string;
  time: string;
  note?: string;
}

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "interview"
  | "offer"
  | "hired"
  | "failed";

export interface Application {
  id: string;
  opportunityId: string;
  applicantId: string;
  publisherId: string;
  resumeSummary: string;
  resumeFile?: string;
  coverLetter: string;
  status: ApplicationStatus;
  progressTimeline: ProgressStep[];
  messageThreadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  applicationId?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  type: "text" | "file" | "resume" | "system";
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
}

export interface ReviewDimensions {
  responseSpeed: number;
  keepingPromise: number;
  communication: number;
  quality: number;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  applicationId: string;
  rating: number;
  dimensions: ReviewDimensions;
  content: string;
  createdAt: string;
}

export interface CreditRecordItem {
  id: string;
  userId: string;
  type: "success" | "review" | "report" | "warning";
  title: string;
  description: string;
  scoreChange: number;
  relatedId?: string;
  createdAt: string;
}

export type TodoType = "application" | "message" | "review" | "resume";
export type TodoPriority = "high" | "medium" | "low";

export interface TodoItem {
  id: string;
  type: TodoType;
  title: string;
  description: string;
  relatedId: string;
  priority: TodoPriority;
  createdAt: string;
}

export interface Statistics {
  totalSuccessReferrals: number;
  monthlyGrowth: number;
  activeApplications: number;
  opportunitiesThisMonth: number;
  creditScore: number;
  monthlyTrend: { month: string; count: number }[];
}

export interface SearchFilters {
  keyword: string;
  city: string;
  industry: string;
  salaryMin: number | null;
  salaryMax: number | null;
  sortBy: "latest" | "match" | "popular";
}
