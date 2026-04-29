"use client";

import { FormEvent, useState } from "react";

import Container from "@/components/ui/Container";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { AnimatedSection, Reveal } from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteConfig } from "@/data/siteConfig";
import { formatPhoneHref } from "@/lib/helpers";
import { useLanguage } from "@/lib/i18n/use-language";
import { PROJECTS } from "@/lib/projects";
import type { PublicSiteData } from "@/lib/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import styles from "./ContactSection.module.css";

type ContactSectionProps = {
  settings?: PublicSiteData;
};

type ContactResponse = {
  ok: boolean;
  code?: "VALIDATION" | "SUCCESS" | "SERVER";
  message?: string;
};

export default function ContactSection({ settings }: ContactSectionProps) {
  const { t } = useLanguage();
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showWhatsApp = siteConfig.contactMode === "whatsapp" || siteConfig.contactMode === "both";
  const showForm = siteConfig.contactMode === "form" || siteConfig.contactMode === "both";
  const phoneNumber = settings?.phoneNumber || siteConfig.phoneNumber;
  const whatsappNumber = settings?.whatsappNumber || siteConfig.whatsappNumber;
  const email = settings?.email || siteConfig.email;
  const address = settings?.address || siteConfig.address;
  const whatsappLink = buildWhatsAppLink(whatsappNumber, siteConfig.defaultWhatsAppMessage);

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
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          project_key: PROJECTS.SHIRIN,
        }),
      });

      const data = (await response.json()) as ContactResponse;

      if (data.code === "VALIDATION") {
        setStatusMessage(t.contact.api.validation);
      } else if (data.code === "SUCCESS") {
        setStatusMessage(t.contact.api.success);
      } else if (data.code === "SERVER") {
        setStatusMessage(t.contact.api.server);
      } else if (data.message) {
        setStatusMessage(data.message);
      } else {
        setStatusMessage(response.ok ? t.contact.api.success : t.contact.api.server);
      }

      if (response.ok) {
        form.reset();
      }
    } catch {
      setStatusMessage(t.contact.api.network);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedSection id="contact" className={styles.section}>
      <Container>
        <Reveal>
          <SectionTitle eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.infoPanel}>
            <div className={styles.infoCard}>
              <h3>{t.contact.infoTitle}</h3>
              <a href={formatPhoneHref(phoneNumber)}>{phoneNumber}</a>
              <a href={`mailto:${email}`}>{email}</a>
              <p>{address}</p>
            </div>

            {showWhatsApp ? (
              <div className={styles.infoCard}>
                <h3>{t.contact.whatsappTitle}</h3>
                <p>{t.contact.whatsappDescription}</p>
                <PrimaryButton href={whatsappLink} target="_blank" rel="noreferrer">
                  {t.cta.secondaryButtonText}
                </PrimaryButton>
              </div>
            ) : null}
          </Reveal>

          {showForm ? (
            <Reveal className={styles.formCard} delay={0.12} x={24}>
              <div className={styles.formIntro}>
                <h3>{t.contact.formTitle}</h3>
                <p>{t.contact.formDescription}</p>
              </div>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  {t.contact.labels.name}
                  <input type="text" name="name" placeholder={t.contact.placeholders.name} required />
                </label>
                <label>
                  {t.contact.labels.email}
                  <input type="email" name="email" placeholder={t.contact.placeholders.email} required />
                </label>
                <label>
                  {t.contact.labels.phone}
                  <input type="tel" name="phone" placeholder={t.contact.placeholders.phone} />
                </label>
                <label>
                  {t.contact.labels.message}
                  <textarea name="message" placeholder={t.contact.placeholders.message} rows={5} required />
                </label>
                <button type="submit" className={styles.submitButton}>
                  {isSubmitting ? t.contact.labels.submitting : t.contact.labels.submit}
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
