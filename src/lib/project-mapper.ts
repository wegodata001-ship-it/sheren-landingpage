import type { LocalizedSiteContent } from "@/lib/localized-content";
import {
  emptyBilingual,
  type ProjectGalleryImage,
  type ProjectLocalizedPayload,
  type ProjectRecord,
  type PublicProject,
} from "@/lib/project-types";

export function parseLocalizedPayload(value: unknown): ProjectLocalizedPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const v = value as Record<string, unknown>;
  const readPair = (key: string): { he: string; ar: string } | null => {
    const inner = v[key];
    if (!inner || typeof inner !== "object") {
      return null;
    }
    const o = inner as Record<string, unknown>;
    return { he: String(o.he ?? ""), ar: String(o.ar ?? "") };
  };

  const title = readPair("title");
  const shortDescription = readPair("shortDescription");
  const fullDescription = readPair("fullDescription");
  const category = readPair("category");
  if (!title || !shortDescription || !fullDescription || !category) {
    return null;
  }

  const location = readPair("location");
  const style = readPair("style");

  return {
    title,
    shortDescription,
    fullDescription,
    category,
    location: location || undefined,
    year: typeof v.year === "string" ? v.year : undefined,
    style: style || undefined,
  };
}

export function parseGalleryPayload(value: unknown): ProjectGalleryImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const o = item as Record<string, unknown>;
      const url = String(o.url || "");
      const path = String(o.path || "");
      if (!url || !path) {
        return null;
      }
      return { url, path };
    })
    .filter(Boolean) as ProjectGalleryImage[];
}

export function mapProjectToPublic(
  project: ProjectRecord,
  index: number,
  localized: LocalizedSiteContent,
): PublicProject {
  const payload = parseLocalizedPayload(project.localizedPayload);
  const portfolio = localized.portfolioItems[index];
  const gallery = parseGalleryPayload(project.galleryPayload);

  const titleHe = (payload?.title.he || project.title).trim();
  const titleAr = (payload?.title.ar || portfolio?.title.ar || project.title).trim();

  const categoryHe = (payload?.category.he || project.category).trim();
  const categoryAr = (payload?.category.ar || portfolio?.category.ar || project.category).trim();

  const shortHe = (payload?.shortDescription.he || "").trim();
  const shortAr = (payload?.shortDescription.ar || "").trim();

  const fullHe = (payload?.fullDescription.he || "").trim();
  const fullAr = (payload?.fullDescription.ar || "").trim();

  const locHe = (payload?.location?.he || "").trim();
  const locAr = (payload?.location?.ar || "").trim();
  const styleHe = (payload?.style?.he || "").trim();
  const styleAr = (payload?.style?.ar || "").trim();

  return {
    id: project.id,
    title: { he: titleHe, ar: titleAr || titleHe },
    shortDescription: { he: shortHe, ar: shortAr || shortHe },
    fullDescription: { he: fullHe, ar: fullAr || fullHe },
    category: { he: categoryHe, ar: categoryAr || categoryHe },
    coverImageUrl: project.imageUrl,
    galleryImages: gallery.map((g) => ({ url: g.url })),
    location:
      locHe || locAr
        ? {
            he: locHe || locAr,
            ar: locAr || locHe,
          }
        : undefined,
    year: payload?.year?.trim() || undefined,
    style:
      styleHe || styleAr
        ? {
            he: styleHe || styleAr,
            ar: styleAr || styleHe,
          }
        : undefined,
    size: project.size,
  };
}

export function defaultPayloadFromLegacy(title: string, category: string): ProjectLocalizedPayload {
  return {
    title: { he: title, ar: "" },
    shortDescription: emptyBilingual(),
    fullDescription: emptyBilingual(),
    category: { he: category, ar: "" },
    location: emptyBilingual(),
    year: "",
    style: emptyBilingual(),
  };
}
