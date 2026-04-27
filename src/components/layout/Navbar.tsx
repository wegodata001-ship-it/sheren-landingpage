"use client";

import { useEffect, useState } from "react";

import Container from "@/components/ui/Container";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { siteConfig } from "@/data/siteConfig";
import type { PublicSiteData } from "@/lib/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./Navbar.module.css";

type NavbarProps = {
  settings?: PublicSiteData;
};

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const businessName = settings?.businessName || siteConfig.businessName;
  const tagline = settings?.tagline || siteConfig.tagline;
  const whatsappNumber = settings?.whatsappNumber || siteConfig.whatsappNumber;
  const whatsappLink = buildWhatsAppLink(
    whatsappNumber,
    siteConfig.defaultWhatsAppMessage,
  );

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsOpen(false);
      }
    };

    window.addEventListener("hashchange", closeMenu);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("hashchange", closeMenu);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className={[styles.header, isScrolled ? styles.scrolled : ""].filter(Boolean).join(" ")}>
      <Container className={styles.inner}>
        <a className={styles.brand} href="#hero" aria-label={`מעבר לראש הדף של ${businessName}`}>
          <div>
            <strong>{businessName}</strong>
            <span>{tagline}</span>
          </div>
        </a>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={isOpen}
          aria-label="פתיחת תפריט"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={[styles.menu, isOpen ? styles.open : ""].filter(Boolean).join(" ")}>
          <nav className={styles.nav}>
            {siteConfig.navigation.map((item) => (
              <a key={item.href} className={styles.link} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
          <PrimaryButton href={whatsappLink} target="_blank" rel="noreferrer">
            לתיאום שיחה
          </PrimaryButton>
        </div>
      </Container>
    </header>
  );
}
