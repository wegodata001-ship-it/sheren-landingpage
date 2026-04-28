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

import { prisma } from "@/lib/prisma";
import { getStorageBucket, supabaseAdmin } from "@/lib/supabase-admin";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

async function uploadStorageImage(file: File, folder: string) {
  console.log("[admin/actions] uploadStorageImage:start", {
    name: file.name,
    size: file.size,
    type: file.type,
    folder,
  });
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
    console.error("[admin/actions] uploadStorageImage:error", { folder, message: error.message });
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  console.log("[admin/actions] uploadStorageImage:success", {
    filePath,
    publicUrl: data.publicUrl,
  });

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
