"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AdminUiLang } from "@/lib/admin-ui-lang";

export type AdminLanguageContextValue = {
  /** Admin chrome language (layout + typography), separate from public site language. */
  lang: AdminUiLang;
  /** Document direction for the admin shell: Hebrew = LTR dashboard, Arabic = RTL. */
  dir: "ltr" | "rtl";
  setLang: (lang: AdminUiLang) => void;
};

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);

export function AdminLanguageProvider({
  value,
  children,
}: {
  value: AdminLanguageContextValue;
  children: ReactNode;
}) {
  return (
    <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage(): AdminLanguageContextValue {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) {
    throw new Error("useAdminLanguage must be used under the admin layout.");
  }
  return ctx;
}

/** Same as `useAdminLanguage()` — use when you prefer the name `useLanguage` in admin-only code. */
export function useLanguage(): AdminLanguageContextValue {
  return useAdminLanguage();
}
