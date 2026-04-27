"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { ProjectGalleryImage, ProjectLocalizedPayload } from "@/lib/project-types";
import { emptyBilingual } from "@/lib/project-types";

import styles from "./ProjectEditorForm.module.css";

export type ProjectEditorFormProps = {
  mode: "create" | "edit";
  projectId?: string;
  initialPayload: ProjectLocalizedPayload;
  initialCover: { url: string; path: string };
  initialGallery: ProjectGalleryImage[];
  initialSize: string;
  formAction: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

function BilingualInputs({
  label,
  valueHe,
  valueAr,
  onHe,
  onAr,
  multiline,
}: {
  label: string;
  valueHe: string;
  valueAr: string;
  onHe: (v: string) => void;
  onAr: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className={styles.bilingualBlock}>
      <span className={styles.blockLabel}>{label}</span>
      <div className={styles.bilingualGrid}>
        <label className={styles.smallField}>
          <span>עברית</span>
          {multiline ? (
            <textarea rows={4} value={valueHe} onChange={(e) => onHe(e.target.value)} dir="rtl" />
          ) : (
            <input value={valueHe} onChange={(e) => onHe(e.target.value)} dir="rtl" />
          )}
        </label>
        <label className={styles.smallField}>
          <span>العربية</span>
          {multiline ? (
            <textarea rows={4} value={valueAr} onChange={(e) => onAr(e.target.value)} dir="rtl" />
          ) : (
            <input value={valueAr} onChange={(e) => onAr(e.target.value)} dir="rtl" />
          )}
        </label>
      </div>
    </div>
  );
}

export default function ProjectEditorForm({
  mode,
  projectId,
  initialPayload,
  initialCover,
  initialGallery,
  initialSize,
  formAction,
  submitLabel,
}: ProjectEditorFormProps) {
  const [payload, setPayload] = useState<ProjectLocalizedPayload>(initialPayload);
  const [coverRemote, setCoverRemote] = useState(initialCover);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<ProjectGalleryImage[]>(initialGallery);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [size, setSize] = useState(initialSize);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const coverBlobUrl = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : ""), [coverFile]);

  useEffect(() => {
    return () => {
      if (coverBlobUrl) {
        URL.revokeObjectURL(coverBlobUrl);
      }
    };
  }, [coverBlobUrl]);

  const pendingUrls = useMemo(() => pendingFiles.map((file) => URL.createObjectURL(file)), [pendingFiles]);

  useEffect(() => {
    return () => {
      pendingUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingUrls]);

  const coverPreview = coverBlobUrl || coverRemote.url;

  function removeGalleryAt(index: number) {
    const item = gallery[index];
    if (!item) {
      return;
    }

    if (item.path) {
      setRemovedPaths((r) => [...r, item.path]);
    }

    setGallery((g) => g.filter((_, i) => i !== index));
  }

  function moveGallery(from: number, to: number) {
    setGallery((g) => {
      const next = [...g];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });
  }

  function makeCoverFromGallery(index: number) {
    const selected = gallery[index];
    if (!selected) {
      return;
    }

    setGallery((g) => {
      const next = [...g.slice(0, index), ...g.slice(index + 1)];
      if (coverRemote.path) {
        next.push({ url: coverRemote.url, path: coverRemote.path });
      }
      return next;
    });

    setCoverRemote(selected);
    setCoverFile(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "create" && !coverFile) {
      window.alert("נא לבחור תמונת שער (כיסוי) לפרויקט.");
      return;
    }

    if (!payload.title.he.trim() || !payload.category.he.trim()) {
      window.alert("נא למלא כותרת וקטגוריה בעברית (שדות חובה).");
      return;
    }

    const fd = new FormData();
    if (mode === "edit" && projectId) {
      fd.set("id", projectId);
    }

    fd.set("localizedPayload", JSON.stringify(payload));
    fd.set("size", size);
    fd.set("galleryExistingJson", JSON.stringify(gallery));

    if (removedPaths.length) {
      fd.set("removedPaths", removedPaths.join(","));
    }

    pendingFiles.forEach((file, index) => {
      fd.append(`galleryNew_${index}`, file);
    });

    if (coverFile) {
      fd.set("coverImage", coverFile);
    } else if (mode === "edit" && coverRemote.url && coverRemote.path) {
      fd.set("coverUrlOverride", coverRemote.url);
      fd.set("coverPathOverride", coverRemote.path);
    }

    await formAction(fd);
  }

  return (
    <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
      <BilingualInputs
        label="כותרת / عنوان"
        valueHe={payload.title.he}
        valueAr={payload.title.ar}
        onHe={(v) => setPayload((c) => ({ ...c, title: { ...c.title, he: v } }))}
        onAr={(v) => setPayload((c) => ({ ...c, title: { ...c.title, ar: v } }))}
      />

      <BilingualInputs
        label="תיאור קצר (כרטיס) / وصف قصير"
        valueHe={payload.shortDescription.he}
        valueAr={payload.shortDescription.ar}
        onHe={(v) => setPayload((c) => ({ ...c, shortDescription: { ...c.shortDescription, he: v } }))}
        onAr={(v) => setPayload((c) => ({ ...c, shortDescription: { ...c.shortDescription, ar: v } }))}
        multiline
      />

      <BilingualInputs
        label="תיאור מלא / وصف كامل"
        valueHe={payload.fullDescription.he}
        valueAr={payload.fullDescription.ar}
        onHe={(v) => setPayload((c) => ({ ...c, fullDescription: { ...c.fullDescription, he: v } }))}
        onAr={(v) => setPayload((c) => ({ ...c, fullDescription: { ...c.fullDescription, ar: v } }))}
        multiline
      />

      <BilingualInputs
        label="קטגוריה / التصنيف"
        valueHe={payload.category.he}
        valueAr={payload.category.ar}
        onHe={(v) => setPayload((c) => ({ ...c, category: { ...c.category, he: v } }))}
        onAr={(v) => setPayload((c) => ({ ...c, category: { ...c.category, ar: v } }))}
      />

      <BilingualInputs
        label="מיקום (אופציונלי) / الموقع"
        valueHe={payload.location?.he ?? ""}
        valueAr={payload.location?.ar ?? ""}
        onHe={(v) =>
          setPayload((c) => ({
            ...c,
            location: { ...(c.location ?? emptyBilingual()), he: v },
          }))
        }
        onAr={(v) =>
          setPayload((c) => ({
            ...c,
            location: { ...(c.location ?? emptyBilingual()), ar: v },
          }))
        }
      />

      <label className={styles.smallField}>
        <span>שנה / سنة</span>
        <input value={payload.year ?? ""} onChange={(e) => setPayload((c) => ({ ...c, year: e.target.value }))} dir="ltr" />
      </label>

      <BilingualInputs
        label="סגנון (אופציונלי) / الأسلوب"
        valueHe={payload.style?.he ?? ""}
        valueAr={payload.style?.ar ?? ""}
        onHe={(v) =>
          setPayload((c) => ({
            ...c,
            style: { ...(c.style ?? emptyBilingual()), he: v },
          }))
        }
        onAr={(v) =>
          setPayload((c) => ({
            ...c,
            style: { ...(c.style ?? emptyBilingual()), ar: v },
          }))
        }
      />

      <label className={styles.selectField}>
        <span>גודל כרטיס באתר</span>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="standard">Standard</option>
          <option value="wide">Wide</option>
          <option value="tall">Tall</option>
        </select>
      </label>

      <div className={styles.coverSection}>
        <span className={styles.blockLabel}>תמונת שער (כיסוי)</span>
        <div className={styles.coverPreview}>
          {coverPreview ? (
            <Image src={coverPreview} alt="" width={320} height={200} className={styles.coverImg} unoptimized />
          ) : (
            <div className={styles.coverPlaceholder}>אין תמונת שער</div>
          )}
        </div>
        <label className={styles.fileLine}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            required={mode === "create"}
          />
          <span>{mode === "create" ? "חובה" : "החלפת שער (אופציונלי)"}</span>
        </label>
      </div>

      <div className={styles.gallerySection}>
        <span className={styles.blockLabel}>גלריה (תמונות נוספות)</span>
        <label className={styles.dropZone}>
          <input
            type="file"
            accept="image/*"
            multiple
            className={styles.visuallyHidden}
            onChange={(e) => {
              const list = e.target.files ? Array.from(e.target.files) : [];
              setPendingFiles((p) => [...p, ...list]);
              e.target.value = "";
            }}
          />
          <span>גררו לכאן או לחצו לבחירת קבצים</span>
        </label>

        <div className={styles.galleryGrid}>
          {gallery.map((item, index) => (
            <div
              key={`${item.path}-${index}`}
              className={styles.galleryCard}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex === null || dragIndex === index) {
                  return;
                }
                moveGallery(dragIndex, index);
                setDragIndex(null);
              }}
            >
              <Image src={item.url} alt="" width={160} height={120} className={styles.thumb} unoptimized />
              <div className={styles.galleryActions}>
                <button type="button" className={styles.miniBtn} onClick={() => makeCoverFromGallery(index)}>
                  קבע כשער
                </button>
                <button type="button" className={styles.miniDanger} onClick={() => removeGalleryAt(index)}>
                  מחק
                </button>
                <div className={styles.reorder}>
                  <button type="button" disabled={index === 0} onClick={() => moveGallery(index, index - 1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === gallery.length - 1}
                    onClick={() => moveGallery(index, index + 1)}
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingFiles.map((file, index) => (
            <div key={`${file.name}-${file.size}-${index}`} className={styles.galleryCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingUrls[index]} alt="" className={styles.thumb} />
              <div className={styles.galleryActions}>
                <button
                  type="button"
                  className={styles.miniDanger}
                  onClick={() => setPendingFiles((p) => p.filter((_, i) => i !== index))}
                >
                  הסר לפני שמירה
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        {submitLabel}
      </button>
    </form>
  );
}
