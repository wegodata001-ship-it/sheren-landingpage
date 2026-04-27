import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PromoBar from "@/components/layout/PromoBar";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";
import Hero from "@/components/sections/Hero";
import QuoteSection from "@/components/sections/QuoteSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import AccessibilityButton from "@/components/ui/AccessibilityButton";
import SiteLoader from "@/components/ui/SiteLoader";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getThemeVariables } from "@/lib/helpers";
import { getPublicSiteData } from "@/lib/site-settings";

import styles from "@/styles/page.module.css";

export default async function Home() {
  const settings = await getPublicSiteData();

  return (
    <div className={styles.page} style={getThemeVariables()}>
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
        <TestimonialsSection />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
      <AccessibilityButton />
      <WhatsAppButton settings={settings} />
    </div>
  );
}
