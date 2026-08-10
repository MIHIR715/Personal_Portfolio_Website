export type Project = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  category: string | null;
  tags: string[];
  description: string | null;
  short_description: string | null;
  year: string | null;
  role: string | null;
  tools: string[];
  thumbnail_url: string | null;
  hero_image_url: string | null;
  gallery: string[];
  problem: string | null;
  goal: string | null;
  research: string | null;
  user_flow: string[];
  wireframes: string[];
  design_exploration: string[];
  design_system: string | null;
  final_ui: string[];
  prototype_url: string | null;
  outcome: string | null;
  learnings: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  name: string;
  professional_title: string | null;
  hero_headline: string | null;
  hero_description: string | null;
  about_text: string | null;
  philosophy: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  availability: string | null;
  avatar_url: string | null;
  resume_url: string | null;
};

export type Skill = { id: string; category: string; name: string; display_order: number };
export type Education = {
  id: string;
  institution: string;
  degree: string;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
  description: string | null;
  display_order: number;
};
export type Experience = {
  id: string;
  title: string;
  organization: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
};
export type SocialLink = { id: string; platform: string; url: string; display_order: number };
export type Message = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const WORK_FILTERS = [
  "All",
  "UI/UX",
  "Mobile",
  "Web",
  "E-commerce",
  "Interaction Design",
  "Design Systems",
] as const;

export const CORE_COMPETENCIES = [
  "User-Centered Design",
  "Visual Design",
  "Wireframing",
  "Prototyping",
  "Figma",
  "Design Systems",
  "Interaction Design",
  "Information Architecture",
  "Responsive Design",
  "Mobile-First Design",
  "Component Libraries",
  "Accessibility",
  "Usability Testing",
  "Developer Handoff",
  "Typography",
  "Design Thinking",
];

export const PROCESS_STAGES = [
  { no: "01", title: "Understand", text: "Understand users, context, and requirements." },
  { no: "02", title: "Research", text: "Explore users, competitors, and existing patterns." },
  { no: "03", title: "Explore", text: "Create flows, wireframes, and design directions." },
  { no: "04", title: "Design", text: "Create high-fidelity UI and interactive prototypes." },
  { no: "05", title: "Refine", text: "Test, iterate, improve, and prepare for implementation." },
];
