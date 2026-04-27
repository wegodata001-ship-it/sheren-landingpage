"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

import type { SupportedLanguage } from "@/lib/localized-content";
import type { LocalizedPublicContent } from "@/lib/site-settings";

type I18nContextValue = {
  locale: SupportedLanguage;
  t: LocalizedPublicContent;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  t,
  children,
}: {
  locale: SupportedLanguage;
  t: LocalizedPublicContent;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale === "ar" ? "ar" : "he";
    document.documentElement.setAttribute("dir", "rtl");
  }, [locale]);

  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>;
}

export function useLanguage() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useLanguage must be used within I18nProvider.");
  }

  return context;
}
