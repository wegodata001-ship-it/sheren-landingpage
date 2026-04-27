"use client";

import Container from "@/components/ui/Container";
import { siteConfig } from "@/data/siteConfig";
import { formatPhoneHref, getYear } from "@/lib/helpers";
import { useLanguage } from "@/lib/i18n/use-language";
import type { PublicSiteData } from "@/lib/site-settings";

import styles from "./Footer.module.css";

type FooterProps = {
  settings?: PublicSiteData;
};

export default function Footer({ settings }: FooterProps) {
  const { t } = useLanguage();
  const businessName = settings?.businessName || siteConfig.businessName;
  const phoneNumber = settings?.phoneNumber || siteConfig.phoneNumber;
  const email = settings?.email || siteConfig.email;
  const address = settings?.address || siteConfig.address;

  const socialLinks = [
    { label: t.social.instagram, href: siteConfig.instagramUrl },
    { label: t.social.facebook, href: siteConfig.facebookUrl },
    { label: t.footer.socialTiktok, href: siteConfig.tiktokUrl },
    { label: t.footer.socialLinkedin, href: siteConfig.linkedinUrl },
  ].filter((item) => item.href);

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandBlock}>
          <h2 className={styles.brandName}>{businessName}</h2>
          <p className={styles.text}>{t.footer.text}</p>
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
          <span>
            {getYear()} {businessName}. {t.footer.rights}
          </span>
          <span>{t.footer.bottomTagline}</span>
        </div>
      </Container>
    </footer>
  );
}
