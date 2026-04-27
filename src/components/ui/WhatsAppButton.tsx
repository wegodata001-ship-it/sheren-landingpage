import PrimaryButton from "@/components/ui/PrimaryButton";
import { siteConfig } from "@/data/siteConfig";
import type { PublicSiteData } from "@/lib/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./WhatsAppButton.module.css";

type WhatsAppButtonProps = {
  settings?: PublicSiteData;
};

export default function WhatsAppButton({ settings }: WhatsAppButtonProps) {
  const whatsappLink = buildWhatsAppLink(
    settings?.whatsappNumber || siteConfig.whatsappNumber,
    siteConfig.defaultWhatsAppMessage,
  );
  const socialLinks = [
    { label: "WhatsApp", href: whatsappLink, className: styles.buttonPrimary },
    { label: "Instagram", href: siteConfig.instagramUrl, className: styles.buttonSecondary },
    { label: "Facebook", href: siteConfig.facebookUrl, className: styles.buttonSecondary },
  ].filter((item) => item.href);

  return (
    <div className={styles.wrapper}>
      <div className={styles.stack}>
        {socialLinks.map((item) => (
          <PrimaryButton
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={[styles.button, item.className].join(" ")}
          >
            {item.label}
          </PrimaryButton>
        ))}
      </div>
    </div>
  );
}
