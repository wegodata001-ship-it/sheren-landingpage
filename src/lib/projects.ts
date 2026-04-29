export const PROJECTS = {
  DESIGMA: "desigma",
  OREL: "orel_fitness",
  LAWYER: "lawyer_page",
  SHIRIN: "shirin_page",
} as const;

export type ProjectKey = (typeof PROJECTS)[keyof typeof PROJECTS];

// Backward-compatible alias during migration.
export const PROJECT_KEYS = PROJECTS;
