import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { siteContent } from "@/data/siteContent";
import { siteConfig } from "@/data/siteConfig";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./CTASection.module.css";

export default function CTASection() {
  const whatsappLink = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    siteConfig.defaultWhatsAppMessage,
  );

  return (
    <AnimatedSection id="full-package" className={styles.section}>
      <Container>
        <div className={styles.panel}>
          <Reveal className={styles.content}>
            <span className={styles.eyebrow}>מעטפת מלאה</span>
            <h2>{siteContent.cta.title}</h2>
            <p>{siteContent.cta.description}</p>
          </Reveal>
          <Reveal className={styles.actions} delay={0.15} x={18}>
            <PrimaryButton href="#contact">{siteContent.cta.primaryButtonText}</PrimaryButton>
            <PrimaryButton href={whatsappLink} target="_blank" rel="noreferrer" variant="ghost">
              {siteContent.cta.secondaryButtonText}
            </PrimaryButton>
          </Reveal>
        </div>
      </Container>
    </AnimatedSection>
  );
}
