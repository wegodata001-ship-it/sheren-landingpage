"use client";

import { useRef } from "react";
import Image from "next/image";

import PrimaryButton from "@/components/ui/PrimaryButton";
import type { PublicProject } from "@/lib/projects";

import styles from "./ProjectsCarousel.module.css";

type ProjectsCarouselProps = {
  projects: PublicProject[];
};

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

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
      <div className={styles.toolbar}>
        <p className={styles.helper}>פרויקטים נבחרים בתצוגה נקייה ונוחה יותר לדסקטופ ולמובייל.</p>
        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={() => scrollByOffset("next")} aria-label="הפרויקט הבא">
            הבא
          </button>
          <button type="button" className={styles.control} onClick={() => scrollByOffset("prev")} aria-label="הפרויקט הקודם">
            הקודם
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.track}>
        {projects.map((project) => (
          <article key={project.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                unoptimized
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 70vw, 38vw"
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <span className={styles.tag}>{project.category}</span>
              <h3>{project.title}</h3>
              <PrimaryButton href="#contact" variant="outline">
                לדבר על פרויקט דומה
              </PrimaryButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
