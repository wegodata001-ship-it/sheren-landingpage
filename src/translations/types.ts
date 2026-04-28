export type ServiceMessage = {
  title: string;
  description: string;
  points: string[];
};

export type ProcessMessage = {
  title: string;
  description: string;
};

export type NavItemMessage = {
  id: string;
  href: string;
  label: string;
};

export type StatMessage = {
  value: string;
  label: string;
};

/** Single-language messages tree — must match exactly between `he.ts` and `ar.ts`. */
export type Messages = {
  promoBar: {
    text: string;
    linkLabel: string;
    href: string;
  };
  navigation: NavItemMessage[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    mediaBadge: string;
    mediaNoteLine: string;
    mediaNoteLead: string;
    stats: StatMessage[];
  };
  about: {
    kicker: string;
    title: string;
    description: string;
    secondaryDescription: string;
    highlights: string[];
    quote: string;
    mediaLabel: string;
    infoTileTitle: string;
    infoTileText: string;
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ServiceMessage[];
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ProcessMessage[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    formTitle: string;
    formDescription: string;
    whatsappTitle: string;
    whatsappDescription: string;
    responseNote: string;
    labels: {
      name: string;
      email: string;
      phone: string;
      message: string;
      submit: string;
      submitting: string;
    };
    placeholders: {
      name: string;
      email: string;
      phone: string;
      message: string;
    };
    infoTitle: string;
    api: {
      validation: string;
      success: string;
      server: string;
      network: string;
    };
  };
  quote: {
    text: string;
    subtext: string;
  };
  footer: {
    text: string;
    rights: string;
    bottomTagline: string;
    socialTiktok: string;
    socialLinkedin: string;
  };
  seo: {
    pageTitle: string;
    pageDescription: string;
    keywords: string[];
    openGraphTitle: string;
    openGraphDescription: string;
  };
  serviceCard: {
    badgePrefix: string;
  };
  social: {
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
  accessibility: {
    panelTitle: string;
    panelAria: string;
    close: string;
    closeAria: string;
    openPanelAria: string;
    triggerLabel: string;
    reset: string;
    largeText: string;
    highContrast: string;
    underlineLinks: string;
    grayscale: string;
    reduceMotion: string;
  };
  siteLoader: {
    loading: string;
  };
  navbar: {
    skipToHeroAria: string;
    menuToggleAria: string;
    languageSwitcherAria: string;
  };
  /** Native labels for the language switcher (same in both locale files). */
  languages: {
    nativeHebrew: string;
    nativeArabic: string;
  };
};
