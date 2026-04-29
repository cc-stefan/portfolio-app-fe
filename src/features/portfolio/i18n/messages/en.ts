import type { PortfolioDictionary } from "../types";

export const dictionary: PortfolioDictionary = {
  meta: {
    siteName: "Portfolio",
    defaultTitle: "Portfolio",
    description:
      "A premium portfolio frontend built on live backend content, responsive layouts, and a polished product-grade interface.",
    homeTitle: "Selected work",
    homeDescription:
      "A clean portfolio experience powered by a live project API, built with a modern, SaaS-grade design system.",
    projectUnavailableTitle: "Project unavailable",
    projectUnavailableDescription:
      "The portfolio backend could not return this project.",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The requested route does not exist in this portfolio application.",
  },
  localeNames: {
    en: "English",
    ro: "Romana",
    zh: "中文",
  },
  header: {
    brand: "Portfolio",
    tagline: "Product engineer",
    navOverview: "Overview",
    navWork: "Work",
    navProcess: "Process",
    navContact: "Contact",
    languageLabel: "Language",
    themeLabel: "Theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  home: {
    eyebrow: "Modern frontend system",
    title: "A premium portfolio rebuilt like a high-end product experience.",
    description:
      "Published projects are fetched from portfolio-app-be and presented through a cleaner narrative system: sharper hierarchy, stronger states, faster scanning, and more deliberate motion.",
    availability:
      "Available for product engineering, design systems, frontend architecture, and platform-facing UX work.",
    primaryCta: "Browse projects",
    secondaryCta: "Start a conversation",
    metrics: {
      projects: "Published projects",
      featured: "Featured work",
      technologies: "Core technologies",
      status: "Backend status",
    },
    statusOnline: "Live",
    statusOffline: "Offline",
    statusUnavailable: "Unavailable",
    showcaseLabel: "Project index",
    showcaseTitle: "Backend-powered case studies with a product-grade presentation layer.",
    showcaseDescription:
      "The grid reads like a polished SaaS catalog, but every entry is still sourced from the live backend contract.",
    featuredTab: "Featured",
    allTab: "All projects",
    emptyTitle: "No published projects are available yet.",
    emptyDescription:
      "Create or publish a project in the backend admin area and it will appear here automatically.",
    capabilitiesLabel: "Capabilities",
    capabilitiesTitle: "The interface explains delivery range before it asks for attention.",
    capabilitiesDescription:
      "The stack is translated into product-facing capabilities so technical depth reads clearly for both engineering and leadership audiences.",
    capabilities: [
      {
        title: "Frontend architecture",
        description:
          "Scalable App Router structures, clear server and client boundaries, and reliable rendering strategies.",
      },
      {
        title: "Design systems",
        description:
          "Token-based UI, reusable component contracts, responsive behaviors, and consistent accessibility patterns.",
      },
      {
        title: "Backend integration",
        description:
          "API-driven interfaces that stay aligned with real contracts, validation rules, and operational states.",
      },
    ],
    processLabel: "Process",
    processTitle: "Built with the same standards expected from a SaaS product team.",
    processDescription:
      "The redesign prioritizes maintainability, state coverage, and quality of interaction instead of treating the portfolio as static marketing chrome.",
    processCards: [
      {
        title: "Server-first rendering",
        description:
          "Critical pages fetch live data on the server so content stays fast, indexable, and stable.",
      },
      {
        title: "Reusable UI contract",
        description:
          "Buttons, surfaces, states, and forms share a single design language instead of page-specific styling.",
      },
      {
        title: "State-aware UX",
        description:
          "Loading, empty, offline, and success feedback are designed intentionally instead of handled as edge cases.",
      },
    ],
    inquiryLabel: "Inquiry",
    inquiryTitle: "A direct, structured way to start the next project conversation.",
    inquiryDescription:
      "The form uses typed validation, accessible field states, and immediate feedback, making it production-ready to connect to a real lead pipeline.",
  },
  project: {
    backToHome: "Back to home",
    label: "Case study",
    summaryTitle: "Project summary",
    overviewTitle: "Overview",
    overviewDescription:
      "The detail view stays clean and scannable while exposing the actual backend-managed project content.",
    factsTitle: "Project facts",
    stackTitle: "Technology stack",
    linksTitle: "Project links",
    deliveryTitle: "Delivery notes",
    deliveryCards: [
      {
        title: "API-driven route",
        description:
          "This page is rendered from the project slug endpoint instead of duplicated frontend-only content.",
      },
      {
        title: "Resilient states",
        description:
          "Unavailable projects, missing data, and partial content are surfaced with explicit fallback handling.",
      },
    ],
    relatedTitle: "More work",
    relatedDescription:
      "Additional published projects from the same backend feed, kept consistent by the same UI system.",
    unavailableTitle: "This project could not be loaded from the backend.",
    unavailableDescription:
      "The project endpoint did not return the data needed to render this case study.",
    unavailableHint:
      "Start portfolio-app-be on port 3001 or update PORTFOLIO_API_BASE_URL in the frontend environment.",
    notFoundTitle: "That route does not map to a published project.",
    notFoundDescription:
      "The slug may be wrong, the project may still be a draft, or the backend has no matching entry.",
  },
  inquiryForm: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    companyLabel: "Company",
    companyPlaceholder: "Company or team",
    budgetLabel: "Budget",
    budgetPlaceholder: "Approximate scope or budget",
    scopeLabel: "Project scope",
    scopePlaceholder: "What are you building or improving?",
    messageLabel: "Context",
    messagePlaceholder:
      "Share the current product stage, timeline, and where you need help.",
    submit: "Send inquiry",
    submitting: "Sending...",
    successTitle: "Inquiry submitted",
    successDescription:
      "The request was validated and accepted by the frontend intake route.",
    errorTitle: "Unable to submit inquiry",
    errorDescription:
      "Please review the form fields or try again in a moment.",
    privacyNote:
      "This example flow validates and submits through a local Next.js route, ready to connect to a real backend pipeline.",
  },
  actions: {
    apiDocs: "API docs",
    viewProject: "View project",
    live: "Live",
    code: "Code",
    startProject: "Start a project",
    browseProjects: "Browse projects",
  },
  common: {
    featured: "Featured",
    published: "Published",
    draft: "Draft",
    lastUpdated: "Last updated",
    status: "Status",
    displayOrder: "Display order",
    technologies: "Technologies",
    noTechnologies: "No technologies listed",
  },
};
