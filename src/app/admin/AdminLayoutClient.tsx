"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  ADMIN_UI_LANG_COOKIE,
  type AdminUiLang,
  parseAdminUiLang,
  adminShellDir,
} from "@/lib/admin-ui-lang";

import { AdminLanguageProvider, type AdminLanguageContextValue } from "./admin-language-context";
import styles from "./page.module.css";

function setAdminUiLangCookie(lang: AdminUiLang) {
  document.cookie = `${ADMIN_UI_LANG_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

export function AdminLayoutClient({
  initialLang,
  children,
}: {
  initialLang: AdminUiLang;
  children: ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<AdminUiLang>(() => parseAdminUiLang(initialLang));

  const dir = adminShellDir(lang);

  const setLang = useCallback(
    (next: AdminUiLang) => {
      setLangState(next);
      setAdminUiLangCookie(next);
      router.refresh();
    },
    [router],
  );

  useEffect(() => {
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.getAttribute("dir");
    document.documentElement.lang = lang === "ar" ? "ar" : "he";
    document.documentElement.setAttribute("dir", dir);
    return () => {
      document.documentElement.lang = prevLang || "he";
      if (prevDir) {
        document.documentElement.setAttribute("dir", prevDir);
      } else {
        document.documentElement.setAttribute("dir", "rtl");
      }
    };
  }, [lang, dir]);

  const value = useMemo<AdminLanguageContextValue>(
    () => ({ lang, dir, setLang }),
    [lang, dir, setLang],
  );

  return (
    <AdminLanguageProvider value={value}>
      <div
        className={styles.adminRoot}
        data-admin-root
        data-admin-lang={lang}
        data-admin-dir={dir}
        dir={dir}
      >
        <div className={styles.adminLangBar} role="group" aria-label="שפת ממשק הניהול">
          <span className={styles.adminLangBarLabel}>ממשק:</span>
          <button
            type="button"
            className={styles.adminLangBtn}
            data-active={lang === "he"}
            onClick={() => setLang("he")}
          >
            עברית
          </button>
          <button
            type="button"
            className={styles.adminLangBtn}
            data-active={lang === "ar"}
            onClick={() => setLang("ar")}
          >
            العربية
          </button>
        </div>
        {children}
      </div>
    </AdminLanguageProvider>
  );
}
