"use client";

import { useMemo } from "react";

import type { SupportedLanguage } from "@/lib/localized-content";

import styles from "./LanguageSwitcher.module.css";

type LanguageSwitcherProps = {
  currentLanguage: SupportedLanguage;
};

export default function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const items = useMemo(
    () => [
      { id: "he", label: "עברית" },
      { id: "ar", label: "العربية" },
    ] as const,
    [],
  );

  function setLanguage(language: SupportedLanguage) {
    document.cookie = `site-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className={styles.wrapper} aria-label="language switcher">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={[styles.button, currentLanguage === item.id ? styles.active : ""].filter(Boolean).join(" ")}
          onClick={() => setLanguage(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
