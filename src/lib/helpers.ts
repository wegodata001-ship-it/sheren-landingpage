import type { CSSProperties } from "react";

import { siteConfig } from "@/data/siteConfig";

export function getThemeVariables(): CSSProperties {
  return {
    ["--color-primary" as string]: siteConfig.primaryColor,
    ["--color-secondary" as string]: siteConfig.secondaryColor,
    ["--color-accent" as string]: siteConfig.accentColor,
  };
}

export function getYear() {
  return new Date().getFullYear();
}

export function formatPhoneHref(phoneNumber: string) {
  return `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
}
