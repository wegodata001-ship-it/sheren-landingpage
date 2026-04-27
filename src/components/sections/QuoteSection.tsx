import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import { siteContent } from "@/data/siteContent";

import styles from "./QuoteSection.module.css";

export default function QuoteSection() {
  return (
    <AnimatedSection className={styles.section}>
      <Container>
        <Reveal className={styles.panel}>
          <p className={styles.quote}>&quot;{siteContent.quote.text}&quot;</p>
          <p className={styles.subtext}>{siteContent.quote.subtext}</p>
        </Reveal>
      </Container>
    </AnimatedSection>
  );
}
