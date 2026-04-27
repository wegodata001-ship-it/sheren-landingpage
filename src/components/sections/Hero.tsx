"use client";

import Image from "next/image";

import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/lib/i18n/use-language";
import type { PublicSiteData } from "@/lib/site-settings";

import styles from "./Hero.module.css";

type HeroProps = {
  settings?: PublicSiteData;
};

export default function Hero({ settings }: HeroProps) {
  const { t, locale } = useLanguage();
  const businessName = settings?.businessName || siteConfig.businessName;
  const useLegacyHeroCopy = locale === "he" && Boolean(settings?.heroTitle?.trim());
  const heroTitle = useLegacyHeroCopy ? settings!.heroTitle : t.hero.title;
  const heroSubtitle =
    locale === "he" && Boolean(settings?.heroSubtitle?.trim()) ? settings!.heroSubtitle : t.hero.subtitle;
  const heroImage = settings?.heroImage || siteConfig.heroImage;
  const heroStats = t.hero.stats.slice(0, 3);

  return (
    <AnimatedSection id="hero" className={styles.hero}>
      <Container className={styles.grid}>
        <div className={styles.content}>
          <Reveal delay={0.05}>
            <span className={styles.eyebrow}>{t.hero.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 className={styles.title}>{heroTitle}</h1>
          </Reveal>
          <Reveal delay={0.25}>
            <p className={styles.subtitle}>{heroSubtitle}</p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className={styles.actions}>
              <PrimaryButton href="#contact">{t.hero.primaryButtonText}</PrimaryButton>
              <PrimaryButton href="#services" variant="outline">
                {t.hero.secondaryButtonText}
              </PrimaryButton>
            </div>
          </Reveal>
        </div>

        <Reveal className={styles.mediaWrap} delay={0.3} x={28}>
          <div className={styles.mediaCard}>
            <div className={styles.mediaBadge}>{t.hero.mediaBadge}</div>
            <Image
              src={heroImage}
              alt={businessName}
              width={720}
              height={720}
              priority
              className={styles.image}
            />
            <div className={styles.mediaNote}>
              <span>{t.hero.mediaNoteLine}</span>
              <strong>{t.hero.mediaNoteLead}</strong>
            </div>
          </div>
        </Reveal>

        <div className={styles.stats}>
          {heroStats.map((item, index) => (
            <Reveal key={`${item.label}-${index}`} delay={0.45 + index * 0.12}>
              <div className={styles.statCard}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
