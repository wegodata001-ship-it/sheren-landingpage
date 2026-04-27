"use client";

import Container from "@/components/ui/Container";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./PromoBar.module.css";

export default function PromoBar() {
  const { t } = useLanguage();

  if (!siteConfig.sectionVisibility.promoBar) {
    return null;
  }

  return (
    <div className={styles.bar}>
      <Container className={styles.inner}>
        <p className={styles.text}>{t.promoBar.text}</p>
        <a className={styles.link} href={t.promoBar.href}>
          {t.promoBar.linkLabel}
        </a>
      </Container>
    </div>
  );
}
