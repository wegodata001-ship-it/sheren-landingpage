"use client";

import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./ServiceCard.module.css";

type ServiceCardProps = {
  index?: number;
  title: string;
  description: string;
  points: string[];
};

function getIcon(index: number) {
  switch (index % 5) {
    case 0:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 18L12 4L20 18" />
          <path d="M7.5 14h9" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 17l5-5 4 4 7-8" />
          <path d="M15 8h5v5" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19h16" />
          <path d="M7 16V8h10v8" />
          <path d="M10 8V5h4v3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4l7 4v8l-7 4-7-4V8z" />
          <path d="M12 8v8M8.5 10l7 4" />
        </svg>
      );
  }
}

export default function ServiceCard({ index = 0, title, description, points }: ServiceCardProps) {
  const { t } = useLanguage();
  const badgeNumber = String(index + 1).padStart(2, "0");

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>{getIcon(index)}</div>
        <div className={styles.badge}>
          {t.serviceCard.badgePrefix} {badgeNumber}
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.points}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  );
}
