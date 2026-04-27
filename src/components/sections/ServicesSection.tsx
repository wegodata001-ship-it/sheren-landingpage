"use client";

import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import ServiceCard from "@/components/ui/ServiceCard";
import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./ServicesSection.module.css";

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <AnimatedSection id="services" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle eyebrow={t.services.eyebrow} title={t.services.title} description={t.services.intro} align="center" />
        </Reveal>
        <div className={styles.grid}>
          {t.services.items.map((service, index) => (
            <Reveal key={service.id} delay={0.1 + index * 0.1}>
              <ServiceCard index={index} {...service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
