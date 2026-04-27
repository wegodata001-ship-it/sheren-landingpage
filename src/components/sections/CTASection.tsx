"use client";

import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/lib/i18n/use-language";
import type { PublicSiteData } from "@/lib/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./CTASection.module.css";

type CTASectionProps = {
  settings?: PublicSiteData;
};

export default function CTASection({ settings }: CTASectionProps) {
  const { t } = useLanguage();
  const whatsappLink = buildWhatsAppLink(
    settings?.whatsappNumber || siteConfig.whatsappNumber,
    siteConfig.defaultWhatsAppMessage,
  );

  return (
    <AnimatedSection id="full-package" className={styles.section}>
      <Container>
        <div className={styles.panel}>
          <Reveal className={styles.content}>
            <span className={styles.eyebrow}>{t.cta.eyebrow}</span>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.description}</p>
          </Reveal>
          <Reveal className={styles.actions} delay={0.15} x={18}>
            <PrimaryButton href="#contact">{t.cta.primaryButtonText}</PrimaryButton>
            <PrimaryButton href={whatsappLink} target="_blank" rel="noreferrer" variant="ghost">
              {t.cta.secondaryButtonText}
            </PrimaryButton>
          </Reveal>
        </div>
      </Container>
    </AnimatedSection>
  );
}
