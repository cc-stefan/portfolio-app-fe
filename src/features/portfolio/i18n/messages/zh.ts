import type { PortfolioDictionary } from "../types";

export const dictionary: PortfolioDictionary = {
  meta: {
    siteName: "作品集",
    defaultTitle: "作品集",
    description:
      "一个建立在实时后端内容之上的高级作品集前端，具备响应式布局与产品级界面质量。",
    homeTitle: "精选项目",
    homeDescription:
      "一个由实时项目 API 驱动、并以现代设计系统重建的作品集体验。",
    projectUnavailableTitle: "项目不可用",
    projectUnavailableDescription: "作品集后端暂时无法返回该项目。",
    notFoundTitle: "页面未找到",
    notFoundDescription: "请求的路由在当前作品集应用中不存在。",
  },
  localeNames: {
    en: "English",
    ro: "Romana",
    zh: "中文",
  },
  header: {
    brand: "作品集",
    tagline: "产品工程师",
    navOverview: "概览",
    navWork: "项目",
    navProcess: "方法",
    navContact: "联系",
    languageLabel: "语言",
    themeLabel: "主题",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
  },
  home: {
    eyebrow: "现代前端系统",
    title: "像高端 SaaS 产品一样重建的高级作品集体验。",
    description:
      "已发布项目直接来自 portfolio-app-be，并通过全新的叙事界面呈现：更强的信息层级、更完整的状态设计、更快的浏览效率，以及更克制的动效。",
    availability:
      "可承接产品工程、设计系统、前端架构与平台型体验相关工作。",
    primaryCta: "浏览项目",
    secondaryCta: "开始沟通",
    metrics: {
      projects: "已发布项目",
      featured: "精选项目",
      technologies: "核心技术",
      status: "后端状态",
    },
    statusOnline: "在线",
    statusOffline: "离线",
    statusUnavailable: "不可用",
    showcaseLabel: "项目索引",
    showcaseTitle: "由后端驱动的案例展示，拥有产品级呈现层。",
    showcaseDescription:
      "这个网格的阅读体验像精致的 SaaS 产品目录，但每一项内容仍然来自同一个实时后端契约。",
    featuredTab: "精选",
    allTab: "全部项目",
    emptyTitle: "当前还没有已发布项目。",
    emptyDescription:
      "在后端管理端创建或发布项目后，这里会自动显示对应内容。",
    capabilitiesLabel: "能力",
    capabilitiesTitle: "在争取注意力之前，界面先说明交付能力范围。",
    capabilitiesDescription:
      "技术栈被翻译为面向产品的能力表达，让工程与业务视角都能快速理解深度。",
    capabilities: [
      {
        title: "前端架构",
        description:
          "可扩展的 App Router 结构、清晰的服务端与客户端边界，以及稳定的渲染策略。",
      },
      {
        title: "设计系统",
        description:
          "基于设计令牌的 UI、可复用组件契约、响应式行为与一致的可访问性模式。",
      },
      {
        title: "后端集成",
        description:
          "围绕真实 API 契约、校验规则与运行状态构建的界面，而不是静态演示稿。",
      },
    ],
    processLabel: "方法",
    processTitle: "按严肃 SaaS 产品团队的标准来构建，而不是只做展示页。",
    processDescription:
      "这次重构优先考虑可维护性、状态覆盖与交互质量，而不是静态的营销式包装。",
    processCards: [
      {
        title: "Server-first 渲染",
        description:
          "关键页面在服务端获取实时数据，以保证速度、可索引性与稳定性。",
      },
      {
        title: "可复用 UI 契约",
        description:
          "按钮、面板、状态与表单共享同一套设计语言，而不是页面级散乱样式。",
      },
      {
        title: "状态感知 UX",
        description:
          "加载、空状态、离线与成功反馈都被作为核心体验来设计，而不是补丁。",
      },
    ],
    inquiryLabel: "咨询",
    inquiryTitle: "以直接且结构化的方式开启下一次项目合作。",
    inquiryDescription:
      "表单采用类型安全校验、可访问字段状态与即时反馈，已具备接入真实线索流程的基础。",
  },
  project: {
    backToHome: "返回首页",
    label: "案例详情",
    summaryTitle: "项目摘要",
    overviewTitle: "概览",
    overviewDescription:
      "详情页在保持简洁可读的同时，直接呈现由后端管理的真实项目内容。",
    factsTitle: "项目信息",
    stackTitle: "技术栈",
    linksTitle: "项目链接",
    deliveryTitle: "交付说明",
    deliveryCards: [
      {
        title: "API 驱动路由",
        description:
          "该页面由项目 slug 接口渲染，而不是依赖重复的前端静态内容。",
      },
      {
        title: "稳健的状态处理",
        description:
          "项目不可用、数据缺失和内容不完整等情况都有明确的兜底方案。",
      },
    ],
    relatedTitle: "更多项目",
    relatedDescription:
      "来自同一后端数据源的其他已发布项目，并由相同的 UI 系统保持一致性。",
    unavailableTitle: "该项目暂时无法从后端加载。",
    unavailableDescription:
      "项目接口没有返回渲染此案例详情所需的数据。",
    unavailableHint:
      "请在 3001 端口启动 portfolio-app-be，或更新前端环境中的 PORTFOLIO_API_BASE_URL。",
    notFoundTitle: "该路由未映射到任何已发布项目。",
    notFoundDescription:
      "slug 可能有误，项目可能仍是草稿，或后端中不存在对应条目。",
  },
  inquiryForm: {
    nameLabel: "姓名",
    namePlaceholder: "你的姓名",
    emailLabel: "邮箱",
    emailPlaceholder: "you@company.com",
    companyLabel: "公司",
    companyPlaceholder: "公司或团队",
    budgetLabel: "预算",
    budgetPlaceholder: "大致预算或项目规模",
    scopeLabel: "项目范围",
    scopePlaceholder: "你正在构建或优化什么？",
    messageLabel: "背景说明",
    messagePlaceholder:
      "请描述产品阶段、时间计划，以及你希望获得支持的部分。",
    submit: "发送咨询",
    submitting: "发送中...",
    successTitle: "咨询已提交",
    successDescription:
      "请求已通过校验，并被前端接入路由成功接收。",
    errorTitle: "提交失败",
    errorDescription: "请检查表单内容，或稍后再试。",
    privacyNote:
      "该示例流程通过本地 Next.js 路由完成校验与提交，已为接入真实后端流程做好准备。",
  },
  actions: {
    apiDocs: "API 文档",
    viewProject: "查看项目",
    live: "线上访问",
    code: "源码",
    startProject: "开始项目",
    browseProjects: "浏览项目",
  },
  common: {
    featured: "精选",
    published: "已发布",
    draft: "草稿",
    lastUpdated: "最后更新",
    status: "状态",
    displayOrder: "显示顺序",
    technologies: "技术",
    noTechnologies: "暂无技术标签",
  },
};
