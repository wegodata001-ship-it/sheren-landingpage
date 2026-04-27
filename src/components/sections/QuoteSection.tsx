"use client";

import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./QuoteSection.module.css";

export default function QuoteSection() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className={styles.section}>
      <Container>
        <Reveal className={styles.panel}>
          <p className={styles.quote}>&quot;{t.quote.text}&quot;</p>
          <p className={styles.subtext}>{t.quote.subtext}</p>
        </Reveal>
      </Container>
    </AnimatedSection>
  );
}
