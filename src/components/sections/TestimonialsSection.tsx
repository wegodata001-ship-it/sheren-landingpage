"use client";

import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/use-language";
import type { PublicProject } from "@/lib/project-types";

import ProjectsCarousel from "./ProjectsCarousel";
import styles from "./TestimonialsSection.module.css";

type TestimonialsSectionProps = {
  projects: PublicProject[];
  whatsappNumber: string;
};

export default function TestimonialsSection({ projects, whatsappNumber }: TestimonialsSectionProps) {
  const { t } = useLanguage();

  return (
    <AnimatedSection id="projects" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow={t.projectsSection.eyebrow}
            title={t.projectsSection.title}
            description={t.projectsSection.intro}
            align="center"
          />
        </Reveal>
        <Reveal className={styles.content} delay={0.08}>
          <ProjectsCarousel projects={projects} whatsappNumber={whatsappNumber} />
        </Reveal>
      </Container>
    </AnimatedSection>
  );
}
