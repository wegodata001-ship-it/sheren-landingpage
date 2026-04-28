"use client";

import { useEffect, useState } from "react";

import type { ProjectItem } from "./types";
import styles from "./ProjectPreview.module.css";

type ProjectPreviewProps = {
  project: ProjectItem | null;
  open: boolean;
  onClose: () => void;
  locale?: "he" | "ar";
};

export default function ProjectPreview({ project, open, onClose, locale = "he" }: ProjectPreviewProps) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (!zoomImage) {
          onClose();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, zoomImage]);

  useEffect(() => {
    if (!open) {
      setZoomImage(null);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [project?.id]);

  if (!open || !project) {
    return null;
  }

  const title = locale === "ar" && project.title_ar ? project.title_ar : project.title_he;
  const description = locale === "ar" && project.description_ar ? project.description_ar : project.description_he;
  const gallery = [project.image, ...(project.galleryImages || [])].filter((image): image is string => Boolean(image));
  const currentImage = gallery[activeIndex] || gallery[0];

  function goToImage(index: number) {
    if (!gallery.length) return;
    setActiveIndex((index + gallery.length) % gallery.length);
  }

  function goNext() {
    goToImage(activeIndex + 1);
  }

  function goPrev() {
    goToImage(activeIndex - 1);
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) return;
    const delta = touchStartX - clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    setTouchStartX(null);
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section className={styles.modal} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close project popup">
          ×
        </button>

        {currentImage ? (
          <div
            className={styles.mediaFrame}
            aria-label="Project image gallery"
            onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
            onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          >
            <button type="button" className={styles.mediaSlide} onClick={() => setZoomImage(currentImage)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentImage} alt={title} className={styles.image} />
            </button>

            {gallery.length > 1 ? (
              <>
                <button type="button" className={[styles.arrow, styles.arrowPrev].join(" ")} onClick={goPrev} aria-label="Previous image">
                  ‹
                </button>
                <button type="button" className={[styles.arrow, styles.arrowNext].join(" ")} onClick={goNext} aria-label="Next image">
                  ›
                </button>
              </>
            ) : null}
          </div>
        ) : null}

        <div className={styles.content}>
          <span className={styles.kicker}>{project.category}</span>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.meta}>{[project.location, project.category].filter(Boolean).join(" • ")}</div>

          {description ? <p className={styles.description}>{description}</p> : null}

          {gallery.length > 1 ? (
            <div className={styles.thumbnails}>
              {gallery.map((image, index) => (
                <button key={image} type="button" data-active={index === activeIndex} onClick={() => goToImage(index)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {zoomImage ? (
        <div className={styles.zoomOverlay}>
          <button type="button" className={styles.zoomClose} onClick={() => setZoomImage(null)} aria-label="Close fullscreen image">
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoomImage} alt={title} className={styles.zoomImage} />
        </div>
      ) : null}
    </div>
  );
}
