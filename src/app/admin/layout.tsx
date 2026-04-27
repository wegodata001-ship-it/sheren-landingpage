import { cookies } from "next/headers";

import { ADMIN_UI_LANG_COOKIE, parseAdminUiLang } from "@/lib/admin-ui-lang";

import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const initialLang = parseAdminUiLang(jar.get(ADMIN_UI_LANG_COOKIE)?.value);

  return <AdminLayoutClient initialLang={initialLang}>{children}</AdminLayoutClient>;
}
