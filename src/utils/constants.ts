export const CITIES = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "成都",
  "南京",
  "武汉",
  "西安",
  "苏州",
  "厦门",
  "青岛",
  "长沙",
  "重庆",
  "天津",
  "远程",
];

export const INDUSTRIES = [
  "互联网/科技",
  "金融",
  "电商",
  "教育",
  "医疗/健康",
  "制造业",
  "新能源",
  "游戏",
  "广告/传媒",
  "咨询",
  "物流/供应链",
  "房地产/建筑",
  "人工智能",
  "云计算",
  "汽车",
];

export const EXPERIENCES = [
  "不限",
  "应届",
  "1-3年",
  "3-5年",
  "5-10年",
  "10年以上",
];

export const EDUCATIONS = [
  "不限",
  "大专",
  "本科",
  "硕士",
  "博士",
];

export const SALARY_RANGES = [
  { label: "不限", min: null, max: null },
  { label: "10K以下", min: 0, max: 10 },
  { label: "10K-20K", min: 10, max: 20 },
  { label: "20K-40K", min: 20, max: 40 },
  { label: "40K-60K", min: 40, max: 60 },
  { label: "60K以上", min: 60, max: null },
];

export const VISIBILITY_OPTIONS = [
  { value: "public", label: "公开可见", desc: "所有用户均可查看" },
  { value: "verified", label: "认证可见", desc: "仅认证用户可查看" },
  { value: "network", label: "人脉可见", desc: "仅交换过的用户可见" },
] as const;

export const APPLICATION_STATUS_OPTIONS = [
  { value: "pending", label: "待处理", color: "warning" },
  { value: "accepted", label: "已接受", color: "primary" },
  { value: "in_progress", label: "推荐中", color: "primary" },
  { value: "interview", label: "面试中", color: "primary" },
  { value: "offer", label: "已发 Offer", color: "success" },
  { value: "hired", label: "已入职", color: "success" },
  { value: "rejected", label: "已拒绝", color: "danger" },
  { value: "failed", label: "未通过", color: "danger" },
] as const;

export const NAV_ITEMS = [
  { path: "/", label: "首页", icon: "Home" },
  { path: "/opportunities", label: "机会广场", icon: "Briefcase" },
  { path: "/applications", label: "交换申请", icon: "FileText" },
  { path: "/messages", label: "消息中心", icon: "MessageSquare" },
  { path: "/credits", label: "信用记录", icon: "ShieldCheck" },
  { path: "/profile", label: "个人主页", icon: "User" },
];

export const REPORT_REASONS = [
  "虚假信息",
  "诈骗行为",
  "辱骂骚扰",
  "违规收费",
  "泄露隐私",
  "其他违规",
];
