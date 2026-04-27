"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AccessibilityButton() {
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
    () => [
      { key: "largeText", label: "הגדלת טקסט" },
      { key: "highContrast", label: "ניגודיות גבוהה" },
      { key: "underlineLinks", label: "הדגשת קישורים" },
      { key: "grayscale", label: "גווני אפור" },
      { key: "reduceMotion", label: "עצירת אנימציות" },
    ] as const,
    [],
  );

  return (
    <div className={styles.wrapper}>
      {isOpen ? (
        <div id="accessibility-panel" className={styles.panel} role="dialog" aria-label="אפשרויות נגישות">
          <div className={styles.panelHeader}>
            <strong>נגישות</strong>
            <button type="button" className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="סגירת פאנל נגישות">
              סגירה
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
            איפוס הגדרות
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label="פתיחת אפשרויות נגישות"
        onClick={() => setIsOpen((current) => !current)}
      >
        נגישות
      </button>
    </div>
  );
}
