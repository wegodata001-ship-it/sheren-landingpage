import type { SupportedLanguage } from "./localized-content";

export function getOtherLanguage(language: SupportedLanguage): SupportedLanguage {
  return language === "he" ? "ar" : "he";
}
