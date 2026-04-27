"use client";

import { FormEvent, useState } from "react";

import Container from "@/components/ui/Container";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteContent } from "@/data/siteContent";
import { siteConfig } from "@/data/siteConfig";
import { formatPhoneHref } from "@/lib/helpers";
import type { PublicSiteData } from "@/lib/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./ContactSection.module.css";

type ContactSectionProps = {
  settings?: PublicSiteData;
};

export default function ContactSection({ settings }: ContactSectionProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showWhatsApp = siteConfig.contactMode === "whatsapp" || siteConfig.contactMode === "both";
  const showForm = siteConfig.contactMode === "form" || siteConfig.contactMode === "both";
  const phoneNumber = settings?.phoneNumber || siteConfig.phoneNumber;
  const whatsappNumber = settings?.whatsappNumber || siteConfig.whatsappNumber;
  const email = settings?.email || siteConfig.email;
  const address = settings?.address || siteConfig.address;
  const whatsappLink = buildWhatsAppLink(
    whatsappNumber,
    siteConfig.defaultWhatsAppMessage,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; message: string };
      setStatusMessage(data.message);

      if (response.ok) {
        form.reset();
      }
    } catch {
      setStatusMessage("משהו השתבש בשליחת הפנייה. נסו שוב בעוד רגע.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedSection id="contact" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow="Contact"
            title={siteContent.contact.title}
            description={siteContent.contact.description}
          />
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.infoPanel}>
            <div className={styles.infoCard}>
              <h3>טלפון או מייל</h3>
              <a href={formatPhoneHref(phoneNumber)}>{phoneNumber}</a>
              <a href={`mailto:${email}`}>{email}</a>
              <p>{address}</p>
            </div>

            {showWhatsApp ? (
              <div className={styles.infoCard}>
                <h3>{siteContent.contact.whatsappTitle}</h3>
                <p>{siteContent.contact.whatsappDescription}</p>
                <PrimaryButton href={whatsappLink} target="_blank" rel="noreferrer">
                  לפתיחת שיחה
                </PrimaryButton>
              </div>
            ) : null}
          </Reveal>

          {showForm ? (
            <Reveal className={styles.formCard} delay={0.12} x={24}>
              <div className={styles.formIntro}>
                <h3>{siteContent.contact.formTitle}</h3>
                <p>{siteContent.contact.formDescription}</p>
              </div>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  שם מלא
                  <input type="text" name="name" placeholder="איך קוראים לכם?" required />
                </label>
                <label>
                  כתובת מייל
                  <input type="email" name="email" placeholder="name@example.com" required />
                </label>
                <label>
                  טלפון
                  <input type="tel" name="phone" placeholder="לא חובה, אבל מומלץ" />
                </label>
                <label>
                  ספרו על הפרויקט
                  <textarea name="message" placeholder="מה אתם מתכננים? בית פרטי, שיפוץ, רישוי או עיצוב?" rows={5} required />
                </label>
                <button type="submit" className={styles.submitButton}>
                  {isSubmitting ? "שולחים..." : "שליחת פנייה"}
                </button>
                {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}
              </form>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </AnimatedSection>
  );
}
