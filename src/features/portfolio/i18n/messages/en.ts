import type { PortfolioDictionary } from "../types";

export const dictionary: PortfolioDictionary = {
  meta: {
    siteName: "Claudiu Stefan",
    defaultTitle: "Claudiu Stefan",
    description:
      "Frontend engineer building fast, scalable, and product-focused interfaces with React, Next.js, Angular, and TypeScript.",
    homeTitle: "Frontend Engineer",
    homeDescription:
      "Portfolio for Claudiu Stefan, a frontend engineer focused on production-ready interfaces, scalable architecture, and product clarity.",
    projectUnavailableTitle: "Project unavailable",
    projectUnavailableDescription:
      "The backend could not return the content for this project.",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The requested route does not exist in this portfolio application.",
  },
  localeNames: {
    en: "English",
    ro: "Română",
  },
  header: {
    brand: "Claudiu Stefan",
    avatarInitials: "CCS",
    tagline: "Frontend Engineer",
    navHome: "Home",
    navAbout: "About",
    navOverview: "Overview",
    navWork: "Projects",
    navProcess: "How I work",
    navSkills: "Skills",
    languageLabel: "Language",
    themeLabel: "Theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    description:
      "Frontend engineer focused on clear product UI, scalable React architecture, and production-ready delivery.",
    quickLinksLabel: "Quick links",
    copyrightLabel: "All rights reserved.",
  },
  home: {
    title:
      "Fast, scalable product interfaces that are clear to use and built to last.",
    description:
      "I build production-ready interfaces with React, Next.js, Angular, and TypeScript, combining strong frontend architecture with clear UX and product judgment.",
    primaryCta: "View projects",
    secondaryCta: "Get in touch",
    metrics: {
      technologies: "Core stack",
    },
    metricCards: [
      {
        label: "Published work",
        value: "4 live",
        detail: "Marketing sites, product apps, and workflow-heavy interfaces.",
      },
      {
        label: "Frontend stack",
        value: "React + Angular",
        detail: "TypeScript-first UI architecture with reusable components.",
      },
      {
        label: "Delivery focus",
        value: "Fast UX",
        detail: "Performance, responsive states, and clear user flows.",
      },
      {
        label: "Working style",
        value: "Product focus",
        detail:
          "Reliable delivery, maintainable code, and business-aware decisions.",
      },
    ],
    profileSnapshotLabel: "Quick profile",
    profileSnapshotTitle: "Built to ship real products",
    profileSnapshotBadge: "Open to collaborations",
    profileSummaryLabel: "Why teams hire me",
    profileSummary:
      "I bring more than implementation speed. I turn product requirements into interfaces that are clear, maintainable, and ready for production.",
    profilePanels: [
      {
        label: "Experience",
        value: "5+ years",
      },
      {
        label: "Primary focus",
        value: "React · Next.js · Angular",
      },
    ],
    skillHighlights: [
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "React Query",
      "Redux Toolkit",
      "Styled Components",
      "Material UI",
      "REST",
      "GraphQL",
      "Storybook",
      "Sentry",
    ],
    showcaseLabel: "Projects",
    showcaseCountLabel: "published projects",
    showcaseTitle:
      "Selected frontend projects across product sites and application interfaces.",
    showcaseDescription:
      "Each project shows how I approach product problems, frontend architecture, UX quality, and integration with real backend systems.",
    featuredTab: "Featured",
    allTab: "All projects",
    emptyTitle: "No published projects yet.",
    emptyDescription:
      "Publish a project in the admin area and it will appear here automatically.",
    capabilitiesLabel: "About",
    capabilitiesTitle:
      "I work at the point where frontend engineering meets product clarity.",
    capabilitiesDescription:
      "The value I bring is technical depth, clean execution, and the judgment to make interfaces easier to use and easier to evolve.",
    capabilities: [
      {
        title: "Production-ready frontend",
        description:
          "I build scalable component systems, responsive layouts, and maintainable application code that can support real product growth.",
      },
      {
        title: "Product thinking",
        description:
          "I shape flows, hierarchy, and interaction details around what users need to do, not just around what the screen needs to show.",
      },
      {
        title: "Systems and integration",
        description:
          "I work comfortably across state, async data, forms, analytics, localization, and backend contracts without losing UI quality.",
      },
    ],
    processLabel: "How I work",
    processTitle:
      "Reliable delivery comes from clear structure, strong tradeoffs, and attention to detail.",
    processDescription:
      "I keep the frontend practical: understandable for teams, scalable for future work, and polished enough to earn user trust.",
    processStepLabel: "Step",
    processCards: [
      {
        title: "Structure first",
        description:
          "I set clean component boundaries, predictable state, and reusable patterns before complexity starts to spread.",
      },
      {
        title: "User clarity",
        description:
          "I prioritize loading states, hierarchy, and friction-free interactions so the interface stays easy to use under real conditions.",
      },
      {
        title: "Ship with intent",
        description:
          "I balance speed with maintainability, working closely with design and product while keeping implementation grounded in reality.",
      },
    ],
    experienceLabel: "",
    experienceTitle: "",
    experienceDescription: "",
    experienceCards: [],
    credentialsLabel: "Skills",
    credentialsTitle: "The stack I use most, and the way I apply it.",
    credentialsDescription:
      "Focused on the tools and working habits most relevant to teams hiring a strong frontend engineer.",
    credentialGroups: [
      {
        title: "Frontend stack",
        items: [
          "React, Next.js, Angular, TypeScript, Styled Components, and Material UI.",
          "Component-driven UI built for clarity, reuse, and long-term maintainability.",
        ],
      },
      {
        title: "Application layer",
        items: [
          "React Query, Redux Toolkit, routing, forms, REST, GraphQL, and localization.",
          "Interfaces connected to real backend contracts, async flows, and state-heavy user journeys.",
        ],
      },
      {
        title: "Quality and collaboration",
        items: [
          "Figma handoff, performance-minded implementation, validation, analytics, Storybook, and Sentry.",
          "A working style built around clean communication, consistent UI quality, and dependable delivery.",
        ],
      },
    ],
    inquiryLabel: "Contact",
    inquiryTitle:
      "Need a frontend engineer who can turn requirements into polished product UI?",
    inquiryDescription:
      "I’m open to frontend roles, product engineering work, and contract projects where performance, clarity, and reliable delivery matter.",
    inquiryHighlights: [
      {
        title: "Contact",
        description: "cc.stefan@icloud.com",
        href: "mailto:cc.stefan@icloud.com",
      },
      {
        title: "Best fit",
        description:
          "Teams that value strong UI execution, product thinking, and clear collaboration with design and backend.",
      },
    ],
  },
  project: {
    backToHome: "Back to portfolio",
    label: "Project page",
    summaryTitle: "What I built",
    overviewTitle: "Overview",
    descriptionTitle: "Description",
    factsTitle: "Project facts",
    stackTitle: "Stack",
    linksTitle: "Links",
    liveTitle: "Live",
    repositoryTitle: "Repository",
    timelineTitle: "Timeline",
    projectDateTitle: "Project date",
    deliveryTitle: "Why it works",
    deliveryCards: [
      {
        title: "Built around real user flows",
        description:
          "The interface was shaped around what users needed to do, not just what the screen needed to display.",
      },
      {
        title: "Structured for change",
        description:
          "Components, state, and integrations were organized so the product could grow without turning fragile.",
      },
    ],
    relatedLabel: "Related projects",
    relatedTitle: "Other projects",
    relatedDescription:
      "More frontend projects across marketing surfaces, product interfaces, and API-driven delivery.",
    unavailableTitle: "This project is unavailable right now.",
    unavailableDescription:
      "The backend did not return the content needed to render this project.",
    unavailableHint:
      "Start portfolio-app-be on port 3001 or update PORTFOLIO_API_BASE_URL in the frontend environment.",
    notFoundTitle: "This route does not match a published project.",
    notFoundDescription:
      "The slug may be wrong, the project may still be a draft, or the backend has no matching entry.",
    noDescription: "No description provided",
    noProjectDate: "Project date not added yet",
    noProjectImage: "Project image coming soon",
  },
  admin: {
    brand: "Portfolio Admin",
    openMenu: "Open admin menu",
    navDashboard: "Dashboard",
    navProjects: "Projects",
    navInquiries: "Inquiries",
    unreadInquiries: "Unread inquiries",
    viewSite: "View site",
    signOut: "Sign out",
    backToPortfolio: "Back to portfolio",
    loginLabel: "Admin access",
    loginTitle: "Sign in",
    loginDescription: "Sign in to manage projects and inquiries.",
    emailLabel: "Email",
    emailPlaceholder: "admin@company.com",
    emailValidation: "Enter a valid email address.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    passwordValidation: "Enter your password.",
    signIn: "Sign in",
    signingIn: "Signing in...",
    unableToSignIn: "Unable to sign in",
    accessDeniedEyebrow: "Admin",
    accessDeniedTitle: "Access denied",
    accessDeniedDescription:
      "This account does not have permission to use the admin area.",
    signInWithAnotherAccount: "Sign in with another account",
    retry: "Try again",
    dashboardLabel: "Operations overview",
    dashboardTitle: "Portfolio operations",
    dashboardDescription:
      "Monitor publishing status, incoming inquiries, and access metrics from one operational view.",
    dashboardLoadErrorTitle: "Dashboard unavailable",
    dashboardLoadErrorDescription:
      "The operational data could not be loaded at the moment.",
    statTotalProjects: "Total projects",
    statPublishedProjects: "Published",
    statDraftProjects: "Drafts",
    statFeaturedProjects: "Featured",
    statProjectsWithImages: "With images",
    statTotalUsers: "Total users",
    statAdminUsers: "Admins",
    statRegularUsers: "Users",
    statTotalInquiries: "Total inquiries",
    statUnreadInquiries: "Unread inquiries",
    statInReviewInquiries: "In review",
    statResolvedInquiries: "Resolved inquiries",
    recentProjectsTitle: "Recent projects",
    recentProjectsDescription:
      "Recently updated projects that may need review before publication.",
    recentProjectsEmptyTitle: "No projects yet",
    recentProjectsEmptyDescription:
      "Projects will appear here after the first entries are created.",
    recentInquiriesTitle: "Recent inquiries",
    recentInquiriesDescription:
      "Latest inbound messages that may require review or follow-up.",
    recentInquiriesEmptyTitle: "No inquiries yet",
    recentInquiriesEmptyDescription:
      "New contact submissions will appear here once the site starts receiving inquiries.",
    published: "Published",
    draft: "Draft",
    featured: "Featured",
    updated: "Updated",
    unread: "Unread",
    read: "Read",
    hasNotes: "Has notes",
    received: "Received",
    inquiryStatusNew: "New",
    inquiryStatusInReview: "In review",
    inquiryStatusResolved: "Resolved",
    inquiryStatusArchived: "Archived",
  },
  inquiryForm: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    nameValidation: "Enter at least 2 characters.",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    emailValidation: "Enter a valid email address.",
    companyLabel: "",
    companyPlaceholder: "",
    budgetLabel: "",
    budgetPlaceholder: "",
    scopeLabel: "",
    scopePlaceholder: "",
    messageLabel: "Message",
    messagePlaceholder:
      "Tell me what you’re building, what you need help with, and any constraints that matter.",
    messageValidation: "Add more context so the request is useful.",
    submit: "Send message",
    submitting: "Sending...",
    successTitle: "Message sent",
    successDescription:
      "Your message was received. I’ll review it and get back to you soon.",
    errorTitle: "Unable to send message",
    errorDescription: "Check the form fields or try again in a moment.",
    privacyNote:
      "Your message will only be used to review your inquiry and reply directly.",
  },
  actions: {
    adminLogin: "Admin",
    viewProject: "View project",
    live: "Live",
    code: "Code",
    startProject: "Contact",
    browseProjects: "Browse projects",
  },
  common: {
    featured: "Featured",
    lastUpdated: "Last updated",
    technologies: "Technologies",
    noTechnologies: "No technologies listed yet",
  },
};
