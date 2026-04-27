import { cookies } from "next/headers";

import type { SupportedLanguage } from "./localized-content";

export const SITE_LANGUAGE_COOKIE = "site-language";

export function normalizeLanguage(value?: string | null): SupportedLanguage {
  return value === "ar" ? "ar" : "he";
}

export async function getCurrentSiteLanguage(): Promise<SupportedLanguage> {
  const cookieStore = await cookies();
  return normalizeLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
}
