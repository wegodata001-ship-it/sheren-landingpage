import Image from "next/image";
import { redirect } from "next/navigation";

import {
  createProjectAction,
  deleteProjectAction,
  logoutAction,
  saveSiteSettingsAction,
  updateProjectAction,
} from "@/app/admin/actions";
import BilingualContentStudio from "@/components/admin/BilingualContentStudio";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import ProjectEditorForm from "@/components/admin/ProjectEditorForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  defaultPayloadFromLegacy,
  parseGalleryPayload,
  parseLocalizedPayload,
} from "@/lib/project-mapper";
import { ensureProjectsSeeded } from "@/lib/projects";
import type { ProjectRecord as Project } from "@/lib/project-types";
import { prisma } from "@/lib/prisma";
import { getPublicSiteData } from "@/lib/site-settings";

import styles from "./page.module.css";

function projectEditorDefaults(project: Project) {
  const localized =
    parseLocalizedPayload(project.localizedPayload) ?? defaultPayloadFromLegacy(project.title, project.category);

  return {
    initialPayload: localized,
    initialCover: { url: project.imageUrl, path: project.imagePath },
    initialGallery: parseGalleryPayload(project.galleryPayload),
    initialSize: project.size,
  };
}

type AdminPageProps = {
  searchParams?: Promise<{
    saved?: string;
  }>;
};

const navigationItems = [
  { label: "Dashboard", href: "#dashboard", icon: "◌" },
  { label: "בית", href: "#dashboard", icon: "✦" },
  { label: "אודות", href: "#content", icon: "◍" },
  { label: "שירותים", href: "#content", icon: "◫" },
  { label: "תהליך עבודה", href: "#content", icon: "◐" },
  { label: "פרויקטים", href: "#projects", icon: "▣" },
  { label: "צור קשר", href: "#content", icon: "✉" },
  { label: "SEO", href: "#content", icon: "⌁" },
  { label: "משתמשים", href: "#dashboard", icon: "◎" },
  { label: "הגדרות", href: "#settings", icon: "⚙" },
];

const toastMessages: Record<string, string> = {
  "1": "נשמר בהצלחה",
  "project-created": "הפרויקט נוסף בהצלחה",
  "project-updated": "הפרויקט עודכן בהצלחה",
  "project-deleted": "הפרויקט נמחק בהצלחה",
  "project-error": "בדקי שכל השדות מולאו ושצורפה תמונה תקינה",
};

function FloatingField({
  name,
  label,
  defaultValue,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className={styles.field}>
      <input name={name} type={type} defaultValue={defaultValue} placeholder=" " required={required} />
      <span>{label}</span>
    </label>
  );
}

function FloatingTextarea({
  name,
  label,
  defaultValue,
  rows = 4,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className={[styles.field, styles.textareaField].join(" ")}>
      <textarea name={name} rows={rows} defaultValue={defaultValue} placeholder=" " required={required} />
      <span>{label}</span>
    </label>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const params = (searchParams ? await searchParams : {}) || {};
  const [settings, rawProjects, submissions] = await Promise.all([
    getPublicSiteData(),
    ensureProjectsSeeded(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);
  const projects: Project[] = rawProjects;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className={styles.kicker}>Studio Control Panel</span>
            <strong>Shirin Admin</strong>
            <p>שליטה מרוכזת בתוכן, פניות ותצוגת הפרויקטים.</p>
          </div>

          <nav className={styles.nav}>
            {navigationItems.map((item, index) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={[styles.navItem, index === 0 ? styles.navItemActive : ""].filter(Boolean).join(" ")}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.miniStat}>
              <span>Leads</span>
              <strong>{submissions.length}</strong>
            </div>
            <div className={styles.miniStat}>
              <span>Projects</span>
              <strong>{projects.length}</strong>
            </div>
            <div className={styles.supportBox}>
              <strong>זקוקה לעזרה?</strong>
              <p>אפשר להתחיל מעריכת שפה אחת, לשמור, ואז לתרגם לצד השני ולעבור בדיקה ידנית.</p>
            </div>
          </div>
        </aside>

        <div className={styles.contentArea}>
          <header className={styles.header} id="dashboard">
            <div>
              <span className={styles.kicker}>Admin Dashboard</span>
              <h1>ניהול אתר שירין</h1>
              <p>מערכת שליטה לעריכת תוכן, ניהול פרויקטים בסיסי ומעקב אחר פניות.</p>
            </div>

            <div className={styles.headerActions}>
              <form action={logoutAction}>
                <button type="submit" className={styles.logoutButton}>
                  התנתקות
                </button>
              </form>
            </div>
          </header>

          {params.saved ? <div className={styles.toast}>{toastMessages[params.saved] || "נשמר בהצלחה"}</div> : null}

          <div className={styles.metrics}>
            <article className={styles.metricCard}>
              <span>תוכן מנוהל</span>
              <strong>4 Areas</strong>
              <p>פרטי עסק, Hero, About ו־Contact.</p>
            </article>
            <article className={styles.metricCard}>
              <span>פניות חדשות</span>
              <strong>{submissions.length}</strong>
              <p>טופס האתר מזרים לכאן את כל הלידים שנשמרו.</p>
            </article>
            <article className={styles.metricCard}>
              <span>פרויקטים מוצגים</span>
              <strong>{projects.length}</strong>
              <p>פרויקטים מנוהלים עכשיו ישירות דרך Storage ו־Database.</p>
            </article>
          </div>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2>דו-לשוני</h2>
              <p>סטודיו עריכה בעברית ובערבית עם preview חי, תרגום ושמירה נקייה לפי שפה אחת בכל פעם.</p>
            </div>
            <BilingualContentStudio initialContent={settings.localizedContent} />
          </section>

          <form id="site-settings-form" action={saveSiteSettingsAction} className={styles.form}>
            <div className={styles.formStickyBar}>
              <div>
                <strong>שומרים את כל אזור ה־Content</strong>
                <p>העדכון יחול על האתר מיד אחרי השמירה.</p>
              </div>
              <AdminSaveButton />
            </div>

            <section className={styles.sectionBlock} id="content">
              <div className={styles.sectionHeader}>
                <h2>Content</h2>
                <p>החלקים שמעצבים את המסר הראשי של האתר.</p>
              </div>

              <div className={styles.cardsGrid}>
                <section className={styles.cardPanel}>
                  <div className={styles.panelHeader}>
                    <h3>פרטי העסק</h3>
                    <p>פרטי הזהות העסקית שמופיעים ב־navbar, footer ויצירת קשר.</p>
                  </div>

                  <div className={styles.fieldsGrid}>
                    <FloatingField name="businessName" label="שם העסק" defaultValue={settings.businessName} required />
                    <FloatingField name="tagline" label="שורת מיתוג" defaultValue={settings.tagline} required />
                    <FloatingField name="phoneNumber" label="טלפון" defaultValue={settings.phoneNumber} required />
                    <FloatingField
                      name="whatsappNumber"
                      label="וואטסאפ"
                      defaultValue={settings.whatsappNumber}
                      required
                    />
                    <FloatingField name="email" label="אימייל" type="email" defaultValue={settings.email} required />
                    <FloatingField name="address" label="כתובת / אזור" defaultValue={settings.address} required />
                  </div>
                </section>

                <section className={styles.cardPanel}>
                  <div className={styles.panelHeader}>
                    <h3>Hero</h3>
                    <p>המסר הראשי שנפגש עם הגולש מיד בכניסה לאתר, כולל התמונה שבתוך אזור הפתיחה.</p>
                  </div>

                  <div className={styles.mediaPreviewCard}>
                    <div className={styles.mediaPreviewFrame}>
                      <Image
                        src={settings.heroImage}
                        alt="Hero preview"
                        fill
                        unoptimized
                        sizes="(max-width: 980px) 100vw, 33vw"
                        className={styles.mediaPreviewImage}
                      />
                    </div>
                    <span className={styles.helperText}>תמונה נוכחית של אזור הפתיחה</span>
                  </div>

                  <FloatingField name="heroTitle" label="כותרת Hero" defaultValue={settings.heroTitle} required />
                  <FloatingTextarea
                    name="heroSubtitle"
                    label="תיאור Hero"
                    defaultValue={settings.heroSubtitle}
                    rows={5}
                    required
                  />
                  <label className={styles.uploadField}>
                    <span>החלפת תמונת Hero</span>
                    <input type="file" name="heroImage" accept="image/*" />
                  </label>
                </section>

                <section className={styles.cardPanel}>
                  <div className={styles.panelHeader}>
                    <h3>About</h3>
                    <p>הסיפור, הסמכות והבידול שמופיעים באזור האודות, כולל התמונה הגדולה והתמונה הקטנה של הקולאז'.</p>
                  </div>

                  <div className={styles.mediaPreviewCard}>
                    <div className={styles.mediaPreviewFrame}>
                      <Image
                        src={settings.aboutImage}
                        alt="About preview"
                        fill
                        unoptimized
                        sizes="(max-width: 980px) 100vw, 33vw"
                        className={styles.mediaPreviewImage}
                      />
                    </div>
                    <span className={styles.helperText}>תמונה נוכחית של אזור האודות</span>
                  </div>

                  <div className={styles.mediaPreviewCard}>
                    <div className={styles.mediaPreviewFrame}>
                      <Image
                        src={settings.aboutSecondaryImage}
                        alt="About secondary preview"
                        fill
                        unoptimized
                        sizes="(max-width: 980px) 100vw, 33vw"
                        className={styles.mediaPreviewImage}
                      />
                    </div>
                    <span className={styles.helperText}>תמונה נוכחית של הכרטיס הקטן באזור האודות</span>
                  </div>

                  <FloatingField name="aboutTitle" label="כותרת About" defaultValue={settings.aboutTitle} required />
                  <FloatingTextarea
                    name="aboutDescription"
                    label="טקסט About"
                    defaultValue={settings.aboutDescription}
                    rows={4}
                    required
                  />
                  <FloatingTextarea
                    name="aboutSecondaryDescription"
                    label="טקסט המשך About"
                    defaultValue={settings.aboutSecondaryDescription}
                    rows={6}
                    required
                  />
                  <label className={styles.uploadField}>
                    <span>החלפת תמונת About</span>
                    <input type="file" name="aboutImage" accept="image/*" />
                  </label>
                  <label className={styles.uploadField}>
                    <span>החלפת התמונה הקטנה של About</span>
                    <input type="file" name="aboutSecondaryImage" accept="image/*" />
                  </label>
                </section>

                <section className={styles.cardPanel} id="settings">
                  <div className={styles.panelHeader}>
                    <h3>Settings</h3>
                    <p>מבט מהיר על מצב המערכת והחיבורים הקיימים כרגע.</p>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingRow}>
                      <span>Database</span>
                      <strong>Connected</strong>
                    </div>
                    <div className={styles.settingRow}>
                      <span>Admin Auth</span>
                      <strong>Session Cookie</strong>
                    </div>
                    <div className={styles.settingRow}>
                      <span>Project Media</span>
                      <strong>Ready for Storage</strong>
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <div className={styles.bottomSave}>
              <AdminSaveButton label="שמירת כל התוכן" />
            </div>
          </form>

          <section className={styles.sectionBlock} id="projects">
            <div className={styles.sectionHeader}>
              <h2>Projects</h2>
              <p>העלאה, עריכה ומחיקה אמיתיים של פרויקטים ותמונות מתוך האדמין.</p>
            </div>

            <div className={styles.projectCreateCard}>
              <div className={styles.panelHeader}>
                <h3>הוספת פרויקט חדש</h3>
                <p>תוכן דו־לשוני, תיאור קצר וארוך, גלריה ותמונת שער. הקבצים נשמרים ב־Supabase Storage.</p>
              </div>
              <ProjectEditorForm
                mode="create"
                initialPayload={defaultPayloadFromLegacy("", "")}
                initialCover={{ url: "", path: "" }}
                initialGallery={[]}
                initialSize="standard"
                formAction={createProjectAction}
                submitLabel="יצירת פרויקט"
              />
            </div>

            {projects.length ? (
              <div className={styles.projectsGrid}>
                {projects.map((project) => {
                  const editor = projectEditorDefaults(project);
                  return (
                    <div key={project.id} className={styles.projectCard}>
                      <div className={styles.projectImageWrap}>
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          sizes="(max-width: 980px) 100vw, 25vw"
                          className={styles.projectImage}
                        />
                      </div>

                      <ProjectEditorForm
                        mode="edit"
                        projectId={project.id}
                        initialPayload={editor.initialPayload}
                        initialCover={editor.initialCover}
                        initialGallery={editor.initialGallery}
                        initialSize={editor.initialSize}
                        formAction={updateProjectAction}
                        submitLabel="שמירת פרויקט"
                      />

                      <form action={deleteProjectAction} className={styles.projectDeleteForm}>
                        <input type="hidden" name="id" value={project.id} />
                        <button type="submit" className={styles.ghostDangerButton}>
                          Delete
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>עדיין אין פרויקטים שמורים. צרי את הפרויקט הראשון מהטופס למעלה.</div>
            )}
          </section>

          <section className={styles.sectionBlock} id="leads">
            <div className={styles.sectionHeader}>
              <h2>Leads</h2>
              <p>פאנל פניות עם תצוגת table/cards, תאריכים ופרטי קשר קריאים.</p>
            </div>

            {submissions.length ? (
              <div className={styles.leadsTableWrap}>
                <table className={styles.leadsTable}>
                  <thead>
                    <tr>
                      <th>שם</th>
                      <th>טלפון</th>
                      <th>אימייל</th>
                      <th>הודעה</th>
                      <th>תאריך</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td>{submission.name}</td>
                        <td>{submission.phone || "—"}</td>
                        <td>{submission.email}</td>
                        <td className={styles.messageCell}>{submission.message}</td>
                        <td>{submission.createdAt.toLocaleString("he-IL")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>כשהטופס באתר ישלח פניות, הן יופיעו כאן.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
