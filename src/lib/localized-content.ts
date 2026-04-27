import { buildLocalizedSiteContentFromFiles } from "@/lib/i18n/build-localized-site-content";

export type SupportedLanguage = "he" | "ar";

export type LocalizedText = Record<SupportedLanguage, string>;

export type LocalizedArrayText = Record<SupportedLanguage, string[]>;

export type LocalizedStat = {
  value: LocalizedText;
  label: LocalizedText;
};

export type LocalizedServiceItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  points: LocalizedArrayText;
};

export type LocalizedProcessItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type LocalizedNavigationItem = {
  id: string;
  href: string;
  label: LocalizedText;
};

export type LocalizedSiteContent = {
  promoBar: {
    text: LocalizedText;
    linkLabel: LocalizedText;
    href: string;
  };
  navigation: LocalizedNavigationItem[];
  hero: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    subtitle: LocalizedText;
    primaryButtonText: LocalizedText;
    secondaryButtonText: LocalizedText;
    mediaBadge: LocalizedText;
    mediaNoteLine: LocalizedText;
    mediaNoteLead: LocalizedText;
    stats: LocalizedStat[];
  };
  about: {
    kicker: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    secondaryDescription: LocalizedText;
    highlights: LocalizedArrayText;
    quote: LocalizedText;
    mediaLabel: LocalizedText;
    infoTileTitle: LocalizedText;
    infoTileText: LocalizedText;
  };
  services: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    items: LocalizedServiceItem[];
  };
  process: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    items: LocalizedProcessItem[];
  };
  projectsSection: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    helper: LocalizedText;
    ctaLabel: LocalizedText;
    previousLabel: LocalizedText;
    nextLabel: LocalizedText;
    viewProject: LocalizedText;
    modalCloseAria: LocalizedText;
    modalDetailsLabel: LocalizedText;
    modalGalleryAria: LocalizedText;
    modalWhatsappCta: LocalizedText;
    modalLocation: LocalizedText;
    modalYear: LocalizedText;
    modalStyle: LocalizedText;
  };
  cta: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    primaryButtonText: LocalizedText;
    secondaryButtonText: LocalizedText;
  };
  contact: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    formTitle: LocalizedText;
    formDescription: LocalizedText;
    whatsappTitle: LocalizedText;
    whatsappDescription: LocalizedText;
    responseNote: LocalizedText;
    labels: {
      name: LocalizedText;
      email: LocalizedText;
      phone: LocalizedText;
      message: LocalizedText;
      submit: LocalizedText;
      submitting: LocalizedText;
    };
    placeholders: {
      name: LocalizedText;
      email: LocalizedText;
      phone: LocalizedText;
      message: LocalizedText;
    };
    infoTitle: LocalizedText;
    api: {
      validation: LocalizedText;
      success: LocalizedText;
      server: LocalizedText;
      network: LocalizedText;
    };
  };
  quote: {
    text: LocalizedText;
    subtext: LocalizedText;
  };
  footer: {
    text: LocalizedText;
    rights: LocalizedText;
    bottomTagline: LocalizedText;
    socialTiktok: LocalizedText;
    socialLinkedin: LocalizedText;
  };
  seo: {
    pageTitle: LocalizedText;
    pageDescription: LocalizedText;
    keywords: Record<SupportedLanguage, string[]>;
    openGraphTitle: LocalizedText;
    openGraphDescription: LocalizedText;
  };
  serviceCard: {
    badgePrefix: LocalizedText;
  };
  social: {
    whatsapp: LocalizedText;
    instagram: LocalizedText;
    facebook: LocalizedText;
  };
  accessibility: {
    panelTitle: LocalizedText;
    panelAria: LocalizedText;
    close: LocalizedText;
    closeAria: LocalizedText;
    openPanelAria: LocalizedText;
    triggerLabel: LocalizedText;
    reset: LocalizedText;
    largeText: LocalizedText;
    highContrast: LocalizedText;
    underlineLinks: LocalizedText;
    grayscale: LocalizedText;
    reduceMotion: LocalizedText;
  };
  siteLoader: {
    loading: LocalizedText;
  };
  navbar: {
    skipToHeroAria: LocalizedText;
    menuToggleAria: LocalizedText;
    languageSwitcherAria: LocalizedText;
  };
  languages: {
    nativeHebrew: LocalizedText;
    nativeArabic: LocalizedText;
  };
  portfolioItems: Array<{
    title: LocalizedText;
    category: LocalizedText;
  }>;
};

export const defaultLocalizedContent: LocalizedSiteContent = buildLocalizedSiteContentFromFiles();

export type LocalizedSectionKey =
  | "hero"
  | "about"
  | "services"
  | "process"
  | "projectsSection"
  | "cta"
  | "contact"
  | "quote"
  | "footer"
  | "seo";

export const contentSectionOrder: Array<{
  key: LocalizedSectionKey;
  label: string;
}> = [
  { key: "hero", label: "בית" },
  { key: "about", label: "אודות" },
  { key: "services", label: "שירותים" },
  { key: "process", label: "תהליך עבודה" },
  { key: "projectsSection", label: "פרויקטים" },
  { key: "cta", label: "קריאה לפעולה" },
  { key: "contact", label: "צור קשר" },
  { key: "quote", label: "ציטוט" },
  { key: "footer", label: "פוטר" },
  { key: "seo", label: "SEO" },
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, overrideValue: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(overrideValue) ? overrideValue : base) as T;
  }

  if (!isObject(base)) {
    if (
      typeof base === "string" &&
      typeof overrideValue === "string" &&
      overrideValue.trim() === "" &&
      base.trim() !== ""
    ) {
      return base as T;
    }

    return (overrideValue ?? base) as T;
  }

  const merged: Record<string, unknown> = { ...base };
  const overrideObject = isObject(overrideValue) ? overrideValue : {};

  Object.keys(base).forEach((key) => {
    merged[key] = mergeDeep((base as Record<string, unknown>)[key], overrideObject[key]);
  });

  return merged as T;
}

function normalizeMaybeLocalizedText(value: unknown): LocalizedText {
  if (value && typeof value === "object" && "he" in value && "ar" in value) {
    const v = value as LocalizedText;
    return { he: String(v.he ?? ""), ar: String(v.ar ?? "") };
  }

  if (typeof value === "string") {
    return { he: value, ar: value };
  }

  return { he: "", ar: "" };
}

function normalizeLocalizedSiteContent(content: LocalizedSiteContent): LocalizedSiteContent {
  return {
    ...content,
    hero: {
      ...content.hero,
      stats: content.hero.stats.map((stat) => {
        const raw = stat as unknown as { value: unknown; label: unknown };
        return {
          value: normalizeMaybeLocalizedText(raw.value),
          label: normalizeMaybeLocalizedText(raw.label),
        };
      }),
    },
  };
}

export function getMergedLocalizedContent(storedContent?: unknown): LocalizedSiteContent {
  const merged = mergeDeep(defaultLocalizedContent, storedContent);
  return normalizeLocalizedSiteContent(merged);
}

export function getLocalizedText(
  value: LocalizedText | undefined,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage,
) {
  if (!value) {
    return "";
  }

  const primary = (value[language] || "").trim();
  if (primary) {
    return primary;
  }

  const fallback = (value[fallbackLanguage] || "").trim();
  if (fallback && language !== fallbackLanguage) {
    console.warn(`[i18n] Missing "${language}" translation; falling back to "${fallbackLanguage}".`);
  }

  return fallback || "";
}

export function getLocalizedArray(
  value: LocalizedArrayText,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage,
) {
  const primary = value[language];
  if (primary?.length) {
    return primary;
  }

  const fallback = value[fallbackLanguage] || [];
  if (fallback.length && language !== fallbackLanguage) {
    console.warn(`[i18n] Missing "${language}" translation for string array; falling back to "${fallbackLanguage}".`);
  }

  return fallback;
}
