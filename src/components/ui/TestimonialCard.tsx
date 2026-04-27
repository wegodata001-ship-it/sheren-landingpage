import Image from "next/image";

import styles from "./TestimonialCard.module.css";

type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

export default function TestimonialCard({
  quote,
  name,
  role,
  company,
  avatar,
}: TestimonialCardProps) {
  return (
    <article className={styles.card}>
      <p className={styles.quote}>&quot;{quote}&quot;</p>
      <div className={styles.author}>
        <Image className={styles.avatar} src={avatar} alt={name} width={56} height={56} />
        <div>
          <strong className={styles.name}>{name}</strong>
          <span className={styles.meta}>
            {role}, {company}
          </span>
        </div>
      </div>
    </article>
  );
}
