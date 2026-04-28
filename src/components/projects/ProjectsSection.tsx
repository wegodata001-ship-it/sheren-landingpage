"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/lib/i18n/use-language";

import ProjectCard from "./ProjectCard";
import ProjectPreview from "./ProjectPreview";
import type { ProjectItem } from "./types";
import styles from "./ProjectsSection.module.css";

const filters = [
  { label: "הכל", value: "All" },
  { label: "דירות", value: "Residential" },
  { label: "משרדים", value: "Commercial" },
  { label: "בתי יוקרה", value: "Featured" },
];

export default function ProjectsSection() {
  const { locale } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/projects")
      .then((response) => response.json())
      .then((data: ProjectItem[]) => {
        if (!isMounted) return;
        const normalized = Array.isArray(data)
          ? data.map((project) => ({
              ...project,
              galleryImages: Array.isArray(project.galleryImages) ? project.galleryImages : [],
            }))
          : [];
        setProjects(normalized);
        setSelected(normalized[0] || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setProjects([]);
        setSelected(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const title = locale === "ar" && project.title_ar ? project.title_ar : project.title_he;
      const description = locale === "ar" && project.description_ar ? project.description_ar : project.description_he;
      const matchesQuery =
        !normalizedQuery ||
        title.toLowerCase().includes(normalizedQuery) ||
        description.toLowerCase().includes(normalizedQuery) ||
        project.category.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        activeFilter === "All" ||
        project.category === activeFilter ||
        (activeFilter === "Featured" && project.isFeatured);
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, locale, projects, query]);

  const heroProject = selected || projects[0];
  const heroImage = heroProject?.image || "/images/hero/hero-placeholder.svg";

  function openProject(project: ProjectItem) {
    setSelected(project);
    setIsModalOpen(true);
  }

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>Premium Projects</span>
            <h1>הפרויקטים שלנו</h1>
            <p>עיצוב פנים ברמה אחרת. יוקרה, פונקציונליות ודיוק נפגשים בחוויית פרויקט נקייה ומרשימה.</p>
            <button
              type="button"
              className={styles.heroButton}
              onClick={() => document.getElementById("projects-grid")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              צפו בכל הפרויקטים
            </button>
          </div>

          <div className={styles.heroImageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className={styles.heroImage} />
          </div>
        </div>

        <div>
          <div className={styles.filters}>
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={styles.filterButton}
                data-active={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.search}
              placeholder="חיפוש פרויקט..."
            />
          </div>
        </div>

        <div id="projects-grid" className={styles.layout}>
          {filteredProjects.length ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={openProject} locale={locale} />
            ))
          ) : (
            <div className={styles.empty}>לא נמצאו פרויקטים מתאימים.</div>
          )}
        </div>
      </div>

      <ProjectPreview project={selected} open={isModalOpen} onClose={() => setIsModalOpen(false)} locale={locale} />
    </section>
  );
}
