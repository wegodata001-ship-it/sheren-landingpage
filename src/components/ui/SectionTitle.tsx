import styles from "./SectionTitle.module.css";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "light";
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
}: SectionTitleProps) {
  return (
    <div className={[styles.wrapper, styles[align], styles[tone]].join(" ")}>
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
