export type ProjectCategory = "Residential" | "Commercial";

export type ProjectFormState = {
  id?: string;
  title_he: string;
  title_ar: string;
  description_he: string;
  description_ar: string;
  category: ProjectCategory;
  location: string;
  image: string;
  galleryImages: string[];
  isPublished: boolean;
  isFeatured: boolean;
};

export type ProjectItem = ProjectFormState & {
  id: string;
  createdAt: string;
};

export const emptyProjectForm: ProjectFormState = {
  title_he: "",
  title_ar: "",
  description_he: "",
  description_ar: "",
  category: "Residential",
  location: "",
  image: "",
  galleryImages: [],
  isPublished: true,
  isFeatured: false,
};
