"use client";

import { useMemo } from "react";

import ProjectCard from "./ProjectCard";
import ProjectDrawer from "./ProjectDrawer";
import type { ProjectItem } from "./types";
import styles from "./ProjectsGrid.module.css";

type ProjectsGridProps = {
  projects: ProjectItem[];
  query: string;
  category: string;
  drawerOpen: boolean;
  activeProject: ProjectItem | null;
  onOpenDrawer: (project: ProjectItem | null) => void;
  onCloseDrawer: () => void;
  onProjectSaved: (project: ProjectItem) => void;
};

export default function ProjectsGrid({
  projects,
  query,
  category,
  drawerOpen,
  activeProject,
  onOpenDrawer,
  onCloseDrawer,
  onProjectSaved,
}: ProjectsGridProps) {
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.title_he.toLowerCase().includes(normalizedQuery) ||
        project.title_ar.toLowerCase().includes(normalizedQuery) ||
        project.category.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "All" || project.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, projects, query]);

  return (
    <>
      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={onOpenDrawer} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No projects found. Add a new premium project to start.</div>
      )}

      <ProjectDrawer open={drawerOpen} project={activeProject} onClose={onCloseDrawer} onSaved={onProjectSaved} />
    </>
  );
}
