import Container from "@/components/ui/Container";
import { siteContent } from "@/data/siteContent";
import { siteConfig } from "@/data/siteConfig";

import styles from "./PromoBar.module.css";

export default function PromoBar() {
  if (!siteConfig.sectionVisibility.promoBar) {
    return null;
  }

  return (
    <div className={styles.bar}>
      <Container className={styles.inner}>
        <p className={styles.text}>{siteContent.promoBar.text}</p>
        <a className={styles.link} href={siteContent.promoBar.href}>
          {siteContent.promoBar.linkLabel}
        </a>
      </Container>
    </div>
  );
}
