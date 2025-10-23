// taxonomy.ts

/* =========================================
   Single source of truth for the taxonomy
   - Strongly typed (literal unions)
   - Safe helpers for UI + validation
========================================= */

export const TAXONOMY = {
  Development: {
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

  Design: {
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

  "Architecture / 3D": {
    "CAD / BIM": ["CAD Suites", "Open Source CAD", "BIM Tools"],
    Visualization: [
      "Rendering Engines",
      "Lighting Simulation",
      "Material Libraries",
    ],
    "Project Management": ["Collaboration", "Blueprint Repositories"],
  },

  "Content & Writing": {
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

  "Marketing & Analytics": {
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

  "Video & Audio": {
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

  Productivity: {
    "Knowledge Management": ["Notes", "Wikis", "PKM"],
    "Project Management": ["Kanban", "Roadmapping", "Time Tracking"],
    Collaboration: ["Whiteboards", "Meetings", "Calendars"],
    Automation: ["No-code Automation", "Scripting"],
    "Browsing & Research": ["Web Clippers", "Archivers"],
    "Writing Aids": ["Spellcheck", "Summarizers", "Paraphrasers"],
  },

  "Education & E-Learning": {
    "Course Platforms": ["LMS", "MOOCs"],
    Authoring: ["Course Builders", "Interactive Tools"],
    Assessment: ["Quizzes", "Proctoring"],
    "Classroom Tools": ["Student Response", "Attendance"],
    Certification: ["Badging", "Credentials"],
    "Tutoring & AI Assistants": ["Study Aids", "AI Tutors"],
  },
} as const;

/* ========= Types ========= */

export type Main = keyof typeof TAXONOMY; // literal union of main categories
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

export const CATEGORY_OPTIONS_BY_MAIN: Record<Main, string[]> =
  Object.fromEntries(
    Object.entries(TAXONOMY).map(([main, cats]) => [main, Object.keys(cats)])
  ) as Record<Main, string[]>;

export const SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT: Record<
  Main,
  Record<string, readonly string[]>
> = Object.fromEntries(
  Object.entries(TAXONOMY).map(([main, cats]) => [
    main,
    Object.fromEntries(Object.entries(cats).map(([cat, subs]) => [cat, subs])),
  ])
) as Record<Main, Record<string, readonly string[]>>;

/* ========= Fast validation set (optional but handy) ========= */

export const VALID_TRIPLES = new Set(
  Object.entries(TAXONOMY).flatMap(([main, cats]) =>
    Object.entries(cats).flatMap(([cat, subs]) =>
      (subs as readonly string[]).map(
        (sub: string) => `${main}>>>${cat}>>>${sub}`
      )
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
