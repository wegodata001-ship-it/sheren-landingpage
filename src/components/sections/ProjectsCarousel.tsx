"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import ProjectModal from "@/components/projects/ProjectModal";
import { useLanguage } from "@/lib/i18n/use-language";
import { pickProjectLang, type PublicProject } from "@/lib/project-types";

import styles from "./ProjectsCarousel.module.css";

type ProjectsCarouselProps = {
  projects: PublicProject[];
  whatsappNumber: string;
};

export default function ProjectsCarousel({ projects, whatsappNumber }: ProjectsCarouselProps) {
  const { t, locale } = useLanguage();
  const copy = t.projectsSection;
  const trackRef = useRef<HTMLDivElement>(null);
  const [openProject, setOpenProject] = useState<PublicProject | null>(null);

  function scrollByOffset(direction: "next" | "prev") {
    const element = trackRef.current;

    if (!element) {
      return;
    }

    const amount = Math.max(element.clientWidth * 0.88, 280);
    const isRTL = window.getComputedStyle(element).direction === "rtl";
    const delta = direction === "next" ? amount : -amount;
    element.scrollBy({
      left: isRTL ? -delta : delta,
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.wrapper}>
      <ProjectModal project={openProject} whatsappNumber={whatsappNumber} onClose={() => setOpenProject(null)} />

      <div className={styles.toolbar}>
        <p className={styles.helper}>{copy.helper}</p>
        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={() => scrollByOffset("next")} aria-label={copy.nextLabel}>
            {copy.nextLabel}
          </button>
          <button type="button" className={styles.control} onClick={() => scrollByOffset("prev")} aria-label={copy.previousLabel}>
            {copy.previousLabel}
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.track}>
        {projects.map((project) => {
          const title = pickProjectLang(project.title, locale);
          const category = pickProjectLang(project.category, locale);
          const excerptRaw = pickProjectLang(project.shortDescription, locale).trim();
          const excerpt = excerptRaw || title;

          return (
            <article key={project.id} className={styles.card}>
              <button type="button" className={styles.cardHit} onClick={() => setOpenProject(project)} aria-haspopup="dialog">
                <div className={styles.imageWrap}>
                  <Image
                    src={project.coverImageUrl}
                    alt={title}
                    fill
                    unoptimized
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 70vw, 38vw"
                    className={styles.image}
                  />
                </div>

                <div className={styles.content}>
                  <span className={styles.tag}>{category}</span>
                  <h3>{title}</h3>
                  <p className={styles.excerpt}>{excerpt}</p>
                  <span className={styles.viewLink}>{copy.viewProject}</span>
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
