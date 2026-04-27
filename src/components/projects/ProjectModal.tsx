"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/lib/i18n/use-language";
import type { PublicProject } from "@/lib/project-types";
import { pickProjectLang } from "@/lib/project-types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./ProjectModal.module.css";

type ProjectModalProps = {
  project: PublicProject | null;
  whatsappNumber: string;
  onClose: () => void;
};

export default function ProjectModal({ project, whatsappNumber, onClose }: ProjectModalProps) {
  const { t, locale } = useLanguage();
  const copy = t.projectsSection;
  const [activeIndex, setActiveIndex] = useState(0);

  const allImageUrls = useMemo(() => {
    if (!project) {
      return [];
    }

    const urls = [project.coverImageUrl, ...project.galleryImages.map((g) => g.url)].filter(Boolean);
    return [...new Set(urls)];
  }, [project]);

  const title = project ? pickProjectLang(project.title, locale) : "";
  const category = project ? pickProjectLang(project.category, locale) : "";
  const shortRaw = project ? pickProjectLang(project.shortDescription, locale).trim() : "";
  const fullRaw = project ? pickProjectLang(project.fullDescription, locale).trim() : "";
  const bodyText = fullRaw || shortRaw || title;
  const location = project?.location ? pickProjectLang(project.location, locale) : "";
  const style = project?.style ? pickProjectLang(project.style, locale) : "";
  const year = project?.year?.trim() || "";

  const whatsappHref = useMemo(() => {
    if (!project) {
      return "";
    }

    const message =
      locale === "ar"
        ? `مرحبًا، أنا مهتم بمشروع: ${title}`
        : `היי, אשמח לשמוע עוד לגבי פרויקט דומה ל־«${title}»`;
    return buildWhatsAppLink(whatsappNumber || siteConfig.whatsappNumber, message);
  }, [project, title, locale, whatsappNumber]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (allImageUrls.length ? (i - 1 + allImageUrls.length) % allImageUrls.length : 0));
  }, [allImageUrls.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (allImageUrls.length ? (i + 1) % allImageUrls.length : 0));
  }, [allImageUrls.length]);

  useEffect(() => {
    if (!project) {
      return;
    }

    setActiveIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        goPrev();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, goPrev, goNext]);

  if (!project) {
    return null;
  }

  const mainSrc = allImageUrls[activeIndex] || project.coverImageUrl;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} aria-label={copy.modalCloseAria} onClick={onClose}>
          ×
        </button>

        <div className={styles.mediaPane}>
          <div className={styles.hero}>
            {mainSrc ? (
              <Image src={mainSrc} alt="" fill className={styles.heroImage} sizes="(max-width: 760px) 92vw, 440px" priority unoptimized />
            ) : null}
            {allImageUrls.length > 1 ? (
              <>
                <button type="button" className={[styles.navBtn, styles.navPrev].join(" ")} aria-label={copy.previousLabel} onClick={goPrev}>
                  ‹
                </button>
                <button type="button" className={[styles.navBtn, styles.navNext].join(" ")} aria-label={copy.nextLabel} onClick={goNext}>
                  ›
                </button>
              </>
            ) : null}
          </div>

          {allImageUrls.length > 1 ? (
            <div className={styles.gallery} aria-label={copy.modalGalleryAria}>
              <div className={styles.thumbTrack}>
                {allImageUrls.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    className={[styles.thumbBtn, index === activeIndex ? styles.thumbActive : ""].filter(Boolean).join(" ")}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Image src={url} alt="" width={72} height={72} className={styles.thumbImg} unoptimized />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.body}>
          <span className={styles.tag}>{category}</span>
          <h2 id="project-modal-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.description}>{bodyText}</p>

          {(location || year || style) && (
            <div className={styles.metaGrid}>
              <strong>{copy.modalDetailsLabel}</strong>
              <dl className={styles.metaList}>
                {location ? (
                  <>
                    <dt>{copy.modalLocation}</dt>
                    <dd>{location}</dd>
                  </>
                ) : null}
                {year ? (
                  <>
                    <dt>{copy.modalYear}</dt>
                    <dd>{year}</dd>
                  </>
                ) : null}
                {style ? (
                  <>
                    <dt>{copy.modalStyle}</dt>
                    <dd>{style}</dd>
                  </>
                ) : null}
              </dl>
            </div>
          )}

          <div className={styles.footer}>
            <a className={styles.whatsapp} href={whatsappHref} target="_blank" rel="noreferrer">
              {copy.modalWhatsappCta}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
