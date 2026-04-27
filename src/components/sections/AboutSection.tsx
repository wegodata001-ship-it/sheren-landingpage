import Image from "next/image";

import Container from "@/components/ui/Container";
import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteContent } from "@/data/siteContent";
import { siteConfig } from "@/data/siteConfig";
import type { PublicSiteData } from "@/lib/site-settings";

import styles from "./AboutSection.module.css";

type AboutSectionProps = {
  settings?: PublicSiteData;
};

export default function AboutSection({ settings }: AboutSectionProps) {
  const businessName = settings?.businessName || siteConfig.businessName;
  const aboutTitle = settings?.aboutTitle || siteContent.about.title;
  const aboutDescription = settings?.aboutDescription || siteContent.about.description;
  const aboutSecondaryDescription =
    settings?.aboutSecondaryDescription || siteContent.about.secondaryDescription;
  const aboutImage = settings?.aboutImage || siteConfig.aboutImage;
  const aboutSecondaryImage = settings?.aboutSecondaryImage || settings?.heroImage || siteConfig.heroImage;
  const highlights = siteContent.about.highlights.slice(0, 2);

  return (
    <AnimatedSection id="about" className={styles.section}>
      <Container>
        <div className={styles.panel}>
          <div className={styles.grid}>
            <div className={styles.content}>
              <Reveal>
                <span className={styles.kicker}>הסיפור שמאחורי הגישה</span>
              </Reveal>
              <Reveal delay={0.1}>
                <SectionTitle title={aboutTitle} description={aboutDescription} />
              </Reveal>
              <Reveal delay={0.2}>
                <p className={styles.secondary}>{aboutSecondaryDescription}</p>
              </Reveal>
              <Reveal delay={0.28}>
                <ul className={styles.highlights}>
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className={styles.mediaColumn} delay={0.24} x={24}>
              <div className={styles.collage}>
                <div className={styles.mediaCard}>
                  <div className={styles.mediaLabel}>אדריכלות + עיצוב + נגישות</div>
                  <Image
                    src={aboutImage}
                    alt={`${businessName} about`}
                    width={680}
                    height={680}
                    className={styles.image}
                  />
                </div>
                <div className={styles.secondaryCard}>
                  <Image
                    src={aboutSecondaryImage}
                    alt={`${businessName} studio style`}
                    width={320}
                    height={320}
                    className={styles.secondaryImage}
                  />
                </div>
                <div className={styles.infoTile}>
                  <span>26+ שנות ניסיון</span>
                  <strong>שפה תכנונית חמה, נקייה ומדויקת לבתים אמיתיים.</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  );
}
