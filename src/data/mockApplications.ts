import type { Application } from "@/types";

export const mockApplications: Application[] = [
  {
    id: "app-001",
    opportunityId: "opp-010",
    applicantId: "user-007",
    publisherId: "user-005",
    resumeSummary:
      "网易云音乐4年数据分析师经验，浙大统计硕士。主导过多个用户增长实验，AB测试经验丰富。SQL/Python熟练，Tableau精通。",
    coverLetter:
      "您好！我一直关注京东物流的数智化转型，非常希望能加入您的团队。附件是我的详细简历，期待进一步沟通。",
    status: "interview",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-10T10:30:00Z" },
      {
        status: "内推人已接受",
        time: "2024-06-10T15:20:00Z",
        note: "简历已看过，背景很匹配，我来帮你推",
      },
      { status: "简历已投递", time: "2024-06-11T09:15:00Z", note: "已发送给京东物流数据部负责人" },
      {
        status: "面试邀请",
        time: "2024-06-12T14:00:00Z",
        note: "技术一面安排在6月14日下午2点",
      },
    ],
    messageThreadId: "thread-001",
    createdAt: "2024-06-10T10:30:00Z",
    updatedAt: "2024-06-12T14:00:00Z",
  },
  {
    id: "app-002",
    opportunityId: "opp-007",
    applicantId: "user-008",
    publisherId: "user-001",
    resumeSummary:
      "2025届北大新媒体硕士，字节/美团/小红书三段产品运营实习，有策划千万级曝光活动的经验。",
    coverLetter:
      "陈老师好！我是北大的郑思琪，之前在小红书做过内容运营实习，非常希望能争取飞书的实习机会！",
    status: "pending",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-12T09:00:00Z" },
    ],
    messageThreadId: "thread-002",
    createdAt: "2024-06-12T09:00:00Z",
    updatedAt: "2024-06-12T09:00:00Z",
  },
  {
    id: "app-003",
    opportunityId: "opp-001",
    applicantId: "user-006",
    publisherId: "user-001",
    resumeSummary:
      "武软工本科，3年小米MIUI前端经验。React/Vue3双栈熟练，有移动端性能优化实战。",
    coverLetter:
      "子轩你好！我是吴梦琪，前小米前端。看到你发的抖音电商前端岗位非常感兴趣，我的技术栈很匹配，期待沟通！",
    status: "accepted",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-09T11:20:00Z" },
      {
        status: "内推人已接受",
        time: "2024-06-09T16:45:00Z",
        note: "简历很不错！我整理一下马上帮你推",
      },
    ],
    messageThreadId: "thread-003",
    createdAt: "2024-06-09T11:20:00Z",
    updatedAt: "2024-06-09T16:45:00Z",
  },
  {
    id: "app-004",
    opportunityId: "opp-014",
    applicantId: "user-009",
    publisherId: "user-002",
    resumeSummary:
      "5年Go后端经验，前滴滴派单系统开发。熟悉K8s、gRPC、微服务治理，有大规模分布式系统经验。",
    coverLetter:
      "诗雨您好，非常关注腾讯云的技术发展，我有多年分布式存储相关经验，相信能为团队贡献价值。",
    status: "in_progress",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-09T15:40:00Z" },
      { status: "内推人已接受", time: "2024-06-09T20:10:00Z" },
      {
        status: "简历已投递",
        time: "2024-06-10T10:30:00Z",
        note: "已发给云业务技术总监，对方对你的滴滴经历很感兴趣",
      },
    ],
    messageThreadId: "thread-004",
    createdAt: "2024-06-09T15:40:00Z",
    updatedAt: "2024-06-10T10:30:00Z",
  },
  {
    id: "app-005",
    opportunityId: "opp-003",
    applicantId: "user-008",
    publisherId: "user-002",
    resumeSummary:
      "北大新媒体硕士，3段大厂运营实习。活动策划、内容运营、用户增长都有涉猎。",
    coverLetter: "诗雨姐好！非常向往微信支付的PM岗位，我的产品思维和数据分析能力都不错。",
    status: "rejected",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-08T14:00:00Z" },
      {
        status: "已拒绝",
        time: "2024-06-08T19:30:00Z",
        note: "抱歉，这个岗位要求3年以上正式工作经验，你可以关注微信支付的暑期实习项目",
      },
    ],
    createdAt: "2024-06-08T14:00:00Z",
    updatedAt: "2024-06-08T19:30:00Z",
  },
  {
    id: "app-006",
    opportunityId: "opp-002",
    applicantId: "user-006",
    publisherId: "user-003",
    resumeSummary: "3年前端经验求职算法岗（虽然不太匹配但尝试一下）",
    coverLetter: "王老师好，我一直对算法很感兴趣，虽然是前端背景但自学过NLP...",
    status: "failed",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-07T09:00:00Z" },
      { status: "内推人已接受", time: "2024-06-07T10:30:00Z" },
      { status: "简历已投递", time: "2024-06-07T15:00:00Z" },
      {
        status: "未通过",
        time: "2024-06-10T11:20:00Z",
        note: "技术匹配度不太够，前端转算法建议先读硕或者积累更多算法项目",
      },
    ],
    messageThreadId: "thread-005",
    createdAt: "2024-06-07T09:00:00Z",
    updatedAt: "2024-06-10T11:20:00Z",
  },
  {
    id: "app-007",
    opportunityId: "opp-013",
    applicantId: "user-007",
    publisherId: "user-003",
    resumeSummary:
      "浙大统计硕士，4年网易数据分析经验。SQL/Python/Tableau三件套精通，AB测试老司机。",
    coverLetter: "浩然老师好！天猫数据实习非常符合我的背景，虽然已经有工作经验但想尝试内推转正机会。",
    status: "offer",
    progressTimeline: [
      { status: "申请已提交", time: "2024-06-11T15:30:00Z" },
      { status: "内推人已接受", time: "2024-06-11T18:00:00Z" },
      { status: "简历已投递", time: "2024-06-12T09:00:00Z" },
      { status: "面试邀请", time: "2024-06-12T11:30:00Z" },
      { status: "已发 Offer", time: "2024-06-12T17:45:00Z", note: "暑期实习offer，日薪350，期待入职！" },
    ],
    messageThreadId: "thread-006",
    createdAt: "2024-06-11T15:30:00Z",
    updatedAt: "2024-06-12T17:45:00Z",
  },
  {
    id: "app-008",
    opportunityId: "opp-004",
    applicantId: "user-009",
    publisherId: "user-005",
    resumeSummary: "5年Go后端经验，擅长分布式系统，期望转Java架构方向。",
    coverLetter: "铭轩你好！我是黄俊杰，关注京东交易架构很久了，虽然主要做Go但也有Java基础。",
    status: "hired",
    progressTimeline: [
      { status: "申请已提交", time: "2024-05-20T10:00:00Z" },
      { status: "内推人已接受", time: "2024-05-20T14:30:00Z" },
      { status: "简历已投递", time: "2024-05-21T09:00:00Z" },
      { status: "面试邀请", time: "2024-05-22T11:00:00Z" },
      { status: "已发 Offer", time: "2024-05-28T16:00:00Z" },
      { status: "已入职", time: "2024-06-10T09:00:00Z", note: "入职京东交易中台T7，感谢推荐！" },
    ],
    messageThreadId: "thread-007",
    createdAt: "2024-05-20T10:00:00Z",
    updatedAt: "2024-06-10T09:00:00Z",
  },
];
