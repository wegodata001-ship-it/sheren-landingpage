import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PROJECTS_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "site-assets";

type ProjectCategory = "Residential" | "Commercial";

function normalizeBoolean(value: FormDataEntryValue | null, fallback = false) {
  if (value === null) return fallback;
  return String(value) === "true";
}

function normalizeCategory(value: FormDataEntryValue | null): ProjectCategory {
  return String(value || "") === "Commercial" ? "Commercial" : "Residential";
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function toProjectResponse(project: {
  id: string;
  title_he: string;
  title_ar: string | null;
  description_he: string | null;
  description_ar: string | null;
  category: string;
  location: string | null;
  image: string | null;
  gallery: unknown;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
}) {
  const galleryImages = Array.isArray(project.gallery)
    ? project.gallery.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id: project.id,
    title_he: project.title_he,
    title_ar: project.title_ar || "",
    description_he: project.description_he || "",
    description_ar: project.description_ar || "",
    category: project.category,
    location: project.location || "",
    image: project.image || "",
    galleryImages,
    isPublished: project.isPublished,
    isFeatured: project.isFeatured,
    createdAt: project.createdAt.toISOString(),
  };
}

async function uploadProjectImage(file: File) {
  const safeName = file.name.replace(/[^\w.-]/g, "-");
  const filePath = `projects/${Date.now()}-${safeName}`;
  const { error } = await supabaseAdmin.storage.from(PROJECTS_BUCKET).upload(filePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from(PROJECTS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

async function readProjectForm(req: Request) {
  const formData = await req.formData();
  const imageFile = formData.get("imageFile");
  const uploadedImage = imageFile instanceof File && imageFile.size > 0 ? await uploadProjectImage(imageFile) : "";
  const galleryFiles = formData.getAll("galleryFiles").filter((value): value is File => value instanceof File && value.size > 0);
  const uploadedGallery = await Promise.all(galleryFiles.map((file) => uploadProjectImage(file)));
  const existingGalleryRaw = normalizeText(formData.get("galleryImages"));
  const existingGallery = existingGalleryRaw
    ? (JSON.parse(existingGalleryRaw) as unknown[]).filter((item): item is string => typeof item === "string")
    : [];
  const title_he = normalizeText(formData.get("title_he"));

  if (!title_he) {
    throw new Error("Missing Hebrew project title.");
  }

  return {
    id: normalizeText(formData.get("id")),
    title_he,
    title_ar: normalizeText(formData.get("title_ar")) || null,
    description_he: normalizeText(formData.get("description_he")) || null,
    description_ar: normalizeText(formData.get("description_ar")) || null,
    category: normalizeCategory(formData.get("category")),
    location: normalizeText(formData.get("location")) || null,
    image: uploadedImage || normalizeText(formData.get("image")) || null,
    gallery: [...existingGallery, ...uploadedGallery],
    isPublished: normalizeBoolean(formData.get("isPublished"), true),
    isFeatured: normalizeBoolean(formData.get("isFeatured"), false),
  };
}

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return Response.json(projects.map(toProjectResponse));
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await readProjectForm(req);
    const project = await prisma.project.create({
      data: {
        title_he: body.title_he,
        title_ar: body.title_ar,
        description_he: body.description_he,
        description_ar: body.description_ar,
        category: body.category,
        location: body.location,
        image: body.image,
        gallery: body.gallery,
        isPublished: body.isPublished,
        isFeatured: body.isFeatured,
      },
    });

    return Response.json(toProjectResponse(project));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Create project failed" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await readProjectForm(req);

    if (!body.id) {
      return Response.json({ error: "Missing project id." }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        title_he: body.title_he,
        title_ar: body.title_ar,
        description_he: body.description_he,
        description_ar: body.description_ar,
        category: body.category,
        location: body.location,
        image: body.image,
        gallery: body.gallery,
        isPublished: body.isPublished,
        isFeatured: body.isFeatured,
      },
    });

    return Response.json(toProjectResponse(project));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Update project failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await req.json()) as { id?: string };

  if (!id) {
    return Response.json({ error: "Missing project id." }, { status: 400 });
  }

  await prisma.project.delete({ where: { id } });
  return Response.json({ ok: true, id });
}
