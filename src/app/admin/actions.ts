"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { defaultLocalizedContent, getMergedLocalizedContent, type LocalizedSiteContent } from "@/lib/localized-content";
import { parseGalleryPayload } from "@/lib/project-mapper";
import type { ProjectGalleryImage, ProjectLocalizedPayload } from "@/lib/project-types";

import { prisma } from "@/lib/prisma";
import { getStorageBucket, supabaseAdmin } from "@/lib/supabase-admin";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type InputJsonValue = Exclude<JsonValue, null>;

function getField(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function normalizeProjectSize(value: string) {
  return value === "wide" || value === "tall" ? value : "standard";
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

async function uploadStorageImage(file: File, folder: string) {
  const bucket = getStorageBucket();
  const safeFileName = file.name.replace(/[^\w.-]/g, "-");
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const filePath = `${normalizedFolder}/${Date.now()}-${safeFileName}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage.from(bucket).upload(filePath, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

  return {
    filePath,
    publicUrl: data.publicUrl,
  };
}

async function removeProjectImage(path: string) {
  if (!path) {
    return;
  }

  const bucket = getStorageBucket();
  await supabaseAdmin.storage.from(bucket).remove([path]);
}

async function removeStoragePaths(paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))];
  await Promise.all(unique.map((path) => removeProjectImage(path)));
}

function readLocalizedPayloadJson(raw: string): ProjectLocalizedPayload {
  const parsed = JSON.parse(raw || "{}") as ProjectLocalizedPayload;
  if (!parsed?.title?.he?.trim() || !parsed?.category?.he?.trim()) {
    throw new Error("Invalid localized payload");
  }
  return {
    title: { he: String(parsed.title.he), ar: String(parsed.title.ar ?? "") },
    shortDescription: {
      he: String(parsed.shortDescription?.he ?? ""),
      ar: String(parsed.shortDescription?.ar ?? ""),
    },
    fullDescription: {
      he: String(parsed.fullDescription?.he ?? ""),
      ar: String(parsed.fullDescription?.ar ?? ""),
    },
    category: { he: String(parsed.category.he), ar: String(parsed.category.ar ?? "") },
    location: {
      he: String(parsed.location?.he ?? ""),
      ar: String(parsed.location?.ar ?? ""),
    },
    year: String(parsed.year ?? ""),
    style: {
      he: String(parsed.style?.he ?? ""),
      ar: String(parsed.style?.ar ?? ""),
    },
  };
}

function collectGalleryNewFiles(formData: FormData): File[] {
  const pairs: { i: number; file: File }[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("galleryNew_")) {
      continue;
    }

    if (!(value instanceof File) || value.size === 0) {
      continue;
    }

    const index = Number(key.slice("galleryNew_".length));

    if (!Number.isFinite(index)) {
      continue;
    }

    pairs.push({ i: index, file: value });
  }

  pairs.sort((a, b) => a.i - b.i);
  return pairs.map((item) => item.file);
}

export async function loginAction(formData: FormData) {
  const username = getField(formData, "username");
  const password = getField(formData, "password");

  if (!validateAdminCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveSiteSettingsAction(formData: FormData) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const existingSettings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const heroImage = formData.get("heroImage");
  const aboutImage = formData.get("aboutImage");
  const aboutSecondaryImage = formData.get("aboutSecondaryImage");

  let heroImageUrl = existingSettings?.heroImageUrl || null;
  let heroImagePath = existingSettings?.heroImagePath || null;
  let aboutImageUrl = existingSettings?.aboutImageUrl || null;
  let aboutImagePath = existingSettings?.aboutImagePath || null;
  let aboutSecondaryImageUrl = existingSettings?.aboutSecondaryImageUrl || null;
  let aboutSecondaryImagePath = existingSettings?.aboutSecondaryImagePath || null;

  if (isFileLike(heroImage)) {
    const uploadedHeroImage = await uploadStorageImage(heroImage, "site/hero");
    await removeProjectImage(existingSettings?.heroImagePath || "");
    heroImageUrl = uploadedHeroImage.publicUrl;
    heroImagePath = uploadedHeroImage.filePath;
  }

  if (isFileLike(aboutImage)) {
    const uploadedAboutImage = await uploadStorageImage(aboutImage, "site/about");
    await removeProjectImage(existingSettings?.aboutImagePath || "");
    aboutImageUrl = uploadedAboutImage.publicUrl;
    aboutImagePath = uploadedAboutImage.filePath;
  }

  if (isFileLike(aboutSecondaryImage)) {
    const uploadedAboutSecondaryImage = await uploadStorageImage(aboutSecondaryImage, "site/about-secondary");
    await removeProjectImage(existingSettings?.aboutSecondaryImagePath || "");
    aboutSecondaryImageUrl = uploadedAboutSecondaryImage.publicUrl;
    aboutSecondaryImagePath = uploadedAboutSecondaryImage.filePath;
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      businessName: getField(formData, "businessName"),
      tagline: getField(formData, "tagline"),
      phoneNumber: getField(formData, "phoneNumber"),
      whatsappNumber: getField(formData, "whatsappNumber"),
      email: getField(formData, "email"),
      address: getField(formData, "address"),
      heroTitle: getField(formData, "heroTitle"),
      heroSubtitle: getField(formData, "heroSubtitle"),
      heroImageUrl,
      heroImagePath,
      aboutTitle: getField(formData, "aboutTitle"),
      aboutDescription: getField(formData, "aboutDescription"),
      aboutSecondaryDescription: getField(formData, "aboutSecondaryDescription"),
      aboutImageUrl,
      aboutImagePath,
      aboutSecondaryImageUrl,
      aboutSecondaryImagePath,
    },
    create: {
      id: "default",
      businessName: getField(formData, "businessName"),
      tagline: getField(formData, "tagline"),
      phoneNumber: getField(formData, "phoneNumber"),
      whatsappNumber: getField(formData, "whatsappNumber"),
      email: getField(formData, "email"),
      address: getField(formData, "address"),
      heroTitle: getField(formData, "heroTitle"),
      heroSubtitle: getField(formData, "heroSubtitle"),
      heroImageUrl,
      heroImagePath,
      aboutTitle: getField(formData, "aboutTitle"),
      aboutDescription: getField(formData, "aboutDescription"),
      aboutSecondaryDescription: getField(formData, "aboutSecondaryDescription"),
      aboutImageUrl,
      aboutImagePath,
      aboutSecondaryImageUrl,
      aboutSecondaryImagePath,
      localizedContent: existingSettings?.localizedContent || defaultLocalizedContent,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function saveLocalizedContentAction(localizedContent: LocalizedSiteContent) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      localizedContent,
    },
    create: {
      id: "default",
      localizedContent,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    ok: true,
    localizedContent: getMergedLocalizedContent(localizedContent),
  };
}

export async function createProjectAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const size = normalizeProjectSize(getField(formData, "size"));
  const cover = formData.get("coverImage");
  const payloadRaw = String(formData.get("localizedPayload") || "");

  if (!isFileLike(cover) || !payloadRaw.trim()) {
    redirect("/admin?saved=project-error");
  }

  let payload: ProjectLocalizedPayload;

  try {
    payload = readLocalizedPayloadJson(payloadRaw);
  } catch {
    redirect("/admin?saved=project-error");
  }

  const currentCount = await prisma.project.count();
  const uploadedCover = await uploadStorageImage(cover, "projects");
  const newFiles = collectGalleryNewFiles(formData);
  const uploadedGallery: ProjectGalleryImage[] = [];

  for (const file of newFiles) {
    const up = await uploadStorageImage(file, "projects");
    uploadedGallery.push({ url: up.publicUrl, path: up.filePath });
  }

  await prisma.project.create({
    data: {
      title: payload.title.he,
      category: payload.category.he,
      imageUrl: uploadedCover.publicUrl,
      imagePath: uploadedCover.filePath,
      size,
      orderIndex: currentCount,
      localizedPayload: payload as unknown as InputJsonValue,
      galleryPayload: (uploadedGallery.length ? uploadedGallery : []) as unknown as InputJsonValue,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=project-created");
}

export async function updateProjectAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const id = getField(formData, "id");
  const size = normalizeProjectSize(getField(formData, "size"));
  const payloadRaw = String(formData.get("localizedPayload") || "");
  const galleryExistingRaw = String(formData.get("galleryExistingJson") || "[]");
  const removedPathsRaw = String(formData.get("removedPaths") || "");

  if (!id || !payloadRaw.trim()) {
    redirect("/admin?saved=project-error");
  }

  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    redirect("/admin?saved=project-error");
  }

  let payload: ProjectLocalizedPayload;

  try {
    payload = readLocalizedPayloadJson(payloadRaw);
  } catch {
    redirect("/admin?saved=project-error");
  }

  let galleryExisting: ProjectGalleryImage[] = [];

  try {
    galleryExisting = JSON.parse(galleryExistingRaw) as ProjectGalleryImage[];
  } catch {
    galleryExisting = parseGalleryPayload(existingProject.galleryPayload);
  }

  const removedPaths = removedPathsRaw
    .split(",")
    .map((path) => path.trim())
    .filter(Boolean);

  await removeStoragePaths(removedPaths);

  const newFiles = collectGalleryNewFiles(formData);
  const uploadedGallery: ProjectGalleryImage[] = [];

  for (const file of newFiles) {
    const up = await uploadStorageImage(file, "projects");
    uploadedGallery.push({ url: up.publicUrl, path: up.filePath });
  }

  const mergedGallery = [...galleryExisting, ...uploadedGallery];

  const cover = formData.get("coverImage");
  const coverUrlOverride = getField(formData, "coverUrlOverride");
  const coverPathOverride = getField(formData, "coverPathOverride");
  let imageUrl = existingProject.imageUrl;
  let imagePath = existingProject.imagePath;

  if (isFileLike(cover)) {
    const uploadedCover = await uploadStorageImage(cover, "projects");
    await removeProjectImage(existingProject.imagePath);
    imageUrl = uploadedCover.publicUrl;
    imagePath = uploadedCover.filePath;
  } else if (coverUrlOverride && coverPathOverride) {
    imageUrl = coverUrlOverride;
    imagePath = coverPathOverride;
  }

  await prisma.project.update({
    where: { id },
    data: {
      title: payload.title.he,
      category: payload.category.he,
      size,
      imageUrl,
      imagePath,
      localizedPayload: payload as unknown as InputJsonValue,
      galleryPayload: (mergedGallery.length ? mergedGallery : []) as unknown as InputJsonValue,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=project-updated");
}

export async function deleteProjectAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const id = getField(formData, "id");

  if (!id) {
    redirect("/admin?saved=project-error");
  }

  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    redirect("/admin?saved=project-error");
  }

  const gallery = parseGalleryPayload(existingProject.galleryPayload);
  const paths = [existingProject.imagePath, ...gallery.map((item) => item.path)].filter(Boolean);
  await removeStoragePaths(paths);

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=project-deleted");
}
