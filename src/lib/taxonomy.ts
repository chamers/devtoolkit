// lib/taxonomy.ts
import { MainCategory } from "@prisma/client";

/* =========================================
   Single source of truth for the taxonomy
   - Uses Prisma MainCategory enum as keys
   - Safe helpers for UI + validation
========================================= */

export const TAXONOMY: Record<
  MainCategory,
  Record<string, readonly string[]>
> = {
  [MainCategory.DEVELOPMENT]: {
    Frontend: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Frameworks",
      "Accessibility",
      "Design Systems",
    ],
    Backend: [
      "APIs (REST/GraphQL/gRPC)",
      "Databases / ORM",
      "Authentication",
      "Security",
      "Testing",
      "Caching & Queues",
    ],
    DevOps: [
      "CI/CD",
      "Containers",
      "Networking",
      "Cloud",
      "Observability (Logs/Tracing/Metrics)",
      "IaC",
      "Secrets & Config",
    ],
    Fullstack: [
      "Version Control",
      "Monorepos",
      "Project Scaffolding",
      "Serverless / Edge",
      "Package Managers",
    ],
    "AI/ML": [
      "AI APIs",
      "LLM Tooling",
      "Data Processing",
      "Vector Databases",
      "Model Hosting",
    ],
    Mobile: ["iOS", "Android", "Cross-platform"],
    "Data & Analytics Eng": ["ETL / ELT", "Data Warehouses", "BI / Dashboards"],
  },

  [MainCategory.DESIGN]: {
    "UI/UX Design": [
      "Wireframing",
      "Prototyping",
      "Design Tokens",
      "Accessibility",
    ],
    "Graphic Design": [
      "Illustration",
      "Icons",
      "Typography",
      "Textures / Patterns",
    ],
    Branding: ["Logo Design", "Brand Kits", "Mockups", "Naming Tools"],
    "3D / Motion": ["3D Modeling", "Motion Design", "Rendering Tools"],
  },

  [MainCategory.ARCHITECTURE_ENGINEERING]: {
    "CAD / BIM": ["CAD Suites", "Open Source CAD", "BIM Tools"],
    Visualization: [
      "Rendering Engines",
      "Lighting Simulation",
      "Material Libraries",
    ],
    "Project Management": ["Collaboration", "Blueprint Repositories"],
  },

  [MainCategory.CONTENT_CREATION]: {
    Copywriting: [
      "Grammar / Style",
      "AI Writing Assistants",
      "Plagiarism Checkers",
    ],
    "Technical Writing": [
      "Documentation Frameworks",
      "Markdown Editors",
      "API Docs",
    ],
    "Blogging / SEO": ["CMS Tools", "Headless CMS", "Keyword Research"],
  },

  [MainCategory.MARKETING_ANALYTICS]: {
    "SEO & Analytics": [
      "Traffic / Ranking",
      "A/B Testing",
      "Attribution",
      "Heatmaps",
    ],
    "Social Media": [
      "Scheduling",
      "Publishing",
      "Brand Monitoring",
      "Social Listening",
      "Community Management",
      "Creator / UGC Tools",
      "Reporting & Analytics",
    ],
    Automation: ["Workflow Automation", "Integrations", "iPaaS"],
    Research: ["Surveys", "User Research", "Market Intelligence"],
  },

  [MainCategory.VIDEO_AUDIO]: {
    "Video Editing": [
      "Non-linear Editing",
      "Mobile Editors",
      "Templates / Presets",
    ],
    "Motion Design / VFX": [
      "Compositing",
      "2D/3D Animation",
      "Titles / Lower Thirds",
    ],
    Filmmaking: ["Cinematography", "Storyboarding", "Shot Planning"],
    "Audio Production": ["DAWs", "Mixing & Mastering", "Voice-over"],
    Color: ["Color Grading", "LUTs", "Calibration"],
    Delivery: ["Streaming / Publishing", "Subtitling", "Captioning"],
    "AI Media": [
      "Generative Video",
      "Auto-Cut & Summaries",
      "Upscaling / Enhancement",
    ],
    Assets: ["Stock Footage", "Music & SFX", "Transitions / Overlays", "Foley"],
  },

  [MainCategory.PRODUCTIVITY]: {
    "Knowledge Management": ["Notes", "Wikis", "PKM"],
    "Project Management": ["Kanban", "Roadmapping", "Time Tracking"],
    Collaboration: ["Whiteboards", "Meetings", "Calendars"],
    Automation: ["No-code Automation", "Scripting"],
    "Browsing & Research": ["Web Clippers", "Archivers"],
    "Writing Aids": ["Spellcheck", "Summarizers", "Paraphrasers"],
  },

  [MainCategory.EDUCATION_ELEARNING]: {
    "Course Platforms": ["LMS", "MOOCs"],
    Authoring: ["Course Builders", "Interactive Tools"],
    Assessment: ["Quizzes", "Proctoring"],
    "Classroom Tools": ["Student Response", "Attendance"],
    Certification: ["Badging", "Credentials"],
    "Tutoring & AI Assistants": ["Study Aids", "AI Tutors"],
  },

  // For the remaining enums, you can start minimal and grow over time:
  [MainCategory.SECURITY]: {},
  [MainCategory.UTILITIES]: {},
  [MainCategory.FINANCE]: {},
  [MainCategory.HEALTH_WELLNESS]: {},
  [MainCategory.GAMING]: {},
  [MainCategory.CLOUD_INFRASTRUCTURE]: {},
  [MainCategory.OTHERS]: {},
};

/* ========= Types ========= */

export type Main = MainCategory;
export type CategoryName = string;
export type SubcategoryName = string;

export type CategoryTriple = {
  mainCategory: Main;
  category: CategoryName;
  subcategory: SubcategoryName;
};

export type CategoryPath = `${Main} > ${string} > ${string}`;

/* ========= Helpers for UI ========= */

export const MAIN_CATEGORIES = Object.keys(TAXONOMY) as Main[];

// list of category names for each main
export const CATEGORY_OPTIONS_BY_MAIN: Record<Main, string[]> =
  Object.fromEntries(
    Object.entries(TAXONOMY).map(([main, cats]) => [main, Object.keys(cats)])
  ) as Record<Main, string[]>;

// list of subcategory names for each main-category pair
export const SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT: Record<
  Main,
  Record<string, readonly string[]>
> = TAXONOMY;

/* ========= Fast validation set ========= */

export const VALID_TRIPLES = new Set(
  Object.entries(TAXONOMY).flatMap(([main, cats]) =>
    Object.entries(cats).flatMap(([cat, subs]) =>
      subs.map((sub) => `${main}>>>${cat}>>>${sub}`)
    )
  )
);

/* ========= Convenience utils ========= */

export function toCategoryPath(triple: CategoryTriple): CategoryPath {
  return `${triple.mainCategory} > ${triple.category} > ${triple.subcategory}`;
}

export function isValidTriple(triple: CategoryTriple): boolean {
  const key = `${triple.mainCategory}>>>${triple.category}>>>${triple.subcategory}`;
  return VALID_TRIPLES.has(key);
}
