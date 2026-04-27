"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./SiteLoader.module.css";

type SiteLoaderProps = {
  businessName: string;
};

export default function SiteLoader({ businessName }: SiteLoaderProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIsVisible(false), 1100);
    const hideTimer = window.setTimeout(() => setIsHidden(true), 1700);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <div className={[styles.overlay, !isVisible ? styles.fadeOut : ""].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <span className={styles.brandMark} aria-hidden="true" />
        <strong>{businessName}</strong>
        <div className={styles.loader} aria-hidden="true">
          <span />
          <span />
        </div>
        <p>{t.siteLoader.loading}</p>
      </div>
    </div>
  );
}
