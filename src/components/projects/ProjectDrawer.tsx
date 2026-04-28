"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { emptyProjectForm, type ProjectFormState, type ProjectItem } from "./types";
import styles from "./ProjectDrawer.module.css";

type ProjectDrawerProps = {
  open: boolean;
  project: ProjectItem | null;
  onClose: () => void;
  onSaved: (project: ProjectItem) => void;
};

function getInitialForm(project: ProjectItem | null): ProjectFormState {
  return project
    ? {
        ...emptyProjectForm,
        ...project,
        galleryImages: Array.isArray(project.galleryImages) ? project.galleryImages : [],
      }
    : { ...emptyProjectForm };
}

function isProjectItem(value: ProjectItem | { error?: string }): value is ProjectItem {
  return "id" in value && "title_he" in value;
}

export default function ProjectDrawer({ open, project, onClose, onSaved }: ProjectDrawerProps) {
  const [form, setForm] = useState<ProjectFormState>(() => getInitialForm(project));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(getInitialForm(project));
    setImageFile(null);
    setGalleryFiles([]);
    setError("");
  }, [project, open]);

  const previewUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return form.image;
  }, [form.image, imageFile]);

  const galleryPreviewUrls = useMemo(() => {
    return galleryFiles.map((file) => URL.createObjectURL(file));
  }, [galleryFiles]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      galleryPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryPreviewUrls]);

  function updateField<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setImageFile(event.target.files?.[0] || null);
  }

  function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setGalleryFiles((current) => [...current, ...files]);
    event.target.value = "";
  }

  function removeExistingGalleryImage(url: string) {
    setForm((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((image) => image !== url),
    }));
  }

  async function handleSave() {
    setError("");

    if (!form.title_he.trim()) {
      setError("נא להזין כותרת בעברית.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = new FormData();
      if (form.id) payload.set("id", form.id);
      payload.set("title_he", form.title_he);
      payload.set("title_ar", form.title_ar);
      payload.set("description_he", form.description_he);
      payload.set("description_ar", form.description_ar);
      payload.set("category", form.category);
      payload.set("location", form.location);
      payload.set("image", form.image);
      payload.set("galleryImages", JSON.stringify(form.galleryImages));
      payload.set("isPublished", String(form.isPublished));
      payload.set("isFeatured", String(form.isFeatured));
      if (imageFile) payload.set("imageFile", imageFile);
      galleryFiles.forEach((file) => payload.append("galleryFiles", file));

      const response = await fetch("/api/projects", {
        method: form.id ? "PUT" : "POST",
        body: payload,
      });

      const result = (await response.json()) as ProjectItem | { error?: string };

      if (!response.ok || !isProjectItem(result)) {
        throw new Error("error" in result && result.error ? result.error : "Project save failed");
      }

      onSaved(result);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Project save failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className={styles.backdrop} data-open={open} onClick={onClose} />
      <aside className={styles.drawer} data-open={open} aria-hidden={!open}>
        <div className={styles.panel}>
          <div className={styles.header}>
            <div>
              <h2>{project ? "Edit Project" : "New Project"}</h2>
              <p>Hebrew + Arabic content, cover image and publishing flags.</p>
            </div>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close drawer">
              ×
            </button>
          </div>

          <div className={styles.form}>
            <label className={styles.field}>
              <span>Title (Hebrew)</span>
              <input
                value={form.title_he}
                onChange={(event) => updateField("title_he", event.target.value)}
                className={styles.input}
                placeholder="כותרת הפרויקט"
              />
            </label>

            <label className={styles.field}>
              <span>Title (Arabic)</span>
              <input
                value={form.title_ar}
                onChange={(event) => updateField("title_ar", event.target.value)}
                className={styles.input}
                placeholder="عنوان المشروع"
              />
            </label>

            <label className={styles.field}>
              <span>Description (Hebrew)</span>
              <textarea
                value={form.description_he}
                onChange={(event) => updateField("description_he", event.target.value)}
                className={styles.textarea}
                placeholder="תיאור קצר לפרויקט"
              />
            </label>

            <label className={styles.field}>
              <span>Description (Arabic)</span>
              <textarea
                value={form.description_ar}
                onChange={(event) => updateField("description_ar", event.target.value)}
                className={styles.textarea}
                placeholder="وصف قصير للمشروع"
              />
            </label>

            <label className={styles.field}>
              <span>Category</span>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value as ProjectFormState["category"])}
                className={styles.select}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Location</span>
              <input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                className={styles.input}
                placeholder="Location"
              />
            </label>

            <label className={styles.upload}>
              <span>Project Image</span>
              {previewUrl ? (
                <div className={styles.preview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="" />
                </div>
              ) : null}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            <label className={styles.upload}>
              <span>Gallery Images</span>
              <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
            </label>

            {form.galleryImages.length || galleryFiles.length ? (
              <div className={styles.galleryList}>
                {form.galleryImages.map((url) => (
                  <div key={url} className={styles.galleryItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" />
                    <button type="button" onClick={() => removeExistingGalleryImage(url)}>
                      Remove
                    </button>
                  </div>
                ))}
                {galleryFiles.map((file, index) => {
                  const url = galleryPreviewUrls[index];
                  return (
                    <div key={`${file.name}-${index}`} className={styles.galleryItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" />
                      <button type="button" onClick={() => setGalleryFiles((current) => current.filter((_, i) => i !== index))}>
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className={styles.checkRow}>
              <label className={styles.checkField}>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => updateField("isFeatured", event.target.checked)}
                />
                <span>Featured</span>
              </label>
              <label className={styles.checkField}>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) => updateField("isPublished", event.target.checked)}
                />
                <span>Published</span>
              </label>
            </div>

            {error ? <div className={styles.error}>{error}</div> : null}

            <div className={styles.actions}>
              <button type="button" className={styles.cancel} onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
              <button type="button" className={styles.save} onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
