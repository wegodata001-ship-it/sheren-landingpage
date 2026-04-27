"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/lib/i18n/use-language";

import styles from "./AccessibilityButton.module.css";

type AccessibilityState = {
  largeText: boolean;
  highContrast: boolean;
  underlineLinks: boolean;
  grayscale: boolean;
  reduceMotion: boolean;
};

const STORAGE_KEY = "accessibility-preferences";

const defaultState: AccessibilityState = {
  largeText: false,
  highContrast: false,
  underlineLinks: false,
  grayscale: false,
  reduceMotion: false,
};

const classMap: Record<keyof AccessibilityState, string> = {
  largeText: "accessibility-large-text",
  highContrast: "accessibility-high-contrast",
  underlineLinks: "accessibility-underline-links",
  grayscale: "accessibility-grayscale",
  reduceMotion: "accessibility-reduce-motion",
};

function applyPreferences(preferences: AccessibilityState) {
  const root = document.documentElement;

  (Object.keys(classMap) as Array<keyof AccessibilityState>).forEach((key) => {
    root.classList.toggle(classMap[key], preferences[key]);
  });
}

function AccessibilityMenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="5.5" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.75v5M8.5 12.75h7M10 21l2-6 2 6"
      />
    </svg>
  );
}

export default function AccessibilityButton() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityState>(defaultState);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? ({ ...defaultState, ...JSON.parse(saved) } as AccessibilityState) : defaultState;
      setPreferences(parsed);
      applyPreferences(parsed);
    } catch {
      applyPreferences(defaultState);
    }
  }, []);

  useEffect(() => {
    applyPreferences(preferences);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  const actions = useMemo(
    () =>
      [
        { key: "largeText" as const, label: t.accessibility.largeText },
        { key: "highContrast" as const, label: t.accessibility.highContrast },
        { key: "underlineLinks" as const, label: t.accessibility.underlineLinks },
        { key: "grayscale" as const, label: t.accessibility.grayscale },
        { key: "reduceMotion" as const, label: t.accessibility.reduceMotion },
      ] as const,
    [t.accessibility],
  );

  return (
    <div className={styles.wrapper}>
      {isOpen ? (
        <div id="accessibility-panel" className={styles.panel} role="dialog" aria-label={t.accessibility.panelAria}>
          <div className={styles.panelHeader}>
            <strong>{t.accessibility.panelTitle}</strong>
            <button type="button" className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label={t.accessibility.closeAria}>
              {t.accessibility.close}
            </button>
          </div>

          <div className={styles.actions}>
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                className={[styles.actionButton, preferences[action.key] ? styles.actionButtonActive : ""].filter(Boolean).join(" ")}
                onClick={() =>
                  setPreferences((current) => ({
                    ...current,
                    [action.key]: !current[action.key],
                  }))
                }
                aria-pressed={preferences[action.key]}
              >
                {action.label}
              </button>
            ))}
          </div>

          <button type="button" className={styles.resetButton} onClick={() => setPreferences(defaultState)}>
            {t.accessibility.reset}
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={t.accessibility.openPanelAria}
        title={t.accessibility.triggerLabel}
        onClick={() => setIsOpen((current) => !current)}
      >
        <AccessibilityMenuIcon className={styles.triggerIcon} />
      </button>
    </div>
  );
}
