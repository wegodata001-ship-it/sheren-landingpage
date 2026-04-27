import { unstable_noStore as noStore } from "next/cache";

import { siteConfig } from "@/data/siteConfig";
import {
  getLocalizedArray,
  getLocalizedText,
  getMergedLocalizedContent,
  type LocalizedSiteContent,
  type SupportedLanguage,
} from "@/lib/localized-content";

import { prisma } from "./prisma";

export type LocalizedPublicContent = {
  promoBar: {
    text: string;
    linkLabel: string;
    href: string;
  };
  navigation: Array<{
    id: string;
    href: string;
    label: string;
  }>;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    mediaBadge: string;
    mediaNoteLine: string;
    mediaNoteLead: string;
    stats: Array<{ value: string; label: string }>;
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
    items: Array<{
      id: string;
      title: string;
      description: string;
      points: string[];
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  projectsSection: {
    eyebrow: string;
    title: string;
    intro: string;
    helper: string;
    ctaLabel: string;
    previousLabel: string;
    nextLabel: string;
    viewProject: string;
    modalCloseAria: string;
    modalDetailsLabel: string;
    modalGalleryAria: string;
    modalWhatsappCta: string;
    modalLocation: string;
    modalYear: string;
    modalStyle: string;
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
  languages: {
    nativeHebrew: string;
    nativeArabic: string;
  };
  portfolioItems: Array<{
    title: string;
    category: string;
  }>;
};

export type PublicSiteData = {
  language: SupportedLanguage;
  businessName: string;
  tagline: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  ogImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutSecondaryDescription: string;
  aboutImage: string;
  aboutSecondaryImage: string;
  content: LocalizedPublicContent;
  localizedContent: LocalizedSiteContent;
};

function localizeContent(
  content: LocalizedSiteContent,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage,
): LocalizedPublicContent {
  return {
    promoBar: {
      text: getLocalizedText(content.promoBar.text, language, fallbackLanguage),
      linkLabel: getLocalizedText(content.promoBar.linkLabel, language, fallbackLanguage),
      href: content.promoBar.href,
    },
    navigation: content.navigation.map((item) => ({
      id: item.id,
      href: item.href,
      label: getLocalizedText(item.label, language, fallbackLanguage),
    })),
    hero: {
      eyebrow: getLocalizedText(content.hero.eyebrow, language, fallbackLanguage),
      title: getLocalizedText(content.hero.title, language, fallbackLanguage),
      subtitle: getLocalizedText(content.hero.subtitle, language, fallbackLanguage),
      primaryButtonText: getLocalizedText(content.hero.primaryButtonText, language, fallbackLanguage),
      secondaryButtonText: getLocalizedText(content.hero.secondaryButtonText, language, fallbackLanguage),
      mediaBadge: getLocalizedText(content.hero.mediaBadge, language, fallbackLanguage),
      mediaNoteLine: getLocalizedText(content.hero.mediaNoteLine, language, fallbackLanguage),
      mediaNoteLead: getLocalizedText(content.hero.mediaNoteLead, language, fallbackLanguage),
      stats: content.hero.stats.map((item) => ({
        value: getLocalizedText(item.value, language, fallbackLanguage),
        label: getLocalizedText(item.label, language, fallbackLanguage),
      })),
    },
    about: {
      kicker: getLocalizedText(content.about.kicker, language, fallbackLanguage),
      title: getLocalizedText(content.about.title, language, fallbackLanguage),
      description: getLocalizedText(content.about.description, language, fallbackLanguage),
      secondaryDescription: getLocalizedText(content.about.secondaryDescription, language, fallbackLanguage),
      highlights: getLocalizedArray(content.about.highlights, language, fallbackLanguage),
      quote: getLocalizedText(content.about.quote, language, fallbackLanguage),
      mediaLabel: getLocalizedText(content.about.mediaLabel, language, fallbackLanguage),
      infoTileTitle: getLocalizedText(content.about.infoTileTitle, language, fallbackLanguage),
      infoTileText: getLocalizedText(content.about.infoTileText, language, fallbackLanguage),
    },
    services: {
      eyebrow: getLocalizedText(content.services.eyebrow, language, fallbackLanguage),
      title: getLocalizedText(content.services.title, language, fallbackLanguage),
      intro: getLocalizedText(content.services.intro, language, fallbackLanguage),
      items: content.services.items.map((item) => ({
        id: item.id,
        title: getLocalizedText(item.title, language, fallbackLanguage),
        description: getLocalizedText(item.description, language, fallbackLanguage),
        points: getLocalizedArray(item.points, language, fallbackLanguage),
      })),
    },
    process: {
      eyebrow: getLocalizedText(content.process.eyebrow, language, fallbackLanguage),
      title: getLocalizedText(content.process.title, language, fallbackLanguage),
      intro: getLocalizedText(content.process.intro, language, fallbackLanguage),
      items: content.process.items.map((item) => ({
        id: item.id,
        title: getLocalizedText(item.title, language, fallbackLanguage),
        description: getLocalizedText(item.description, language, fallbackLanguage),
      })),
    },
    projectsSection: {
      eyebrow: getLocalizedText(content.projectsSection.eyebrow, language, fallbackLanguage),
      title: getLocalizedText(content.projectsSection.title, language, fallbackLanguage),
      intro: getLocalizedText(content.projectsSection.intro, language, fallbackLanguage),
      helper: getLocalizedText(content.projectsSection.helper, language, fallbackLanguage),
      ctaLabel: getLocalizedText(content.projectsSection.ctaLabel, language, fallbackLanguage),
      previousLabel: getLocalizedText(content.projectsSection.previousLabel, language, fallbackLanguage),
      nextLabel: getLocalizedText(content.projectsSection.nextLabel, language, fallbackLanguage),
      viewProject: getLocalizedText(content.projectsSection.viewProject, language, fallbackLanguage),
      modalCloseAria: getLocalizedText(content.projectsSection.modalCloseAria, language, fallbackLanguage),
      modalDetailsLabel: getLocalizedText(content.projectsSection.modalDetailsLabel, language, fallbackLanguage),
      modalGalleryAria: getLocalizedText(content.projectsSection.modalGalleryAria, language, fallbackLanguage),
      modalWhatsappCta: getLocalizedText(content.projectsSection.modalWhatsappCta, language, fallbackLanguage),
      modalLocation: getLocalizedText(content.projectsSection.modalLocation, language, fallbackLanguage),
      modalYear: getLocalizedText(content.projectsSection.modalYear, language, fallbackLanguage),
      modalStyle: getLocalizedText(content.projectsSection.modalStyle, language, fallbackLanguage),
    },
    cta: {
      eyebrow: getLocalizedText(content.cta.eyebrow, language, fallbackLanguage),
      title: getLocalizedText(content.cta.title, language, fallbackLanguage),
      description: getLocalizedText(content.cta.description, language, fallbackLanguage),
      primaryButtonText: getLocalizedText(content.cta.primaryButtonText, language, fallbackLanguage),
      secondaryButtonText: getLocalizedText(content.cta.secondaryButtonText, language, fallbackLanguage),
    },
    contact: {
      eyebrow: getLocalizedText(content.contact.eyebrow, language, fallbackLanguage),
      title: getLocalizedText(content.contact.title, language, fallbackLanguage),
      description: getLocalizedText(content.contact.description, language, fallbackLanguage),
      formTitle: getLocalizedText(content.contact.formTitle, language, fallbackLanguage),
      formDescription: getLocalizedText(content.contact.formDescription, language, fallbackLanguage),
      whatsappTitle: getLocalizedText(content.contact.whatsappTitle, language, fallbackLanguage),
      whatsappDescription: getLocalizedText(content.contact.whatsappDescription, language, fallbackLanguage),
      responseNote: getLocalizedText(content.contact.responseNote, language, fallbackLanguage),
      labels: {
        name: getLocalizedText(content.contact.labels.name, language, fallbackLanguage),
        email: getLocalizedText(content.contact.labels.email, language, fallbackLanguage),
        phone: getLocalizedText(content.contact.labels.phone, language, fallbackLanguage),
        message: getLocalizedText(content.contact.labels.message, language, fallbackLanguage),
        submit: getLocalizedText(content.contact.labels.submit, language, fallbackLanguage),
        submitting: getLocalizedText(content.contact.labels.submitting, language, fallbackLanguage),
      },
      placeholders: {
        name: getLocalizedText(content.contact.placeholders.name, language, fallbackLanguage),
        email: getLocalizedText(content.contact.placeholders.email, language, fallbackLanguage),
        phone: getLocalizedText(content.contact.placeholders.phone, language, fallbackLanguage),
        message: getLocalizedText(content.contact.placeholders.message, language, fallbackLanguage),
      },
      infoTitle: getLocalizedText(content.contact.infoTitle, language, fallbackLanguage),
      api: {
        validation: getLocalizedText(content.contact.api.validation, language, fallbackLanguage),
        success: getLocalizedText(content.contact.api.success, language, fallbackLanguage),
        server: getLocalizedText(content.contact.api.server, language, fallbackLanguage),
        network: getLocalizedText(content.contact.api.network, language, fallbackLanguage),
      },
    },
    quote: {
      text: getLocalizedText(content.quote.text, language, fallbackLanguage),
      subtext: getLocalizedText(content.quote.subtext, language, fallbackLanguage),
    },
    footer: {
      text: getLocalizedText(content.footer.text, language, fallbackLanguage),
      rights: getLocalizedText(content.footer.rights, language, fallbackLanguage),
      bottomTagline: getLocalizedText(content.footer.bottomTagline, language, fallbackLanguage),
      socialTiktok: getLocalizedText(content.footer.socialTiktok, language, fallbackLanguage),
      socialLinkedin: getLocalizedText(content.footer.socialLinkedin, language, fallbackLanguage),
    },
    seo: {
      pageTitle: getLocalizedText(content.seo.pageTitle, language, fallbackLanguage),
      pageDescription: getLocalizedText(content.seo.pageDescription, language, fallbackLanguage),
      keywords: content.seo.keywords[language]?.length ? content.seo.keywords[language] : content.seo.keywords[fallbackLanguage],
      openGraphTitle: getLocalizedText(content.seo.openGraphTitle, language, fallbackLanguage),
      openGraphDescription: getLocalizedText(content.seo.openGraphDescription, language, fallbackLanguage),
    },
    serviceCard: {
      badgePrefix: getLocalizedText(content.serviceCard.badgePrefix, language, fallbackLanguage),
    },
    social: {
      whatsapp: getLocalizedText(content.social.whatsapp, language, fallbackLanguage),
      instagram: getLocalizedText(content.social.instagram, language, fallbackLanguage),
      facebook: getLocalizedText(content.social.facebook, language, fallbackLanguage),
    },
    accessibility: {
      panelTitle: getLocalizedText(content.accessibility.panelTitle, language, fallbackLanguage),
      panelAria: getLocalizedText(content.accessibility.panelAria, language, fallbackLanguage),
      close: getLocalizedText(content.accessibility.close, language, fallbackLanguage),
      closeAria: getLocalizedText(content.accessibility.closeAria, language, fallbackLanguage),
      openPanelAria: getLocalizedText(content.accessibility.openPanelAria, language, fallbackLanguage),
      triggerLabel: getLocalizedText(content.accessibility.triggerLabel, language, fallbackLanguage),
      reset: getLocalizedText(content.accessibility.reset, language, fallbackLanguage),
      largeText: getLocalizedText(content.accessibility.largeText, language, fallbackLanguage),
      highContrast: getLocalizedText(content.accessibility.highContrast, language, fallbackLanguage),
      underlineLinks: getLocalizedText(content.accessibility.underlineLinks, language, fallbackLanguage),
      grayscale: getLocalizedText(content.accessibility.grayscale, language, fallbackLanguage),
      reduceMotion: getLocalizedText(content.accessibility.reduceMotion, language, fallbackLanguage),
    },
    siteLoader: {
      loading: getLocalizedText(content.siteLoader.loading, language, fallbackLanguage),
    },
    navbar: {
      skipToHeroAria: getLocalizedText(content.navbar.skipToHeroAria, language, fallbackLanguage),
      menuToggleAria: getLocalizedText(content.navbar.menuToggleAria, language, fallbackLanguage),
      languageSwitcherAria: getLocalizedText(content.navbar.languageSwitcherAria, language, fallbackLanguage),
    },
    languages: {
      nativeHebrew: getLocalizedText(content.languages.nativeHebrew, language, fallbackLanguage),
      nativeArabic: getLocalizedText(content.languages.nativeArabic, language, fallbackLanguage),
    },
    portfolioItems: content.portfolioItems.map((item) => ({
      title: getLocalizedText(item.title, language, fallbackLanguage),
      category: getLocalizedText(item.category, language, fallbackLanguage),
    })),
  };
}

export async function getPublicSiteData(language: SupportedLanguage = "he"): Promise<PublicSiteData> {
  noStore();

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const localizedContent = getMergedLocalizedContent(settings?.localizedContent);
  const content = localizeContent(localizedContent, language, language === "he" ? "ar" : "he");

  return {
    language,
    businessName: settings?.businessName || siteConfig.businessName,
    tagline: settings?.tagline || siteConfig.tagline,
    phoneNumber: settings?.phoneNumber || siteConfig.phoneNumber,
    whatsappNumber: settings?.whatsappNumber || siteConfig.whatsappNumber,
    email: settings?.email || siteConfig.email,
    address: settings?.address || siteConfig.address,
    ogImage: siteConfig.ogImage,
    heroTitle:
      language === "he" && settings?.heroTitle?.trim() ? settings.heroTitle : content.hero.title,
    heroSubtitle:
      language === "he" && settings?.heroSubtitle?.trim() ? settings.heroSubtitle : content.hero.subtitle,
    heroImage: settings?.heroImageUrl || siteConfig.heroImage,
    aboutTitle:
      language === "he" && settings?.aboutTitle?.trim() ? settings.aboutTitle : content.about.title,
    aboutDescription:
      language === "he" && settings?.aboutDescription?.trim()
        ? settings.aboutDescription
        : content.about.description,
    aboutSecondaryDescription:
      language === "he" && settings?.aboutSecondaryDescription?.trim()
        ? settings.aboutSecondaryDescription
        : content.about.secondaryDescription,
    aboutImage: settings?.aboutImageUrl || siteConfig.aboutImage,
    aboutSecondaryImage: settings?.aboutSecondaryImageUrl || siteConfig.heroImage,
    content,
    localizedContent,
  };
}
