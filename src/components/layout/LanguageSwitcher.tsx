"use client";

import type { SupportedLanguage } from "@/lib/localized-content";

import styles from "./LanguageSwitcher.module.css";

type LanguageSwitcherProps = {
  currentLanguage: SupportedLanguage;
  nativeHebrewLabel: string;
  nativeArabicLabel: string;
  ariaLabel: string;
};

export default function LanguageSwitcher({
  currentLanguage,
  nativeHebrewLabel,
  nativeArabicLabel,
  ariaLabel,
}: LanguageSwitcherProps) {
  function setLanguage(language: SupportedLanguage) {
    document.cookie = `site-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className={styles.wrapper} aria-label={ariaLabel}>
      <button
        type="button"
        className={[styles.button, currentLanguage === "he" ? styles.active : ""].filter(Boolean).join(" ")}
        onClick={() => setLanguage("he")}
      >
        {nativeHebrewLabel}
      </button>
      <button
        type="button"
        className={[styles.button, currentLanguage === "ar" ? styles.active : ""].filter(Boolean).join(" ")}
        onClick={() => setLanguage("ar")}
      >
        {nativeArabicLabel}
      </button>
    </div>
  );
}
