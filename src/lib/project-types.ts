import type { ProjectSize } from "@prisma/client";

import type { SupportedLanguage } from "@/lib/localized-content";

export type ProjectBilingualText = {
  he: string;
  ar: string;
};

export type ProjectLocalizedPayload = {
  title: ProjectBilingualText;
  shortDescription: ProjectBilingualText;
  fullDescription: ProjectBilingualText;
  category: ProjectBilingualText;
  location?: ProjectBilingualText;
  year?: string;
  style?: ProjectBilingualText;
};

export type ProjectGalleryImage = {
  url: string;
  path: string;
};

export type PublicProject = {
  id: string;
  title: ProjectBilingualText;
  shortDescription: ProjectBilingualText;
  fullDescription: ProjectBilingualText;
  category: ProjectBilingualText;
  coverImageUrl: string;
  galleryImages: Array<{ url: string }>;
  location?: ProjectBilingualText;
  year?: string;
  style?: ProjectBilingualText;
  size: ProjectSize;
};

export function emptyBilingual(): ProjectBilingualText {
  return { he: "", ar: "" };
}

export function pickProjectLang(text: ProjectBilingualText | undefined, lang: SupportedLanguage): string {
  const primary = (text?.[lang] || "").trim();
  if (primary) {
    return primary;
  }
  const fallback = (text?.he || "").trim();
  return fallback || (text?.ar || "").trim();
}
