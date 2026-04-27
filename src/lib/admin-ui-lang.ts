export const ADMIN_UI_LANG_COOKIE = "admin-ui-lang";

export type AdminUiLang = "he" | "ar";

export function parseAdminUiLang(value: string | undefined | null): AdminUiLang {
  return value === "ar" ? "ar" : "he";
}

export function adminShellDir(lang: AdminUiLang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}
