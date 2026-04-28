"use client";

import { useState } from "react";

import ProjectsGrid from "./ProjectsGrid";
import type { ProjectItem } from "./types";
import styles from "./ProjectsDashboard.module.css";

const navItems = ["Dashboard", "Projects", "Services", "Blog", "Media", "Settings"];

type ProjectsDashboardProps = {
  initialProjects: ProjectItem[];
};

export default function ProjectsDashboard({ initialProjects }: ProjectsDashboardProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  function openDrawer(project: ProjectItem | null) {
    setActiveProject(project);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setActiveProject(null);
  }

  function handleProjectSaved(project: ProjectItem) {
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id);
      if (!exists) return [project, ...current];
      return current.map((item) => (item.id === project.id ? project : item));
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div>
            <div className={styles.brand}>
              <span className={styles.brandMark} aria-hidden="true" />
              <strong>Shirin Studio</strong>
              <span>Premium admin workspace for portfolio operations.</span>
            </div>

            <nav className={styles.nav} aria-label="Projects admin navigation">
              {navItems.map((item) => (
                <a key={item} href={item === "Projects" ? "/admin/projects" : "/admin"} className={styles.navItem} data-active={item === "Projects"}>
                  <span className={styles.navDot} aria-hidden="true" />
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.sidebarFooter}>Clean luxury dashboard. Dark sidebar, warm gold accents, minimal project controls.</div>
        </aside>

        <section className={styles.content}>
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <span className={styles.kicker}>Portfolio Management</span>
                <div className={styles.titleRow}>
                  <h1>Projects</h1>
                  <span className={styles.count}>({projects.length})</span>
                </div>
                <p>Manage Hebrew and Arabic project content, publishing state and premium cover images.</p>
              </div>
            </div>

            <div className={styles.toolbar}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={styles.search}
                placeholder="Search projects..."
              />
              <select value={category} onChange={(event) => setCategory(event.target.value)} className={styles.filter}>
                <option value="All">All</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              <button type="button" className={styles.addButton} onClick={() => openDrawer(null)}>
                + Add New Project
              </button>
            </div>
          </header>

          <ProjectsGrid
            projects={projects}
            query={query}
            category={category}
            drawerOpen={drawerOpen}
            activeProject={activeProject}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
            onProjectSaved={handleProjectSaved}
          />
        </section>
      </div>
    </main>
  );
}
