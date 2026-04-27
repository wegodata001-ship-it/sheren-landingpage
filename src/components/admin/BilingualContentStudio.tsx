"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { saveLocalizedContentAction } from "@/app/admin/actions";
import {
  contentSectionOrder,
  getMergedLocalizedContent,
  type LocalizedSiteContent,
  type SupportedLanguage,
} from "@/lib/localized-content";
import { translateText } from "@/lib/translateContent";

import styles from "./BilingualContentStudio.module.css";

type BilingualContentStudioProps = {
  initialContent: LocalizedSiteContent;
};

type PathPart = string | number;

function getValueAtPath(source: unknown, path: PathPart[]) {
  return path.reduce<unknown>((current, key) => {
    if (typeof key === "number" && Array.isArray(current)) {
      return current[key];
    }

    if (typeof key === "string" && typeof current === "object" && current !== null) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);
}

function setValueAtPath<T>(source: T, path: PathPart[], value: unknown): T {
  if (!path.length) {
    return value as T;
  }

  const [head, ...rest] = path;

  if (Array.isArray(source)) {
    const next = [...source];
    next[head as number] = setValueAtPath(next[head as number], rest, value);
    return next as T;
  }

  const next = { ...(source as Record<string, unknown>) };
  next[head as string] = setValueAtPath(next[head as string], rest, value);
  return next as T;
}

function countFilledStrings(value: unknown): { total: number; filled: number } {
  if (typeof value === "string") {
    return {
      total: 1,
      filled: value.trim() ? 1 : 0,
    };
  }

  if (Array.isArray(value)) {
    return value.reduce(
      (acc, item) => {
        const current = countFilledStrings(item);
        return {
          total: acc.total + current.total,
          filled: acc.filled + current.filled,
        };
      },
      { total: 0, filled: 0 },
    );
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).reduce(
      (acc, item) => {
        const current = countFilledStrings(item);
        return {
          total: acc.total + current.total,
          filled: acc.filled + current.filled,
        };
      },
      { total: 0, filled: 0 },
    );
  }

  return { total: 0, filled: 0 };
}

function countLanguageStrings(value: unknown, language: SupportedLanguage): { total: number; filled: number } {
  if (typeof value === "object" && value !== null && language in (value as Record<string, unknown>)) {
    return countFilledStrings((value as Record<string, unknown>)[language]);
  }

  if (Array.isArray(value)) {
    return value.reduce(
      (acc, item) => {
        const current = countLanguageStrings(item, language);
        return {
          total: acc.total + current.total,
          filled: acc.filled + current.filled,
        };
      },
      { total: 0, filled: 0 },
    );
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).reduce(
      (acc, item) => {
        const current = countLanguageStrings(item, language);
        return {
          total: acc.total + current.total,
          filled: acc.filled + current.filled,
        };
      },
      { total: 0, filled: 0 },
    );
  }

  return countFilledStrings(value);
}

async function deepTranslateArToHe(value: unknown): Promise<unknown> {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => deepTranslateArToHe(item)));
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if ("he" in obj && "ar" in obj) {
      const he = obj.he;
      const ar = obj.ar;

      if (Array.isArray(he) && Array.isArray(ar)) {
        const heArr = he as string[];
        const arArr = ar as string[];
        const nextHe = await Promise.all(
          arArr.map(async (arLine, i) => {
            const s = String(arLine ?? "").trim();
            if (!s) {
              return String(heArr[i] ?? "");
            }
            return translateText({ text: s, fromLang: "ar", toLang: "he" });
          }),
        );
        return { ...obj, he: nextHe, ar: arArr };
      }

      if (typeof he === "string" && typeof ar === "string") {
        if (!ar.trim()) {
          return { ...obj, he };
        }
        const translated = await translateText({
          text: ar,
          fromLang: "ar",
          toLang: "he",
        });
        return { ...obj, he: translated, ar };
      }
    }

    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      next[k] = await deepTranslateArToHe(v);
    }
    return next;
  }

  return value;
}

function DualField({
  label,
  valueHe,
  valueAr,
  onHe,
  onAr,
  multiline = false,
}: {
  label: string;
  valueHe: string;
  valueAr: string;
  onHe: (value: string) => void;
  onAr: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className={styles.dualField}>
      <span className={styles.dualFieldLabel}>{label}</span>
      <div className={styles.dualFieldRow}>
        <label className={styles.subField}>
          <span className={styles.subFieldLabel}>עברית</span>
          {multiline ? (
            <textarea
              dir="rtl"
              value={valueHe}
              rows={5}
              onChange={(event) => onHe(event.target.value)}
            />
          ) : (
            <input dir="rtl" value={valueHe} onChange={(event) => onHe(event.target.value)} />
          )}
        </label>
        <label className={styles.subField}>
          <span className={styles.subFieldLabel}>العربية</span>
          {multiline ? (
            <textarea
              dir="rtl"
              value={valueAr}
              rows={5}
              onChange={(event) => onAr(event.target.value)}
            />
          ) : (
            <input dir="rtl" value={valueAr} onChange={(event) => onAr(event.target.value)} />
          )}
        </label>
      </div>
    </div>
  );
}

export default function BilingualContentStudio({ initialContent }: BilingualContentStudioProps) {
  const [selectedSection, setSelectedSection] = useState<(typeof contentSectionOrder)[number]["key"]>("hero");
  const [previewLang, setPreviewLang] = useState<SupportedLanguage>("he");
  const [draftContent, setDraftContent] = useState(() => getMergedLocalizedContent(initialContent));
  const [statusMessage, setStatusMessage] = useState("");
  const [translationNotice, setTranslationNotice] = useState(
    "אין תרגום אוטומטי בין השפות. כל שפה נשמרת בנפרד.",
  );
  const [isTranslatingSection, setIsTranslatingSection] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasUnsavedChanges = statusMessage.includes("לא נשמרו") || statusMessage.includes("לא נשמר");
  const completeness = useMemo(() => {
    const he = countLanguageStrings(draftContent, "he");
    const ar = countLanguageStrings(draftContent, "ar");

    return {
      he: he.total ? Math.round((he.filled / he.total) * 100) : 0,
      ar: ar.total ? Math.round((ar.filled / ar.total) * 100) : 0,
    };
  }, [draftContent]);

  const activeSectionLabel = useMemo(
    () => contentSectionOrder.find((item) => item.key === selectedSection)?.label || "",
    [selectedSection],
  );

  useEffect(() => {
    const listener = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [hasUnsavedChanges]);

  const updateLocalizedString = useCallback((path: PathPart[], lang: SupportedLanguage, value: string) => {
    setDraftContent((current) => setValueAtPath(current, [...path, lang], value));
    setStatusMessage("יש שינויים שלא נשמרו.");
  }, []);

  const dual = useCallback(
    (label: string, path: PathPart[], multiline?: boolean) => {
      const valueHe = String(getValueAtPath(draftContent, [...path, "he"]) ?? "");
      const valueAr = String(getValueAtPath(draftContent, [...path, "ar"]) ?? "");
      return (
        <DualField
          key={`${label}-${path.join(".")}`}
          label={label}
          valueHe={valueHe}
          valueAr={valueAr}
          onHe={(value) => updateLocalizedString(path, "he", value)}
          onAr={(value) => updateLocalizedString(path, "ar", value)}
          multiline={multiline}
        />
      );
    },
    [draftContent, updateLocalizedString],
  );

  async function handleTranslateSectionArToHe() {
    if (
      !window.confirm(
        "למלא את השדות בעברית מתוך הערבית של הסקשן הנוכחי? הפעולה ידנית בלבד ולא מסנכרנת אוטומטית בעתיד.",
      )
    ) {
      return;
    }

    setIsTranslatingSection(true);
    try {
      const section = getValueAtPath(draftContent, [selectedSection]);
      const translated = await deepTranslateArToHe(section);
      setDraftContent((current) => setValueAtPath(current, [selectedSection], translated));
      setTranslationNotice("בדקו את העברית ידנית לפני פרסום.");
      setStatusMessage("העברית עודכנה מהתרגום. עדיין לא נשמר.");
    } finally {
      setIsTranslatingSection(false);
    }
  }

  function handleSectionChange(sectionKey: (typeof contentSectionOrder)[number]["key"]) {
    if (hasUnsavedChanges && !window.confirm("יש שינויים שלא נשמרו. להמשיך בכל זאת?")) {
      return;
    }

    setSelectedSection(sectionKey);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(draftContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "localized-content.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    file.text().then((text) => {
      const parsed = JSON.parse(text);
      setDraftContent(getMergedLocalizedContent(parsed));
      setStatusMessage("התרגומים יובאו לזיכרון. זכרו לשמור.");
    });
  }

  function handlePreview() {
    document.cookie = `site-language=${previewLang}; path=/; max-age=31536000; SameSite=Lax`;
    window.open("/", "_blank", "noopener,noreferrer");
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveLocalizedContentAction(draftContent);

      if (result?.ok) {
        setDraftContent(getMergedLocalizedContent(result.localizedContent));
        setStatusMessage("נשמר בהצלחה.");
      }
    });
  }

  function renderSectionFields() {
    switch (selectedSection) {
      case "hero":
        return (
          <>
            {dual("Eyebrow", ["hero", "eyebrow"])}
            {dual("Title", ["hero", "title"])}
            {dual("Subtitle", ["hero", "subtitle"], true)}
            {dual("Primary button", ["hero", "primaryButtonText"])}
            {dual("Secondary button", ["hero", "secondaryButtonText"])}
          </>
        );
      case "about":
        return (
          <>
            {dual("Kicker", ["about", "kicker"])}
            {dual("Title", ["about", "title"])}
            {dual("Description", ["about", "description"], true)}
            {dual("Secondary description", ["about", "secondaryDescription"], true)}
          </>
        );
      case "services":
        return (
          <>
            {dual("Section title", ["services", "title"])}
            {dual("Section intro", ["services", "intro"], true)}
            {draftContent.services.items.map((item, index) => (
              <div key={item.id} className={styles.groupCard}>
                <strong>
                  {item.title.he?.trim() || item.title.ar?.trim() || `Item ${index + 1}`}
                </strong>
                {dual("Item title", ["services", "items", index, "title"])}
                {dual("Item description", ["services", "items", index, "description"], true)}
              </div>
            ))}
          </>
        );
      case "process":
        return (
          <>
            {dual("Section title", ["process", "title"])}
            {dual("Section intro", ["process", "intro"], true)}
            {draftContent.process.items.map((item, index) => (
              <div key={item.id} className={styles.groupCard}>
                <strong>
                  {item.title.he?.trim() || item.title.ar?.trim() || `Step ${index + 1}`}
                </strong>
                {dual("Step title", ["process", "items", index, "title"])}
                {dual("Step description", ["process", "items", index, "description"], true)}
              </div>
            ))}
          </>
        );
      case "projectsSection":
        return (
          <>
            {dual("Section title", ["projectsSection", "title"])}
            {dual("Section intro", ["projectsSection", "intro"], true)}
            {dual("CTA button", ["projectsSection", "ctaLabel"])}
          </>
        );
      case "cta":
        return (
          <>
            {dual("Eyebrow", ["cta", "eyebrow"])}
            {dual("Title", ["cta", "title"])}
            {dual("Description", ["cta", "description"], true)}
            {dual("Primary button", ["cta", "primaryButtonText"])}
            {dual("Secondary button", ["cta", "secondaryButtonText"])}
          </>
        );
      case "contact":
        return (
          <>
            {dual("Title", ["contact", "title"])}
            {dual("Description", ["contact", "description"], true)}
            {dual("Form title", ["contact", "formTitle"])}
            {dual("Submit button", ["contact", "labels", "submit"])}
          </>
        );
      case "quote":
        return (
          <>
            {dual("Quote", ["quote", "text"], true)}
            {dual("Subtext", ["quote", "subtext"], true)}
          </>
        );
      case "footer":
        return (
          <>
            {dual("Footer text", ["footer", "text"], true)}
            {dual("Rights text", ["footer", "rights"])}
            {dual("Bottom tagline", ["footer", "bottomTagline"])}
          </>
        );
      case "seo":
        return (
          <>
            {dual("Page title", ["seo", "pageTitle"])}
            {dual("Page description", ["seo", "pageDescription"], true)}
            {dual("Open Graph title", ["seo", "openGraphTitle"])}
            {dual("Open Graph description", ["seo", "openGraphDescription"], true)}
          </>
        );
      default:
        return null;
    }
  }

  function renderPreview() {
    const L = previewLang;
    switch (selectedSection) {
      case "hero":
        return (
          <div className={styles.previewCard}>
            <span className={styles.previewEyebrow}>{draftContent.hero.eyebrow[L]}</span>
            <h3>{draftContent.hero.title[L]}</h3>
            <p>{draftContent.hero.subtitle[L]}</p>
            <button type="button" className={styles.previewButton}>
              {draftContent.hero.primaryButtonText[L]}
            </button>
          </div>
        );
      case "about":
        return (
          <div className={styles.previewCard}>
            <span className={styles.previewEyebrow}>{draftContent.about.kicker[L]}</span>
            <h3>{draftContent.about.title[L]}</h3>
            <p>{draftContent.about.description[L]}</p>
          </div>
        );
      default:
        return (
          <div className={styles.previewCard}>
            <span className={styles.previewEyebrow}>{activeSectionLabel}</span>
            <h3>Live preview</h3>
            <p>התצוגה המקדימה משתמשת בשפת התצוגה שנבחרה למעלה.</p>
          </div>
        );
    }
  }

  return (
    <section className={styles.studio}>
      <div className={styles.editorPane}>
        <div className={styles.topBar}>
          <div>
            <span className={styles.kicker}>Bilingual Content Studio</span>
            <h2>ניהול דו-לשוני</h2>
            <p>לכל שדה יש עריכה נפרדת בעברית ובערבית — בלי ערבוב אוטומטי.</p>
          </div>
          <div className={styles.languagePanel}>
            <span className={styles.languageBadge}>
              {previewLang === "he" ? "תצוגה מקדימה: עברית" : "معاينة: العربية"}
            </span>
            <div className={styles.languageTabs}>
              <button
                type="button"
                className={[styles.languageTab, previewLang === "he" ? styles.languageTabActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setPreviewLang("he")}
              >
                עברית
              </button>
              <button
                type="button"
                className={[styles.languageTab, previewLang === "ar" ? styles.languageTabActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setPreviewLang("ar")}
              >
                العربية
              </button>
            </div>
          </div>
        </div>

        <div className={styles.sectionTabs}>
          {contentSectionOrder.map((item) => (
            <button
              key={item.key}
              type="button"
              className={[styles.sectionTab, selectedSection === item.key ? styles.sectionTabActive : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleSectionChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.fieldGrid}>{renderSectionFields()}</div>

        <div className={styles.bottomActions}>
          <button type="button" className={styles.primaryAction} onClick={handleSave} disabled={isPending}>
            {isPending ? "שומר..." : "שמור שינויים"}
          </button>
          <button type="button" className={styles.secondaryAction} onClick={handlePreview}>
            תצוגה מקדימה
          </button>
        </div>

        {statusMessage ? <p className={styles.statusMessage}>{statusMessage}</p> : null}
      </div>

      <aside className={styles.sidePane}>
        <div className={styles.sideCard}>
          <div className={styles.sideCardHeader}>
            <strong>תרגום ידני</strong>
          </div>

          <div className={styles.translationActions}>
            <button
              type="button"
              className={styles.primaryMini}
              disabled={isTranslatingSection}
              onClick={() => void handleTranslateSectionArToHe()}
            >
              {isTranslatingSection ? "מתרגם..." : "תרגם מערבית לעברית (סקשן)"}
            </button>
            <label className={styles.ghostAction}>
              ייבוא תרגומים
              <input type="file" accept="application/json" className={styles.hiddenInput} onChange={handleImport} />
            </label>
            <button type="button" className={styles.ghostAction} onClick={handleExport}>
              ייצוא תרגומים
            </button>
          </div>

          <p className={styles.translationNotice}>{translationNotice}</p>
        </div>

        <div className={styles.sideCard}>
          <strong>סטטוס תרגום</strong>
          <div className={styles.progressRow}>
            <span>Hebrew</span>
            <strong>{completeness.he}%</strong>
          </div>
          <div className={styles.progressBar}>
            <span style={{ width: `${completeness.he}%` }} />
          </div>
          <div className={styles.progressRow}>
            <span>Arabic</span>
            <strong>{completeness.ar}%</strong>
          </div>
          <div className={styles.progressBar}>
            <span style={{ width: `${completeness.ar}%` }} />
          </div>
        </div>

        <div className={styles.sideCard}>
          <strong>Live Preview</strong>
          {renderPreview()}
        </div>
      </aside>
    </section>
  );
}
