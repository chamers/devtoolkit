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
  /* ================= DEVELOPMENT ================= */

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

  /* ================= DESIGN ================= */

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

  /* ================= ARCHITECTURE / ENGINEERING ================= */

  [MainCategory.ARCHITECTURE_ENGINEERING]: {
    "CAD / BIM": ["CAD Suites", "Open Source CAD", "BIM Tools"],
    Visualization: [
      "Rendering Engines",
      "Lighting Simulation",
      "Material Libraries",
    ],
    "Project Management": ["Collaboration", "Blueprint Repositories"],
  },

  /* ================= CONTENT CREATION ================= */

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

  /* ================= MARKETING & ANALYTICS ================= */

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

  /* ================= VIDEO & AUDIO ================= */

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

  /* ================= PRODUCTIVITY ================= */

  [MainCategory.PRODUCTIVITY]: {
    "Knowledge Management": ["Notes", "Wikis", "PKM"],
    "Project Management": ["Kanban", "Roadmapping", "Time Tracking"],
    Collaboration: ["Whiteboards", "Meetings", "Calendars"],
    Automation: ["No-code Automation", "Scripting"],
    "Browsing & Research": ["Web Clippers", "Archivers"],
    "Writing Aids": ["Spellcheck", "Summarizers", "Paraphrasers"],
  },

  /* ================= EDUCATION ================= */

  [MainCategory.EDUCATION_ELEARNING]: {
    "Course Platforms": ["LMS", "MOOCs"],
    Authoring: ["Course Builders", "Interactive Tools"],
    Assessment: ["Quizzes", "Proctoring"],
    "Classroom Tools": ["Student Response", "Attendance"],
    Certification: ["Badging", "Credentials"],
    "Tutoring & AI Assistants": ["Study Aids", "AI Tutors"],
  },

  /* ================= SECURITY ================= */

  [MainCategory.SECURITY]: {
    "AppSec & DevSecOps": [
      "SAST / DAST",
      "Dependency / SBOM Scanning",
      "Secrets Scanning",
      "Secure CI/CD",
      "Threat Modeling",
    ],
    "Identity & Access": [
      "SSO / OIDC",
      "Password Managers",
      "MFA / Passkeys",
      "RBAC / ABAC",
    ],
    "Network Security": [
      "Firewalls",
      "WAF",
      "VPN / Zero Trust",
      "DDoS Protection",
    ],
    "Cloud Security": ["CSPM", "CWPP", "Key Management", "Policy as Code"],
    "Monitoring & Response": [
      "SIEM",
      "SOAR",
      "Incident Response",
      "Threat Intelligence",
    ],
    "Privacy & Compliance": [
      "GDPR Tools",
      "DLP",
      "Consent Management",
      "Risk Management",
    ],
  },

  /* ================= UTILITIES ================= */

  [MainCategory.UTILITIES]: {
    "File & Storage": [
      "Compression / Archiving",
      "File Transfer",
      "Backup & Sync",
      "Encryption Tools",
    ],
    "PDF & Documents": ["PDF Editors", "PDF Converters", "OCR", "eSignatures"],
    "Media Utilities": [
      "Image Compression",
      "Format Conversion",
      "Background Removal",
      "Metadata Tools",
    ],
    "Developer Utilities": [
      "API Clients",
      "Regex Tools",
      "JSON / YAML Tools",
      "Code Formatters",
      "CLI Tools",
    ],
    "System & Performance": [
      "System Monitoring",
      "Process Managers",
      "Network Diagnostics",
    ],
    "Browser Utilities": [
      "Ad Blockers",
      "Tab Managers",
      "Read-it-later",
      "Translation Tools",
    ],
  },

  /* ================= FINANCE ================= */

  [MainCategory.FINANCE]: {
    "Accounting & Bookkeeping": [
      "Invoicing",
      "Expenses",
      "Payroll",
      "VAT / Tax",
    ],
    "Personal Finance": ["Budgeting", "Subscriptions", "Net Worth Tracking"],
    "Business Finance": ["Cash Flow", "Forecasting", "Billing", "Reporting"],
    Payments: ["Payment Gateways", "Checkout", "Fraud Prevention"],
    Investing: ["Portfolio Tracking", "Market Data", "Crypto Tools"],
    "Tax & Compliance": ["Self Assessment", "Corporation Tax", "AML / KYC"],
  },

  /* ================= HEALTH & WELLNESS ================= */

  [MainCategory.HEALTH_WELLNESS]: {
    Fitness: ["Workout Plans", "Strength Training", "Wearables"],
    Nutrition: ["Meal Planning", "Calorie Tracking", "Recipes"],
    "Mental Wellbeing": ["Meditation", "Journaling", "Stress Management"],
    Sleep: ["Sleep Tracking", "Sleep Coaching", "Smart Alarms"],
    Medical: ["Telehealth", "Medication Reminders", "Health Records"],
  },

  /* ================= GAMING ================= */

  [MainCategory.GAMING]: {
    "Game Development": ["Engines", "Asset Pipelines", "Testing / QA"],
    Streaming: ["Streaming Software", "Overlays", "Chat Tools"],
    Communities: ["Voice Chat", "Guild / Clan Tools", "Moderation"],
    Performance: ["FPS Monitoring", "Graphics Optimization"],
    Utilities: ["Launchers", "Mods", "Game Trackers"],
  },

  /* ================= CLOUD INFRASTRUCTURE ================= */

  [MainCategory.CLOUD_INFRASTRUCTURE]: {
    Providers: ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Cloudflare"],
    Compute: ["VMs", "Containers", "Kubernetes", "Serverless"],
    Storage: ["Object Storage", "Block Storage", "Backups", "CDN"],
    Networking: ["VPC", "Load Balancers", "DNS", "API Gateways"],
    Observability: ["Logging", "Metrics", "Tracing", "Alerting"],
    "Infrastructure as Code": ["Terraform", "Pulumi", "CloudFormation"],
    Security: ["IAM", "Secrets Management", "Compliance", "Cost Controls"],
  },

  /* ================= OTHERS ================= */

  [MainCategory.OTHERS]: {
    Communication: ["Email", "Team Chat", "Video Conferencing", "Async Video"],
    "Business Operations": ["CRM", "HR / Hiring", "Legal", "Contracts"],
    "E-commerce": ["Storefronts", "Shipping", "Returns", "Reviews"],
    "AI Assistants": [
      "General Assistants",
      "Meeting Assistants",
      "Support Bots",
    ],
    Miscellaneous: ["Templates", "Directories", "Tool Collections", "Other"],
  },
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
