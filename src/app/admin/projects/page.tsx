import { redirect } from "next/navigation";

import ProjectsDashboard from "@/components/projects/ProjectsDashboard";
import type { ProjectItem } from "@/components/projects/types";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function toProjectItem(project: {
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
}): ProjectItem {
  const galleryImages = Array.isArray(project.gallery)
    ? project.gallery.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id: project.id,
    title_he: project.title_he,
    title_ar: project.title_ar || "",
    description_he: project.description_he || "",
    description_ar: project.description_ar || "",
    category: project.category === "Commercial" ? "Commercial" : "Residential",
    location: project.location || "",
    image: project.image || "",
    galleryImages,
    isPublished: project.isPublished,
    isFeatured: project.isFeatured,
    createdAt: project.createdAt.toISOString(),
  };
}

export default async function AdminProjectsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return <ProjectsDashboard initialProjects={projects.map(toProjectItem)} />;
}
