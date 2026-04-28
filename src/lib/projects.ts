import { unstable_noStore as noStore } from "next/cache";

import { siteContent, type ProjectItem } from "@/data/siteContent";
import { getMergedLocalizedContent } from "@/lib/localized-content";
import { mapProjectToPublic } from "@/lib/project-mapper";
import type { ProjectRecord, PublicProject } from "@/lib/project-types";

import { prisma } from "./prisma";

export type { PublicProject } from "@/lib/project-types";
export { pickProjectLang } from "@/lib/project-types";

export async function ensureProjectsSeeded(): Promise<ProjectRecord[]> {
  const projects = await prisma.project.findMany({
    orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
  });

  if (projects.length) {
    return projects;
  }

  await prisma.project.createMany({
    data: siteContent.projects.items.map((item, index) => ({
      title: item.title,
      category: item.category,
      imageUrl: item.image,
      imagePath: "",
      size: item.size,
      orderIndex: index,
    })),
  });

  return prisma.project.findMany({
    orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
  });
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  noStore();

  const [settings, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    ensureProjectsSeeded(),
  ]);

  const localized = getMergedLocalizedContent(settings?.localizedContent);

  return projects.map((project, index) => mapProjectToPublic(project, index, localized));
}
