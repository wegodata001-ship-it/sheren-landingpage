"use client";

import type { ProjectItem } from "./types";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: ProjectItem;
  onClick?: (project: ProjectItem) => void;
  onSelect?: (project: ProjectItem) => void;
  locale?: "he" | "ar";
};

export default function ProjectCard({ project, onClick, onSelect, locale = "he" }: ProjectCardProps) {
  const title = locale === "ar" && project.title_ar ? project.title_ar : project.title_he;

  return (
    <button type="button" className={styles.card} onClick={() => (onSelect || onClick)?.(project)}>
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt={title} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>PROJECT</div>
      )}

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{project.category}</p>
      </div>

      <div className={styles.arrow} aria-hidden="true">
        →
      </div>
      {project.isFeatured ? <div className={styles.badge}>FEATURED</div> : null}
      <span className={styles.status} data-published={project.isPublished} aria-label={project.isPublished ? "Published" : "Draft"} />
    </button>
  );
}
