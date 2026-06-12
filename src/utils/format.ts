import { format, formatDistanceToNow, formatRelative, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export const formatDate = (date: string, pattern: string = "yyyy-MM-dd") => {
  try {
    return format(parseISO(date), pattern, { locale: zhCN });
  } catch {
    return date;
  }
};

export const formatDateTime = (date: string) => {
  try {
    return format(parseISO(date), "yyyy-MM-dd HH:mm", { locale: zhCN });
  } catch {
    return date;
  }
};

export const formatRelativeTime = (date: string) => {
  try {
    return formatDistanceToNow(parseISO(date), {
      addSuffix: true,
      locale: zhCN,
    });
  } catch {
    return date;
  }
};

export const formatChatTime = (date: string) => {
  try {
    const d = parseISO(date);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return format(d, "HH:mm");
    if (diffDays === 1) return "昨天 " + format(d, "HH:mm");
    if (diffDays < 7) return formatRelative(d, now, { locale: zhCN });
    return format(d, "MM-dd HH:mm");
  } catch {
    return date;
  }
};

export const formatSalary = (
  min: number,
  max: number,
  unit: "K" | "W" = "K"
) => {
  return `${min}-${max}${unit}`;
};

export const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

export const statusTextMap: Record<string, string> = {
  pending: "待处理",
  accepted: "已接受",
  rejected: "已拒绝",
  in_progress: "推荐中",
  interview: "面试中",
  offer: "已发 Offer",
  hired: "已入职",
  failed: "未通过",
  open: "招聘中",
  paused: "已暂停",
  closed: "已关闭",
};

export const roleTextMap: Record<string, string> = {
  seeker: "求职者",
  employee: "在职员工",
};
