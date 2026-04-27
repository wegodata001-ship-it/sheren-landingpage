import { redirect } from "next/navigation";

import { loginAction } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

import styles from "./page.module.css";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = (searchParams ? await searchParams : {}) || {};

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.kicker}>Admin Access</span>
          <h1>כניסה לאדמין</h1>
          <p>התחברות מהירה לניהול התוכן הבסיסי של האתר ולצפייה בפניות שהתקבלו.</p>
        </div>

        <form action={loginAction} className={styles.form}>
          <label>
            שם משתמש
            <input type="text" name="username" placeholder="admin" required />
          </label>

          <label>
            סיסמה
            <input type="password" name="password" placeholder="הסיסמה שלך" required />
          </label>

          {params.error ? <p className={styles.error}>שם המשתמש או הסיסמה אינם נכונים.</p> : null}

          <button type="submit" className={styles.button}>
            כניסה למערכת
          </button>
        </form>
      </section>
    </main>
  );
}
