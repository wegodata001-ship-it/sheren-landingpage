import { siteConfig } from "@/data/siteConfig";
import { siteContent } from "@/data/siteContent";

export type SupportedLanguage = "he" | "ar";

export type LocalizedText = Record<SupportedLanguage, string>;

export type LocalizedArrayText = Record<SupportedLanguage, string[]>;

export type LocalizedStat = {
  value: string;
  label: LocalizedText;
};

export type LocalizedServiceItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  points: LocalizedArrayText;
};

export type LocalizedProcessItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type LocalizedNavigationItem = {
  id: string;
  href: string;
  label: LocalizedText;
};

export type LocalizedSiteContent = {
  promoBar: {
    text: LocalizedText;
    linkLabel: LocalizedText;
    href: string;
  };
  navigation: LocalizedNavigationItem[];
  hero: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    subtitle: LocalizedText;
    primaryButtonText: LocalizedText;
    secondaryButtonText: LocalizedText;
    stats: LocalizedStat[];
  };
  about: {
    kicker: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    secondaryDescription: LocalizedText;
    highlights: LocalizedArrayText;
    quote: LocalizedText;
    mediaLabel: LocalizedText;
    infoTileTitle: LocalizedText;
    infoTileText: LocalizedText;
  };
  services: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    items: LocalizedServiceItem[];
  };
  process: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    items: LocalizedProcessItem[];
  };
  projectsSection: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    helper: LocalizedText;
    ctaLabel: LocalizedText;
    previousLabel: LocalizedText;
    nextLabel: LocalizedText;
  };
  cta: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    primaryButtonText: LocalizedText;
    secondaryButtonText: LocalizedText;
  };
  contact: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    formTitle: LocalizedText;
    formDescription: LocalizedText;
    whatsappTitle: LocalizedText;
    whatsappDescription: LocalizedText;
    responseNote: LocalizedText;
    labels: {
      name: LocalizedText;
      email: LocalizedText;
      phone: LocalizedText;
      message: LocalizedText;
      submit: LocalizedText;
    };
    placeholders: {
      name: LocalizedText;
      email: LocalizedText;
      phone: LocalizedText;
      message: LocalizedText;
    };
    infoTitle: LocalizedText;
  };
  quote: {
    text: LocalizedText;
    subtext: LocalizedText;
  };
  footer: {
    text: LocalizedText;
    rights: LocalizedText;
    bottomTagline: LocalizedText;
  };
  seo: {
    pageTitle: LocalizedText;
    pageDescription: LocalizedText;
    keywords: Record<SupportedLanguage, string[]>;
    openGraphTitle: LocalizedText;
    openGraphDescription: LocalizedText;
  };
};

export const defaultLocalizedContent: LocalizedSiteContent = {
  promoBar: {
    text: {
      he: siteContent.promoBar.text,
      ar: "مواعيد التعارف والتخطيط مفتوحة الآن للمشاريع الجديدة.",
    },
    linkLabel: {
      he: siteContent.promoBar.linkLabel,
      ar: "لتنسيق مكالمة",
    },
    href: siteContent.promoBar.href,
  },
  navigation: [
    { id: "about", href: "#about", label: { he: "אודות", ar: "من نحن" } },
    { id: "services", href: "#services", label: { he: "שירותים", ar: "الخدمات" } },
    { id: "full-package", href: "#full-package", label: { he: "מעטפת מלאה", ar: "الحزمة الكاملة" } },
    { id: "process", href: "#process", label: { he: "תהליך העבודה", ar: "مسار العمل" } },
    { id: "projects", href: "#projects", label: { he: "פרויקטים", ar: "المشاريع" } },
    { id: "contact", href: "#contact", label: { he: "צור קשר", ar: "تواصل" } },
  ],
  hero: {
    eyebrow: {
      he: siteContent.hero.eyebrow,
      ar: "هندسة معمارية • تصميم داخلي • تراخيص بناء",
    },
    title: {
      he: siteContent.hero.title,
      ar: "التخطيط الصحيح يبدأ من الداخل",
    },
    subtitle: {
      he: siteContent.hero.subtitle,
      ar: "شيرين ترافق المشاريع الخاصة والمهنية بأسلوب هادئ ودقيق وفاخر، من الفكرة الأولى وحتى التنفيذ.",
    },
    primaryButtonText: {
      he: siteContent.hero.primaryButtonText,
      ar: "لتنسيق لقاء تعارف",
    },
    secondaryButtonText: {
      he: siteContent.hero.secondaryButtonText,
      ar: "عرض الخدمات",
    },
    stats: [
      {
        value: "+26",
        label: {
          he: siteContent.hero.stats[0]?.label || "",
          ar: "سنوات من الخبرة في التخطيط والترخيص والتصميم",
        },
      },
      {
        value: "360",
        label: {
          he: siteContent.hero.stats[1]?.label || "",
          ar: "غلاف كامل تحت سقف مهني واحد",
        },
      },
      {
        value: "רגוע",
        label: {
          he: siteContent.hero.stats[2]?.label || "",
          ar: "هندسة معمارية تبدأ من جودة الحياة",
        },
      },
    ],
  },
  about: {
    kicker: {
      he: "הסיפור שמאחורי הגישה",
      ar: "القصة وراء المنهج",
    },
    title: {
      he: siteContent.about.title,
      ar: "تخطيط يجمع بين الدقة المهنية وجودة الحياة والحضور الخالد",
    },
    description: {
      he: siteContent.about.description,
      ar: "مهندسة معمارية وخريجة التخنيون مع أكثر من 26 سنة من الخبرة في مرافقة المشاريع والتخطيط الدقيق وتراخيص البناء.",
    },
    secondaryDescription: {
      he: siteContent.about.secondaryDescription,
      ar: "مع السنوات أصبح واضحاً أن التخطيط الجيد لا ينتهي عند التصاريح والمخططات، بل يخلق مساحة أفضل للحياة نفسها، ولذلك انضمت لغة التصميم الداخلي الدقيقة والحساسة إلى عالم التخطيط.",
    },
    highlights: {
      he: siteContent.about.highlights,
      ar: [
        "خبرة مهنية لهندسة معمارية مع أساس هندسي واسع",
        "انتقال طبيعي من التخطيط والترخيص إلى تصميم داخلي دقيق وعالي الجودة",
        "دمج نادر بين العمارة والتصميم وإمكانية الوصول ضمن رؤية واحدة",
      ],
    },
    quote: {
      he: siteContent.about.quote,
      ar: "التصميم الجيد ليس جمالاً فقط، بل هو الطريقة التي يعمل بها المكان ويشعر ويمنح الحياة سلاسة أكثر.",
    },
    mediaLabel: {
      he: "אדריכלות + עיצוב + נגישות",
      ar: "عمارة + تصميم + إتاحة",
    },
    infoTileTitle: {
      he: "26+ שנות ניסיון",
      ar: "+26 سنة خبرة",
    },
    infoTileText: {
      he: "שפה תכנונית חמה, נקייה ומדויקת לבתים אמיתיים.",
      ar: "لغة تخطيطية دافئة ونظيفة ودقيقة لبيوت حقيقية.",
    },
  },
  services: {
    eyebrow: {
      he: "שירותים",
      ar: "الخدمات",
    },
    title: {
      he: siteContent.services.title,
      ar: "خدمات تُبنى كقصة واحدة متكاملة",
    },
    intro: {
      he: siteContent.services.intro,
      ar: "كل خدمة قوية بحد ذاتها، لكن القيمة الحقيقية تظهر عندما تتصل جميع المراحل بصورة دقيقة وهادئة وقابلة للتنفيذ.",
    },
    items: siteContent.services.items.map((item, index) => ({
      id: `service-${index + 1}`,
      title: {
        he: item.title,
        ar: [
          "التخطيط المعماري",
          "تراخيص البناء",
          "التصميم الداخلي",
          "المخططات التفصيلية",
          "الإشراف والمرافقة",
        ][index] || item.title,
      },
      description: {
        he: item.description,
        ar: [
          "صياغة مفهوم متكامل وتوزيع صحيح للمساحة وتخطيط يجمع بين الجمال والوظيفة.",
          "مرافقة منظمة أمام السلطات، وفحوصات وتعديلات ومخططات تدفع المشروع بثقة.",
          "تصميم يترجم التخطيط إلى تجربة حياة متكاملة من مواد وألوان وإضاءة وأجواء.",
          "مجموعة مخططات واضحة للتنفيذ تربط الفكرة الكبيرة بالتفاصيل اليومية.",
          "حضور مهني على طول الطريق لضمان أن تبقى الفكرة صحيحة أيضاً في الموقع.",
        ][index] || item.description,
      },
      points: {
        he: item.points,
        ar: [
          ["مفهوم تخطيطي", "توزيع المساحات", "تفكير طويل الأمد"],
          ["فحوصات أولية", "إعداد ملف الترخيص", "تنسيق مع الجهات المصادقة"],
          ["لغة تصميمية", "اختيار المواد", "تخطيط الإضاءة والأجواء"],
          ["نجارة", "واجهات وتكسية", "تنسيق الأنظمة"],
          ["مرافقة التنفيذ", "تنسيق الموردين", "الحفاظ على الدقة والجودة"],
        ][index] || item.points,
      },
    })),
  },
  process: {
    eyebrow: {
      he: "תהליך העבודה",
      ar: "مسار العمل",
    },
    title: {
      he: siteContent.whyChooseUs.title,
      ar: "مسار عمل هادئ وواضح ودقيق",
    },
    intro: {
      he: siteContent.whyChooseUs.intro,
      ar: "كل مرحلة تُبنى بمنطق وإيقاع صحيح وشفافية، لتمنحكم رحلة أكثر أماناً ونتيجة أكثر تكاملاً.",
    },
    items: siteContent.whyChooseUs.items.map((item, index) => ({
      id: `process-${index + 1}`,
      title: {
        he: item.title,
        ar: ["جمع المعلومات", "التخطيط الأولي", "الفحوصات والموافقات", "التنفيذ والمرافقة"][index] || item.title,
      },
      description: {
        he: item.description,
        ar: [
          "فهم الاحتياجات وطبيعة الحياة في المكان وقيود التخطيط وأهداف المشروع.",
          "بناء مفهوم أولي واسكتشات تخطيطية تترجم المعطيات إلى اتجاه دقيق.",
          "نزول إلى التفاصيل وفحوصات مهنية وتعديلات ومسار ترخيص يقدّم المشروع بشكل صحيح.",
          "مرافقة في الموقع وتنسيقات واختيارات مواد وإشراف يحافظ على الخط من البداية.",
        ][index] || item.description,
      },
    })),
  },
  projectsSection: {
    eyebrow: {
      he: "פרויקטים / גלריה",
      ar: "المشاريع / المعرض",
    },
    title: {
      he: siteContent.projects.title,
      ar: "مشاريع مختارة",
    },
    intro: {
      he: siteContent.projects.intro,
      ar: "لغة معمارية هادئة وطبقات مواد وضوء طبيعي ودقة في التفاصيل. يمكن استبدال الصور المؤقتة بصور المشاريع الحقيقية في أي وقت.",
    },
    helper: {
      he: "פרויקטים נבחרים בתצוגה נקייה ונוחה יותר לדסקטופ ולמובייל.",
      ar: "مشاريع مختارة ضمن عرض أنظف وأسهل للديسكتوب والموبايل.",
    },
    ctaLabel: {
      he: "לדבר על פרויקט דומה",
      ar: "لنتحدث عن مشروع مشابه",
    },
    previousLabel: {
      he: "הקודם",
      ar: "السابق",
    },
    nextLabel: {
      he: "הבא",
      ar: "التالي",
    },
  },
  cta: {
    eyebrow: {
      he: "מעטפת מלאה",
      ar: "حزمة كاملة",
    },
    title: {
      he: siteContent.cta.title,
      ar: "كل الخدمات في مكان واحد",
    },
    description: {
      he: siteContent.cta.description,
      ar: "لا حاجة لملاحقة مزودين مختلفين أو ربط التخطيط والترخيص والتصميم والتنفيذ بشكل مستقل. كل العملية تُدار بلغة واحدة وتحت سقف واحد.",
    },
    primaryButtonText: {
      he: siteContent.cta.primaryButtonText,
      ar: "لنبدأ",
    },
    secondaryButtonText: {
      he: siteContent.cta.secondaryButtonText,
      ar: "محادثة واتساب",
    },
  },
  contact: {
    eyebrow: {
      he: "Contact",
      ar: "تواصل",
    },
    title: {
      he: siteContent.contact.title,
      ar: "لنتحدث عن مشروعكم",
    },
    description: {
      he: siteContent.contact.description,
      ar: "إذا كنتم تبحثون عن تخطيط دقيق وتصميم هادئ ومرافقة مهنية من البداية وحتى التنفيذ، فهذا هو الوقت المناسب لبدء الحديث.",
    },
    formTitle: {
      he: siteContent.contact.formTitle,
      ar: "اتركوا التفاصيل",
    },
    formDescription: {
      he: siteContent.contact.formDescription,
      ar: "يمكن البدء برسالة قصيرة وتنسيق مكالمة تعارف وفهم ما هو الأنسب لمشروعكم.",
    },
    whatsappTitle: {
      he: siteContent.contact.whatsappTitle,
      ar: "تفضلون واتساب؟",
    },
    whatsappDescription: {
      he: siteContent.contact.whatsappDescription,
      ar: "يمكن إرسال رسالة مباشرة والحصول على رد أولي سريع حول التخطيط أو الترخيص أو التصميم أو مرافقة التنفيذ.",
    },
    responseNote: {
      he: siteContent.contact.responseNote,
      ar: "عادة يتم الرد الأولي خلال يوم عمل.",
    },
    labels: {
      name: { he: "שם מלא", ar: "الاسم الكامل" },
      email: { he: "כתובת מייל", ar: "البريد الإلكتروني" },
      phone: { he: "טלפון", ar: "الهاتف" },
      message: { he: "ספרו על הפרויקט", ar: "أخبرونا عن المشروع" },
      submit: { he: "שליחת פנייה", ar: "إرسال الطلب" },
    },
    placeholders: {
      name: { he: "איך קוראים לכם?", ar: "ما اسمكم؟" },
      email: { he: "name@example.com", ar: "name@example.com" },
      phone: { he: "לא חובה, אבל מומלץ", ar: "ليس إلزامياً ولكنه مفيد" },
      message: {
        he: "מה אתם מתכננים? בית פרטי, שיפוץ, רישוי או עיצוב?",
        ar: "ماذا تخططون؟ بيت خاص، تجديد، ترخيص أم تصميم؟",
      },
    },
    infoTitle: {
      he: "טלפון או מייל",
      ar: "هاتف أو بريد إلكتروني",
    },
  },
  quote: {
    text: {
      he: siteContent.quote.text,
      ar: "التصميم الجيد ليس جمالاً فقط، بل جودة حياة.",
    },
    subtext: {
      he: siteContent.quote.subtext,
      ar: "عندما تلتقي العمارة والتصميم والفهم الإنساني، يبدأ المكان بالعمل بشكل صحيح حقاً.",
    },
  },
  footer: {
    text: {
      he: siteContent.footer.text,
      ar: "شيرين تدمج بين العمارة والتصميم الداخلي وتراخيص البناء لصناعة مساحات دقيقة ومريحة وخالدة.",
    },
    rights: {
      he: "כל הזכויות שמורות.",
      ar: "جميع الحقوق محفوظة.",
    },
    bottomTagline: {
      he: "אדריכלות, עיצוב פנים ורישוי בגישה אחת שלמה.",
      ar: "عمارة وتصميم داخلي وترخيص ضمن رؤية واحدة متكاملة.",
    },
  },
  seo: {
    pageTitle: {
      he: siteConfig.pageTitle,
      ar: "شيرين | عمارة وتصميم داخلي وتراخيص بناء",
    },
    pageDescription: {
      he: siteConfig.pageDescription,
      ar: "تخطيط معماري وتصميم داخلي وتراخيص بناء تحت سقف واحد، بأسلوب هادئ ودقيق وراق.",
    },
    keywords: {
      he: siteConfig.keywords,
      ar: ["هندسة معمارية", "تصميم داخلي", "تراخيص بناء", "تخطيط معماري", "شيرين"],
    },
    openGraphTitle: {
      he: siteConfig.openGraphTitle,
      ar: "شيرين | التخطيط الصحيح يبدأ من الداخل",
    },
    openGraphDescription: {
      he: siteConfig.openGraphDescription,
      ar: "استوديو عمارة وتصميم داخلي بخبرة تزيد عن 26 سنة يجمع بين التخطيط والترخيص والإتاحة والتصميم الداخلي.",
    },
  },
};

export type LocalizedSectionKey =
  | "hero"
  | "about"
  | "services"
  | "process"
  | "projectsSection"
  | "cta"
  | "contact"
  | "quote"
  | "footer"
  | "seo";

export const contentSectionOrder: Array<{
  key: LocalizedSectionKey;
  label: string;
}> = [
  { key: "hero", label: "בית" },
  { key: "about", label: "אודות" },
  { key: "services", label: "שירותים" },
  { key: "process", label: "תהליך עבודה" },
  { key: "projectsSection", label: "פרויקטים" },
  { key: "cta", label: "קריאה לפעולה" },
  { key: "contact", label: "צור קשר" },
  { key: "quote", label: "ציטוט" },
  { key: "footer", label: "פוטר" },
  { key: "seo", label: "SEO" },
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, overrideValue: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(overrideValue) ? overrideValue : base) as T;
  }

  if (!isObject(base)) {
    return (overrideValue ?? base) as T;
  }

  const merged: Record<string, unknown> = { ...base };
  const overrideObject = isObject(overrideValue) ? overrideValue : {};

  Object.keys(base).forEach((key) => {
    merged[key] = mergeDeep((base as Record<string, unknown>)[key], overrideObject[key]);
  });

  return merged as T;
}

export function getMergedLocalizedContent(storedContent?: unknown): LocalizedSiteContent {
  return mergeDeep(defaultLocalizedContent, storedContent);
}

export function getLocalizedText(
  value: LocalizedText,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage,
) {
  return value[language] || value[fallbackLanguage] || "";
}

export function getLocalizedArray(
  value: LocalizedArrayText,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage,
) {
  return value[language]?.length ? value[language] : value[fallbackLanguage] || [];
}
