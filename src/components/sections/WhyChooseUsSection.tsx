import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteContent } from "@/data/siteContent";

import styles from "./WhyChooseUsSection.module.css";

export default function WhyChooseUsSection() {
  return (
    <AnimatedSection id="process" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow="תהליך העבודה"
            title={siteContent.whyChooseUs.title}
            description={siteContent.whyChooseUs.intro}
          />
        </Reveal>
        <div className={styles.timeline}>
          {siteContent.whyChooseUs.items.map((item, index) => (
            <Reveal key={item.title} className={styles.item} delay={0.1 + index * 0.1}>
              <article className={styles.card}>
                <div className={styles.icon}>{String(index + 1).padStart(2, "0")}</div>
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
