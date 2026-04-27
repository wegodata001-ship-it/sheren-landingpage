"use client";

import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./WhyChooseUsSection.module.css";

export default function WhyChooseUsSection() {
  const { t } = useLanguage();

  return (
    <AnimatedSection id="process" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle eyebrow={t.process.eyebrow} title={t.process.title} description={t.process.intro} />
        </Reveal>
        <div className={styles.timeline}>
          {t.process.items.map((item, index) => (
            <Reveal key={item.id} className={styles.item} delay={0.1 + index * 0.1}>
              <article className={styles.card}>
                <span className={styles.icon}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.copy}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
