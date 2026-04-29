import Image from "next/image";
import { redirect } from "next/navigation";

import {
  logoutAction,
  saveSiteSettingsAction,
} from "@/app/admin/actions";
import BilingualContentStudio from "@/components/admin/BilingualContentStudio";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { PROJECTS } from "@/lib/projects";
import { getPublicSiteData } from "@/lib/site-settings";

import styles from "./page.module.css";

type AdminPageProps = {
  searchParams?: Promise<{
    saved?: string;
    project?: string;
    search?: string;
  }>;
};

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  project_key: string;
  source?: string | null;
  ip?: string | null;
  createdAt: Date;
};

function formatLeadDate(value: Date) {
  return value.toLocaleString("he-IL");
}

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("972")) return cleaned;
  if (cleaned.startsWith("0")) return `972${cleaned.slice(1)}`;
  return cleaned;
}

const navigationItems = [
  { label: "Dashboard", href: "#dashboard", icon: "◌" },
  { label: "בית", href: "#dashboard", icon: "✦" },
  { label: "אודות", href: "#content", icon: "◍" },
  { label: "שירותים", href: "#content", icon: "◫" },
  { label: "תהליך עבודה", href: "#content", icon: "◐" },
  { label: "פרויקטים", href: "/admin/projects", icon: "▣" },
  { label: "צור קשר", href: "#content", icon: "✉" },
  { label: "SEO", href: "#content", icon: "⌁" },
  { label: "משתמשים", href: "#dashboard", icon: "◎" },
  { label: "הגדרות", href: "#settings", icon: "⚙" },
];

const toastMessages: Record<string, string> = {
  "1": "נשמר בהצלחה",
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
  const requestedProject = params.project?.trim() || PROJECTS.SHIRIN;
  const validProjects = Object.values(PROJECTS);
  const selectedProject = validProjects.includes(requestedProject as (typeof validProjects)[number])
    ? requestedProject
    : PROJECTS.SHIRIN;
  const searchTerm = params.search?.trim() || "";
  const safeSearch = searchTerm.trim().toLowerCase();

  const [settings, rawLeads] = await Promise.all([
    getPublicSiteData(),
    prisma.lead.findMany({
      where: { project_key: selectedProject },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  const leads: LeadRow[] = rawLeads;
  const filteredLeads = leads.filter((lead) => {
    if (!safeSearch) return true;
    return (
      lead.phone.toLowerCase().includes(safeSearch) ||
      lead.name.toLowerCase().includes(safeSearch) ||
      (lead.email || "").toLowerCase().includes(safeSearch)
    );
  });

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className={styles.kicker}>Studio Control Panel</span>
            <strong>Shirin Admin</strong>
            <p>שליטה מרוכזת בתוכן, שפות ופניות מהאתר.</p>
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
              <strong>{filteredLeads.length}</strong>
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
              <p>מערכת שליטה לעריכת תוכן, שפות ומעקב אחר פניות.</p>
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
              <strong>{filteredLeads.length}</strong>
              <p>טופס האתר מזרים לכאן את כל הלידים שנשמרו.</p>
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
                    <p>הסיפור, הסמכות והבידול שמופיעים באזור האודות, כולל התמונה הגדולה והתמונה הקטנה של הקולאז&apos;.</p>
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
                  </div>
                </section>
              </div>
            </section>

            <div className={styles.bottomSave}>
              <AdminSaveButton label="שמירת כל התוכן" />
            </div>
          </form>

          <section className={styles.sectionBlock} id="leads">
            <div className={styles.sectionHeader}>
              <h2>Leads</h2>
              <p>פאנל פניות עם תצוגת table/cards, תאריכים ופרטי קשר קריאים.</p>
            </div>

            <form className={styles.projectsToolbar} method="get">
              {params.saved ? <input type="hidden" name="saved" value={params.saved} /> : null}

              <label className={styles.selectField}>
                <span>פרויקט</span>
                <select name="project" defaultValue={selectedProject}>
                  {validProjects.map((projectKey) => (
                    <option key={projectKey} value={projectKey}>
                      {projectKey}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.selectField}>
                <span>חיפוש לפי שם / טלפון / אימייל</span>
                <input name="search" defaultValue={searchTerm} placeholder="הקלידי לחיפוש..." />
              </label>

              <button type="submit" className={styles.secondaryButton}>
                סינון לידים
              </button>
            </form>

            {!leads.length ? (
              <div className={styles.emptyState}>No leads yet</div>
            ) : filteredLeads.length ? (
              <div className={styles.leadsTableWrap}>
                <table className={styles.leadsTable}>
                  <thead>
                    <tr>
                      <th>שם</th>
                      <th>טלפון</th>
                      <th>אימייל</th>
                      <th>הודעה</th>
                      <th>Project</th>
                      <th>Source</th>
                      <th>IP</th>
                      <th>WhatsApp</th>
                      <th>תאריך</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.name}</td>
                        <td>{lead.phone || "-"}</td>
                        <td>{lead.email || "-"}</td>
                        <td className={styles.messageCell}>{lead.message || "-"}</td>
                        <td>
                          <span
                            className={[
                              styles.tag,
                              lead.project_key === PROJECTS.SHIRIN ? styles.tagShirinPage : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {lead.project_key}
                          </span>
                        </td>
                        <td>{lead.source || "-"}</td>
                        <td>{lead.ip || "-"}</td>
                        <td>
                          {normalizePhone(lead.phone) ? (
                            <a
                              href={`https://wa.me/${normalizePhone(lead.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.whatsappLink}
                            >
                              WhatsApp
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{formatLeadDate(lead.createdAt)}</td>
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
