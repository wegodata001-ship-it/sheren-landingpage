import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import ServiceCard from "@/components/ui/ServiceCard";
import { siteContent } from "@/data/siteContent";

import styles from "./ServicesSection.module.css";

export default function ServicesSection() {
  return (
    <AnimatedSection id="services" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow="שירותים"
            title={siteContent.services.title}
            description={siteContent.services.intro}
            align="center"
          />
        </Reveal>
        <div className={styles.grid}>
          {siteContent.services.items.map((service, index) => (
            <Reveal key={service.title} delay={0.1 + index * 0.1}>
              <ServiceCard index={index} {...service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
