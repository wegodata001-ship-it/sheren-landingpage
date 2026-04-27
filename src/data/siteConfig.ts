export type ContactMode = "whatsapp" | "form" | "both";

export type SiteConfig = {
  businessName: string;
  tagline: string;
  phoneNumber: string;
  whatsappNumber: string;
  defaultWhatsAppMessage: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  address: string;
  siteUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroImage: string;
  aboutImage: string;
  logoPath: string;
  faviconPath: string;
  ogImage: string;
  pageTitle: string;
  pageDescription: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  contactMode: ContactMode;
  navigation: Array<{
    label: string;
    href: string;
  }>;
  sectionVisibility: {
    promoBar: boolean;
  };
};

// Duplicate-friendly config: update branding, colors, contact details, and SEO here first.
export const siteConfig: SiteConfig = {
  businessName: "שירין",
  tagline: "אדריכלות, עיצוב פנים ורישוי בניה בגישה שלמה.",
  phoneNumber: "+972 52-426-1289",
  whatsappNumber: "972524261289",
  defaultWhatsAppMessage: "היי, אשמח לקבל פרטים על תכנון, עיצוב או רישוי.",
  email: "hello@example.com",
  instagramUrl: "https://www.instagram.com/sheredesign?igsh=d3U0eDM1OG5tNmR1&utm_source=qr",
  facebookUrl: "https://www.facebook.com/share/1NWCaoBkXP/?mibextid=wwXIfr",
  tiktokUrl: "",
  linkedinUrl: "",
  address: "אזור השרון והמרכז",
  siteUrl: "https://www.example.com",
  primaryColor: "#8B7355",
  secondaryColor: "#F8F6F3",
  accentColor: "#D6C3A3",
  heroImage: "/images/hero/hero-placeholder.svg",
  aboutImage: "/images/about/about-placeholder.svg",
  logoPath: "/logo/shirin-logo.svg",
  faviconPath: "/logo/shirin-mark.svg",
  ogImage: "/images/og/og-placeholder.svg",
  pageTitle: "שירין | אדריכלות, עיצוב פנים ורישוי בניה",
  pageDescription:
    "תכנון אדריכלי, עיצוב פנים ורישוי בניה תחת קורת גג אחת, בגישה רגועה, מדויקת ויוקרתית.",
  keywords: [
    "אדריכלות",
    "עיצוב פנים",
    "רישוי בניה",
    "תכנון אדריכלי",
    "שירין",
  ],
  openGraphTitle: "שירין | תכנון נכון מתחיל מבפנים",
  openGraphDescription:
    "משרד אדריכלות ועיצוב פנים עם ניסיון של מעל 26 שנה, משלב תכנון, רישוי, נגישות ועיצוב פנים.",
  openGraphImage: "/images/og/og-placeholder.svg",
  contactMode: "both",
  navigation: [
    { label: "אודות", href: "#about" },
    { label: "שירותים", href: "#services" },
    { label: "מעטפת מלאה", href: "#full-package" },
    { label: "תהליך העבודה", href: "#process" },
    { label: "פרויקטים", href: "#projects" },
    { label: "צור קשר", href: "#contact" },
  ],
  sectionVisibility: {
    promoBar: true,
  },
};
