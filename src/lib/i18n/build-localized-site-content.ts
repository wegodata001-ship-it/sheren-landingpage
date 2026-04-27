import type { LocalizedSiteContent, LocalizedText } from "@/lib/localized-content";
import { messages as arMessages } from "@/translations/ar";
import { messages as heMessages } from "@/translations/he";

function zipText(he: string, ar: string): LocalizedText {
  return { he, ar };
}

export function buildLocalizedSiteContentFromFiles(): LocalizedSiteContent {
  const he = heMessages;
  const ar = arMessages;

  return {
    promoBar: {
      text: zipText(he.promoBar.text, ar.promoBar.text),
      linkLabel: zipText(he.promoBar.linkLabel, ar.promoBar.linkLabel),
      href: he.promoBar.href,
    },
    navigation: he.navigation.map((item, index) => ({
      id: item.id,
      href: item.href,
      label: zipText(item.label, ar.navigation[index]?.label || item.label),
    })),
    hero: {
      eyebrow: zipText(he.hero.eyebrow, ar.hero.eyebrow),
      title: zipText(he.hero.title, ar.hero.title),
      subtitle: zipText(he.hero.subtitle, ar.hero.subtitle),
      primaryButtonText: zipText(he.hero.primaryButtonText, ar.hero.primaryButtonText),
      secondaryButtonText: zipText(he.hero.secondaryButtonText, ar.hero.secondaryButtonText),
      mediaBadge: zipText(he.hero.mediaBadge, ar.hero.mediaBadge),
      mediaNoteLine: zipText(he.hero.mediaNoteLine, ar.hero.mediaNoteLine),
      mediaNoteLead: zipText(he.hero.mediaNoteLead, ar.hero.mediaNoteLead),
      stats: he.hero.stats.map((stat, index) => ({
        value: zipText(stat.value, ar.hero.stats[index]?.value || stat.value),
        label: zipText(stat.label, ar.hero.stats[index]?.label || stat.label),
      })),
    },
    about: {
      kicker: zipText(he.about.kicker, ar.about.kicker),
      title: zipText(he.about.title, ar.about.title),
      description: zipText(he.about.description, ar.about.description),
      secondaryDescription: zipText(he.about.secondaryDescription, ar.about.secondaryDescription),
      highlights: {
        he: he.about.highlights,
        ar: ar.about.highlights,
      },
      quote: zipText(he.about.quote, ar.about.quote),
      mediaLabel: zipText(he.about.mediaLabel, ar.about.mediaLabel),
      infoTileTitle: zipText(he.about.infoTileTitle, ar.about.infoTileTitle),
      infoTileText: zipText(he.about.infoTileText, ar.about.infoTileText),
    },
    services: {
      eyebrow: zipText(he.services.eyebrow, ar.services.eyebrow),
      title: zipText(he.services.title, ar.services.title),
      intro: zipText(he.services.intro, ar.services.intro),
      items: he.services.items.map((item, index) => ({
        id: `service-${index + 1}`,
        title: zipText(item.title, ar.services.items[index]?.title || item.title),
        description: zipText(item.description, ar.services.items[index]?.description || item.description),
        points: {
          he: item.points,
          ar: ar.services.items[index]?.points || item.points,
        },
      })),
    },
    process: {
      eyebrow: zipText(he.process.eyebrow, ar.process.eyebrow),
      title: zipText(he.process.title, ar.process.title),
      intro: zipText(he.process.intro, ar.process.intro),
      items: he.process.items.map((item, index) => ({
        id: `process-${index + 1}`,
        title: zipText(item.title, ar.process.items[index]?.title || item.title),
        description: zipText(item.description, ar.process.items[index]?.description || item.description),
      })),
    },
    projectsSection: {
      eyebrow: zipText(he.projectsSection.eyebrow, ar.projectsSection.eyebrow),
      title: zipText(he.projectsSection.title, ar.projectsSection.title),
      intro: zipText(he.projectsSection.intro, ar.projectsSection.intro),
      helper: zipText(he.projectsSection.helper, ar.projectsSection.helper),
      ctaLabel: zipText(he.projectsSection.ctaLabel, ar.projectsSection.ctaLabel),
      previousLabel: zipText(he.projectsSection.previousLabel, ar.projectsSection.previousLabel),
      nextLabel: zipText(he.projectsSection.nextLabel, ar.projectsSection.nextLabel),
      viewProject: zipText(he.projectsSection.viewProject, ar.projectsSection.viewProject),
      modalCloseAria: zipText(he.projectsSection.modalCloseAria, ar.projectsSection.modalCloseAria),
      modalDetailsLabel: zipText(he.projectsSection.modalDetailsLabel, ar.projectsSection.modalDetailsLabel),
      modalGalleryAria: zipText(he.projectsSection.modalGalleryAria, ar.projectsSection.modalGalleryAria),
      modalWhatsappCta: zipText(he.projectsSection.modalWhatsappCta, ar.projectsSection.modalWhatsappCta),
      modalLocation: zipText(he.projectsSection.modalLocation, ar.projectsSection.modalLocation),
      modalYear: zipText(he.projectsSection.modalYear, ar.projectsSection.modalYear),
      modalStyle: zipText(he.projectsSection.modalStyle, ar.projectsSection.modalStyle),
    },
    cta: {
      eyebrow: zipText(he.cta.eyebrow, ar.cta.eyebrow),
      title: zipText(he.cta.title, ar.cta.title),
      description: zipText(he.cta.description, ar.cta.description),
      primaryButtonText: zipText(he.cta.primaryButtonText, ar.cta.primaryButtonText),
      secondaryButtonText: zipText(he.cta.secondaryButtonText, ar.cta.secondaryButtonText),
    },
    contact: {
      eyebrow: zipText(he.contact.eyebrow, ar.contact.eyebrow),
      title: zipText(he.contact.title, ar.contact.title),
      description: zipText(he.contact.description, ar.contact.description),
      formTitle: zipText(he.contact.formTitle, ar.contact.formTitle),
      formDescription: zipText(he.contact.formDescription, ar.contact.formDescription),
      whatsappTitle: zipText(he.contact.whatsappTitle, ar.contact.whatsappTitle),
      whatsappDescription: zipText(he.contact.whatsappDescription, ar.contact.whatsappDescription),
      responseNote: zipText(he.contact.responseNote, ar.contact.responseNote),
      labels: {
        name: zipText(he.contact.labels.name, ar.contact.labels.name),
        email: zipText(he.contact.labels.email, ar.contact.labels.email),
        phone: zipText(he.contact.labels.phone, ar.contact.labels.phone),
        message: zipText(he.contact.labels.message, ar.contact.labels.message),
        submit: zipText(he.contact.labels.submit, ar.contact.labels.submit),
        submitting: zipText(he.contact.labels.submitting, ar.contact.labels.submitting),
      },
      placeholders: {
        name: zipText(he.contact.placeholders.name, ar.contact.placeholders.name),
        email: zipText(he.contact.placeholders.email, ar.contact.placeholders.email),
        phone: zipText(he.contact.placeholders.phone, ar.contact.placeholders.phone),
        message: zipText(he.contact.placeholders.message, ar.contact.placeholders.message),
      },
      infoTitle: zipText(he.contact.infoTitle, ar.contact.infoTitle),
      api: {
        validation: zipText(he.contact.api.validation, ar.contact.api.validation),
        success: zipText(he.contact.api.success, ar.contact.api.success),
        server: zipText(he.contact.api.server, ar.contact.api.server),
        network: zipText(he.contact.api.network, ar.contact.api.network),
      },
    },
    quote: {
      text: zipText(he.quote.text, ar.quote.text),
      subtext: zipText(he.quote.subtext, ar.quote.subtext),
    },
    footer: {
      text: zipText(he.footer.text, ar.footer.text),
      rights: zipText(he.footer.rights, ar.footer.rights),
      bottomTagline: zipText(he.footer.bottomTagline, ar.footer.bottomTagline),
      socialTiktok: zipText(he.footer.socialTiktok, ar.footer.socialTiktok),
      socialLinkedin: zipText(he.footer.socialLinkedin, ar.footer.socialLinkedin),
    },
    seo: {
      pageTitle: zipText(he.seo.pageTitle, ar.seo.pageTitle),
      pageDescription: zipText(he.seo.pageDescription, ar.seo.pageDescription),
      keywords: {
        he: he.seo.keywords,
        ar: ar.seo.keywords,
      },
      openGraphTitle: zipText(he.seo.openGraphTitle, ar.seo.openGraphTitle),
      openGraphDescription: zipText(he.seo.openGraphDescription, ar.seo.openGraphDescription),
    },
    serviceCard: {
      badgePrefix: zipText(he.serviceCard.badgePrefix, ar.serviceCard.badgePrefix),
    },
    social: {
      whatsapp: zipText(he.social.whatsapp, ar.social.whatsapp),
      instagram: zipText(he.social.instagram, ar.social.instagram),
      facebook: zipText(he.social.facebook, ar.social.facebook),
    },
    accessibility: {
      panelTitle: zipText(he.accessibility.panelTitle, ar.accessibility.panelTitle),
      panelAria: zipText(he.accessibility.panelAria, ar.accessibility.panelAria),
      close: zipText(he.accessibility.close, ar.accessibility.close),
      closeAria: zipText(he.accessibility.closeAria, ar.accessibility.closeAria),
      openPanelAria: zipText(he.accessibility.openPanelAria, ar.accessibility.openPanelAria),
      triggerLabel: zipText(he.accessibility.triggerLabel, ar.accessibility.triggerLabel),
      reset: zipText(he.accessibility.reset, ar.accessibility.reset),
      largeText: zipText(he.accessibility.largeText, ar.accessibility.largeText),
      highContrast: zipText(he.accessibility.highContrast, ar.accessibility.highContrast),
      underlineLinks: zipText(he.accessibility.underlineLinks, ar.accessibility.underlineLinks),
      grayscale: zipText(he.accessibility.grayscale, ar.accessibility.grayscale),
      reduceMotion: zipText(he.accessibility.reduceMotion, ar.accessibility.reduceMotion),
    },
    siteLoader: {
      loading: zipText(he.siteLoader.loading, ar.siteLoader.loading),
    },
    navbar: {
      skipToHeroAria: zipText(he.navbar.skipToHeroAria, ar.navbar.skipToHeroAria),
      menuToggleAria: zipText(he.navbar.menuToggleAria, ar.navbar.menuToggleAria),
      languageSwitcherAria: zipText(he.navbar.languageSwitcherAria, ar.navbar.languageSwitcherAria),
    },
    languages: {
      nativeHebrew: zipText(he.languages.nativeHebrew, ar.languages.nativeHebrew),
      nativeArabic: zipText(he.languages.nativeArabic, ar.languages.nativeArabic),
    },
    portfolioItems: he.portfolioItems.map((item, index) => ({
      title: zipText(item.title, ar.portfolioItems[index]?.title || item.title),
      category: zipText(item.category, ar.portfolioItems[index]?.category || item.category),
    })),
  };
}
