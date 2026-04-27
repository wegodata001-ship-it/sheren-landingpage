"use client";

import Image from "next/image";

import Container from "@/components/ui/Container";
import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/lib/i18n/use-language";
import type { PublicSiteData } from "@/lib/site-settings";

import styles from "./AboutSection.module.css";

type AboutSectionProps = {
  settings?: PublicSiteData;
};

export default function AboutSection({ settings }: AboutSectionProps) {
  const { t, locale } = useLanguage();
  const businessName = settings?.businessName || siteConfig.businessName;
  const aboutTitle = locale === "he" && settings?.aboutTitle?.trim() ? settings.aboutTitle : t.about.title;
  const aboutDescription =
    locale === "he" && settings?.aboutDescription?.trim() ? settings.aboutDescription : t.about.description;
  const aboutSecondaryDescription =
    locale === "he" && settings?.aboutSecondaryDescription?.trim()
      ? settings.aboutSecondaryDescription
      : t.about.secondaryDescription;
  const aboutImage = settings?.aboutImage || siteConfig.aboutImage;
  const aboutSecondaryImage = settings?.aboutSecondaryImage || settings?.heroImage || siteConfig.heroImage;
  const highlights = t.about.highlights.slice(0, 2);

  return (
    <AnimatedSection id="about" className={styles.section}>
      <Container>
        <div className={styles.panel}>
          <div className={styles.grid}>
            <div className={styles.content}>
              <Reveal>
                <span className={styles.kicker}>{t.about.kicker}</span>
              </Reveal>
              <Reveal delay={0.1}>
                <SectionTitle title={aboutTitle} description={aboutDescription} />
              </Reveal>
              <Reveal delay={0.2}>
                <p className={styles.secondary}>{aboutSecondaryDescription}</p>
              </Reveal>
              <Reveal delay={0.28}>
                <ul className={styles.highlights}>
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className={styles.mediaColumn} delay={0.24} x={24}>
              <div className={styles.collage}>
                <div className={styles.mediaCard}>
                  <div className={styles.mediaLabel}>{t.about.mediaLabel}</div>
                  <Image
                    src={aboutImage}
                    alt={businessName}
                    width={680}
                    height={680}
                    className={styles.image}
                  />
                </div>
                <div className={styles.secondaryCard}>
                  <Image
                    src={aboutSecondaryImage}
                    alt={businessName}
                    width={320}
                    height={320}
                    className={styles.secondaryImage}
                  />
                </div>
                <div className={styles.infoTile}>
                  <span>{t.about.infoTileTitle}</span>
                  <strong>{t.about.infoTileText}</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  );
}
