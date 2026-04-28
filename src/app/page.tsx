import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PromoBar from "@/components/layout/PromoBar";
import type { Metadata } from "next";

import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";
import Hero from "@/components/sections/Hero";
import QuoteSection from "@/components/sections/QuoteSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import AccessibilityButton from "@/components/ui/AccessibilityButton";
import SiteLoader from "@/components/ui/SiteLoader";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ProjectsSection from "@/components/projects/ProjectsSection";
import { getThemeVariables } from "@/lib/helpers";
import { I18nProvider } from "@/lib/i18n/use-language";
import { getCurrentSiteLanguage } from "@/lib/site-language";
import { getPublicSiteData } from "@/lib/site-settings";

import styles from "@/styles/page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentSiteLanguage();
  const settings = await getPublicSiteData(language);

  return {
    title: settings.content.seo.pageTitle,
    description: settings.content.seo.pageDescription,
    openGraph: {
      title: settings.content.seo.openGraphTitle,
      description: settings.content.seo.openGraphDescription,
      images: [settings.ogImage],
    },
    keywords: settings.content.seo.keywords,
  };
}

export default async function Home() {
  const language = await getCurrentSiteLanguage();
  const settings = await getPublicSiteData(language);

  return (
    <I18nProvider locale={settings.language} t={settings.content}>
      <div className={styles.page} data-language={settings.language} style={getThemeVariables()}>
        <SiteLoader businessName={settings.businessName} />
        <div className={styles.ambient} aria-hidden="true">
          <span className={[styles.blob, styles.blobOne].join(" ")} />
          <span className={[styles.blob, styles.blobTwo].join(" ")} />
          <span className={[styles.blob, styles.blobThree].join(" ")} />
          <span className={[styles.blob, styles.blobFour].join(" ")} />
          <span className={[styles.blob, styles.blobFive].join(" ")} />
          <span className={[styles.ring, styles.ringOne].join(" ")} />
          <span className={[styles.ring, styles.ringTwo].join(" ")} />
        </div>
        <PromoBar />
        <Navbar settings={settings} />
        <main>
          <Hero settings={settings} />
          <AboutSection settings={settings} />
          <ServicesSection />
          <CTASection />
          <QuoteSection />
          <WhyChooseUsSection />
          <ProjectsSection />
          <ContactSection settings={settings} />
        </main>
        <Footer settings={settings} />
        <AccessibilityButton />
        <WhatsAppButton settings={settings} />
      </div>
    </I18nProvider>
  );
}
