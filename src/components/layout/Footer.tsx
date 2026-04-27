import Container from "@/components/ui/Container";
import { siteContent } from "@/data/siteContent";
import { siteConfig } from "@/data/siteConfig";
import { formatPhoneHref, getYear } from "@/lib/helpers";
import type { PublicSiteData } from "@/lib/site-settings";

import styles from "./Footer.module.css";

const socialLinks = [
  { label: "Instagram", href: siteConfig.instagramUrl },
  { label: "Facebook", href: siteConfig.facebookUrl },
  { label: "TikTok", href: siteConfig.tiktokUrl },
  { label: "LinkedIn", href: siteConfig.linkedinUrl },
].filter((item) => item.href);

type FooterProps = {
  settings?: PublicSiteData;
};

export default function Footer({ settings }: FooterProps) {
  const businessName = settings?.businessName || siteConfig.businessName;
  const phoneNumber = settings?.phoneNumber || siteConfig.phoneNumber;
  const email = settings?.email || siteConfig.email;
  const address = settings?.address || siteConfig.address;

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandBlock}>
          <h2 className={styles.brandName}>{businessName}</h2>
          <p className={styles.text}>{siteContent.footer.text}</p>
        </div>

        <div className={styles.linksBlock}>
          <a href={formatPhoneHref(phoneNumber)}>{phoneNumber}</a>
          <a href={`mailto:${email}`}>{email}</a>
          <span>{address}</span>
        </div>

        <div className={styles.socialBlock}>
          {socialLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </Container>
      <Container>
        <div className={styles.bottomRow}>
          <span>{getYear()} {businessName}. כל הזכויות שמורות.</span>
          <span>אדריכלות, עיצוב פנים ורישוי בגישה אחת שלמה.</span>
        </div>
      </Container>
    </footer>
  );
}
