export interface PortfolioDictionary {
  meta: {
    siteName: string;
    defaultTitle: string;
    description: string;
    homeTitle: string;
    homeDescription: string;
    projectUnavailableTitle: string;
    projectUnavailableDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
  localeNames: {
    en: string;
    ro: string;
    zh: string;
  };
  header: {
    brand: string;
    tagline: string;
    navOverview: string;
    navWork: string;
    navProcess: string;
    navContact: string;
    languageLabel: string;
    themeLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    availability: string;
    primaryCta: string;
    secondaryCta: string;
    metrics: {
      projects: string;
      featured: string;
      technologies: string;
      status: string;
    };
    statusOnline: string;
    statusOffline: string;
    statusUnavailable: string;
    showcaseLabel: string;
    showcaseTitle: string;
    showcaseDescription: string;
    featuredTab: string;
    allTab: string;
    emptyTitle: string;
    emptyDescription: string;
    capabilitiesLabel: string;
    capabilitiesTitle: string;
    capabilitiesDescription: string;
    capabilities: Array<{
      title: string;
      description: string;
    }>;
    processLabel: string;
    processTitle: string;
    processDescription: string;
    processCards: Array<{
      title: string;
      description: string;
    }>;
    inquiryLabel: string;
    inquiryTitle: string;
    inquiryDescription: string;
  };
  project: {
    backToHome: string;
    label: string;
    summaryTitle: string;
    overviewTitle: string;
    overviewDescription: string;
    factsTitle: string;
    stackTitle: string;
    linksTitle: string;
    deliveryTitle: string;
    deliveryCards: Array<{
      title: string;
      description: string;
    }>;
    relatedTitle: string;
    relatedDescription: string;
    unavailableTitle: string;
    unavailableDescription: string;
    unavailableHint: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
  inquiryForm: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    scopeLabel: string;
    scopePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successDescription: string;
    errorTitle: string;
    errorDescription: string;
    privacyNote: string;
  };
  actions: {
    apiDocs: string;
    adminLogin: string;
    viewProject: string;
    live: string;
    code: string;
    startProject: string;
    browseProjects: string;
  };
  common: {
    featured: string;
    published: string;
    draft: string;
    lastUpdated: string;
    status: string;
    displayOrder: string;
    technologies: string;
    noTechnologies: string;
  };
}
