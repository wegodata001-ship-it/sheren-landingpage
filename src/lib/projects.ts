import { unstable_noStore as noStore } from "next/cache";

import { siteContent, type ProjectItem } from "@/data/siteContent";

import { prisma } from "./prisma";

export type PublicProject = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  size: ProjectItem["size"];
};

export async function ensureProjectsSeeded() {
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

  const projects = await ensureProjectsSeeded();

  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    imageUrl: project.imageUrl,
    size: project.size as ProjectItem["size"],
  }));
}
