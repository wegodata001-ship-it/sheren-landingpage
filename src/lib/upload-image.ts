import { supabaseAdmin } from "@/lib/supabase-admin";

export const IMAGE_BUCKET = "photosheren";

function safeFileName(name: string) {
  return name.replace(/[^\w.-]/g, "-");
}

export async function uploadImage(file: File, folder: string) {
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const filePath = `${normalizedFolder}/${Date.now()}-${safeFileName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();
  const contentType = file.type || "image/jpeg";

  console.log("FILE TYPE:", file.type);

  console.log("[uploadImage] start", {
    bucket: IMAGE_BUCKET,
    filePath,
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const { data, error } = await supabaseAdmin.storage.from(IMAGE_BUCKET).upload(filePath, arrayBuffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error("UPLOAD ERROR:", error);
    console.error("[uploadImage] failed", {
      bucket: IMAGE_BUCKET,
      filePath,
      message: error.message,
    });
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);

  console.log("[uploadImage] success", {
    bucket: IMAGE_BUCKET,
    storagePath: data?.path || null,
    filePath,
    publicUrl: publicUrlData.publicUrl,
  });

  return {
    filePath,
    publicUrl: publicUrlData.publicUrl,
  };
}
