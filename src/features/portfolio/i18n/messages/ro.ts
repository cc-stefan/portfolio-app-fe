import type { PortfolioDictionary } from "../types";

export const dictionary: PortfolioDictionary = {
  meta: {
    siteName: "Portofoliu",
    defaultTitle: "Portofoliu",
    description:
      "Un frontend premium de portofoliu construit peste continut live din backend, layout-uri responsive si o interfata la nivel de produs.",
    homeTitle: "Proiecte selectate",
    homeDescription:
      "O experienta de portofoliu curata, alimentata de un API live de proiecte si construita cu un design system modern.",
    projectUnavailableTitle: "Proiect indisponibil",
    projectUnavailableDescription:
      "Backend-ul portofoliului nu a putut returna acest proiect.",
    notFoundTitle: "Pagina nu a fost gasita",
    notFoundDescription:
      "Ruta ceruta nu exista in aceasta aplicatie de portofoliu.",
  },
  localeNames: {
    en: "English",
    ro: "Romana",
    zh: "中文",
  },
  header: {
    brand: "Portofoliu",
    tagline: "Inginer de produs",
    navOverview: "Prezentare",
    navWork: "Proiecte",
    navProcess: "Proces",
    navContact: "Contact",
    languageLabel: "Limba",
    themeLabel: "Tema",
    openMenu: "Deschide meniul",
    closeMenu: "Inchide meniul",
  },
  home: {
    eyebrow: "Sistem frontend modern",
    title: "Un portofoliu premium reconstruit ca o experienta de produs high-end.",
    description:
      "Proiectele publicate sunt preluate din portfolio-app-be si prezentate printr-un sistem narativ mai clar: ierarhie mai buna, stari mai solide, scanare mai rapida si motion mai atent dozat.",
    availability:
      "Disponibil pentru product engineering, design systems, arhitectura frontend si UX orientat spre platforma.",
    primaryCta: "Vezi proiectele",
    secondaryCta: "Porneste o discutie",
    metrics: {
      projects: "Proiecte publicate",
      featured: "Proiecte evidentiata",
      technologies: "Tehnologii de baza",
      status: "Status backend",
    },
    statusOnline: "Activ",
    statusOffline: "Offline",
    statusUnavailable: "Indisponibil",
    showcaseLabel: "Proiecte",
    showcaseTitle: "Studii de caz alimentate din backend, prezentate ca un produs matur.",
    showcaseDescription:
      "Grid-ul se citeste ca un catalog SaaS bine finisat, dar fiecare intrare vine din acelasi contract live al backend-ului.",
    featuredTab: "Evidentiate",
    allTab: "Toate proiectele",
    emptyTitle: "Momentan nu exista proiecte publicate.",
    emptyDescription:
      "Creeaza sau publica un proiect in zona de administrare din backend si va aparea automat aici.",
    capabilitiesLabel: "Capabilitati",
    capabilitiesTitle: "Interfata explica aria de livrare inainte sa ceara atentie.",
    capabilitiesDescription:
      "Stack-ul este tradus in capabilitati orientate spre produs, astfel incat profunzimea tehnica sa fie clara pentru ingineri si leadership.",
    capabilities: [
      {
        title: "Arhitectura frontend",
        description:
          "Structuri App Router scalabile, granite clare intre server si client si strategii de randare stabile.",
      },
      {
        title: "Design systems",
        description:
          "UI bazat pe tokeni, contracte reutilizabile, comportamente responsive si pattern-uri accesibile consistente.",
      },
      {
        title: "Integrare backend",
        description:
          "Interfete conduse de API care raman aliniate la contracte reale, reguli de validare si stari operationale.",
      },
    ],
    processLabel: "Proces",
    processTitle: "Construit cu aceleasi standarde asteptate intr-o echipa SaaS serioasa.",
    processDescription:
      "Redesign-ul prioritizeaza mentenabilitatea, acoperirea starilor si calitatea interactiunilor, nu doar o prezentare statica.",
    processCards: [
      {
        title: "Randare server-first",
        description:
          "Paginile critice preiau date live pe server pentru continut rapid, usor de gasit si stabil.",
      },
      {
        title: "Contract UI reutilizabil",
        description:
          "Butoanele, suprafetele, starile si formularele impart acelasi limbaj vizual, fara styling separat pe fiecare pagina.",
      },
      {
        title: "UX constient de stari",
        description:
          "Loading, empty, offline si success sunt tratate intentionat, nu ca exceptii tarzii.",
      },
    ],
    inquiryLabel: "Cerere",
    inquiryTitle: "O metoda directa si structurata de a incepe urmatorul proiect.",
    inquiryDescription:
      "Formularul foloseste validare tipata, stari accesibile ale campurilor si feedback imediat, fiind pregatit pentru integrare cu un pipeline real.",
  },
  project: {
    backToHome: "Inapoi acasa",
    label: "Studiu de caz",
    summaryTitle: "Rezumat proiect",
    overviewTitle: "Prezentare",
    overviewDescription:
      "Pagina de detaliu ramane curata si usor de scanat, dar expune continutul real gestionat din backend.",
    factsTitle: "Detalii proiect",
    stackTitle: "Stack tehnologic",
    linksTitle: "Link-uri proiect",
    deliveryTitle: "Note de livrare",
    deliveryCards: [
      {
        title: "Ruta alimentata de API",
        description:
          "Aceasta pagina este randata din endpoint-ul bazat pe slug, nu din continut duplicat doar in frontend.",
      },
      {
        title: "Stari rezistente",
        description:
          "Proiectele indisponibile, datele lipsa si continutul partial sunt tratate explicit prin fallback-uri clare.",
      },
    ],
    relatedTitle: "Mai multe proiecte",
    relatedDescription:
      "Alte proiecte publicate din acelasi feed backend, pastrate coerent prin acelasi sistem UI.",
    unavailableTitle: "Acest proiect nu a putut fi incarcat din backend.",
    unavailableDescription:
      "Endpoint-ul proiectului nu a returnat datele necesare pentru acest studiu de caz.",
    unavailableHint:
      "Porneste portfolio-app-be pe portul 3001 sau actualizeaza PORTFOLIO_API_BASE_URL in mediul frontend.",
    notFoundTitle: "Aceasta ruta nu corespunde unui proiect publicat.",
    notFoundDescription:
      "Slug-ul poate fi gresit, proiectul poate fi inca draft sau backend-ul nu are o intrare potrivita.",
  },
  inquiryForm: {
    nameLabel: "Nume",
    namePlaceholder: "Numele tau",
    emailLabel: "Email",
    emailPlaceholder: "tu@companie.com",
    companyLabel: "",
    companyPlaceholder: "",
    budgetLabel: "",
    budgetPlaceholder: "",
    scopeLabel: "",
    scopePlaceholder: "",
    messageLabel: "Mesaj",
    messagePlaceholder:
      "Descrie de ce ai nevoie si ofera suficient context ca mesajul sa fie util.",
    submit: "Trimite cererea",
    submitting: "Se trimite...",
    successTitle: "Cerere trimisa",
    successDescription:
      "Solicitarea a fost validata si acceptata de endpoint-ul de intake din backend.",
    errorTitle: "Cererea nu a putut fi trimisa",
    errorDescription:
      "Verifica campurile formularului sau incearca din nou in cateva momente.",
    privacyNote:
      "Formularul valideaza in client si trimite prin ruta frontend catre endpoint-ul backend pentru cereri.",
  },
  actions: {
    apiDocs: "Documentatie API",
    adminLogin: "Autentificare admin",
    viewProject: "Vezi proiectul",
    live: "Live",
    code: "Cod",
    startProject: "Porneste un proiect",
    browseProjects: "Vezi proiectele",
  },
  common: {
    featured: "Evidentiat",
    published: "Publicat",
    draft: "Draft",
    lastUpdated: "Ultima actualizare",
    status: "Status",
    displayOrder: "Ordine afisare",
    technologies: "Tehnologii",
    noTechnologies: "Fara tehnologii listate",
  },
};
