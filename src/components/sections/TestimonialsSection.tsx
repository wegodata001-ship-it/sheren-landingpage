import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteContent } from "@/data/siteContent";
import { getPublicProjects } from "@/lib/projects";

import ProjectsCarousel from "./ProjectsCarousel";
import styles from "./TestimonialsSection.module.css";

export default async function TestimonialsSection() {
  const projects = await getPublicProjects();

  return (
    <AnimatedSection id="projects" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow="פרויקטים / גלריה"
            title={siteContent.projects.title}
            description={siteContent.projects.intro}
            align="center"
          />
        </Reveal>
        <Reveal className={styles.content} delay={0.08}>
          <ProjectsCarousel projects={projects} />
        </Reveal>
      </Container>
    </AnimatedSection>
  );
}
