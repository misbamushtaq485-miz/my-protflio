/**
 * Single source of truth for portfolio content.
 * `icon` values are Lucide component names resolved inside each page.
 */

export const profile = {
  name: "Misba Mushtaq",
  initials: "MM",
  role: "Information Technology Student & Frontend Developer",
  shortRole: "IT Student & Developer",
  location: "Srinagar, Jammu & Kashmir, India",
  locationShort: "Srinagar, Kashmir",
  school: "Kashmir Government Polytechnic (KGP), Srinagar",
  schoolShort: "KGP Srinagar",
  semester: "5th Semester",
  email: "misbamushtaq485@gmail.com",
  linkedin: "https://www.linkedin.com/in/misbajaan",
  linkedinHandle: "linkedin.com/in/misbajaan",
  tagline:
    "I combine technical fundamentals with a keen aesthetic eye to build fast, accessible, user-centred web experiences.",
} as const;

export const rotatingWords = [
  "accessible",
  "performant",
  "responsive",
  "delightful",
];

export const stats = [
  { value: 5, suffix: "", pad: true, label: "Semester in IT", hint: "Diploma programme" },
  { value: 3, suffix: "+", pad: true, label: "Shipped projects", hint: "Built end to end" },
  { value: 12, suffix: "+", pad: false, label: "Tools & topics", hint: "Actively practising" },
  { value: 100, suffix: "%", pad: false, label: "Commitment", hint: "Learning every day" },
];

export const marqueeItems = [
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "JavaScript ES6+",
  "Astro",
  "Git & GitHub",
  "Accessibility",
  "Responsive Design",
  "DBMS",
  "Computer Networks",
  "Vite",
  "View Transitions",
  "Figma",
  "Data Structures",
];

export type SkillCategory = "frontend" | "styling" | "tooling" | "foundations";

export const skillCategories: { id: SkillCategory | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "frontend", label: "Frontend" },
  { id: "styling", label: "Styling & UI" },
  { id: "tooling", label: "Tooling" },
  { id: "foundations", label: "CS Foundations" },
];

export const skills = [
  {
    name: "HTML5 & Semantics",
    cat: "frontend" as SkillCategory,
    tag: "Core",
    level: 90,
    icon: "Code",
    desc: "Accessible markup, semantic document outlines and clean SEO foundations.",
  },
  {
    name: "CSS3 & Modern Layout",
    cat: "styling" as SkillCategory,
    tag: "Fluent",
    level: 85,
    icon: "Palette",
    desc: "Flexbox, grid, fluid type, container-aware layouts and glass surfaces.",
  },
  {
    name: "Tailwind CSS v4",
    cat: "styling" as SkillCategory,
    tag: "Daily driver",
    level: 88,
    icon: "Brush",
    desc: "Design tokens, custom variants and utility-first component systems.",
  },
  {
    name: "JavaScript (ES6+)",
    cat: "frontend" as SkillCategory,
    tag: "Core",
    level: 78,
    icon: "Terminal",
    desc: "DOM APIs, events, async flows, form validation and reactive UI logic.",
  },
  {
    name: "Astro Framework",
    cat: "frontend" as SkillCategory,
    tag: "Specialised",
    level: 72,
    icon: "Layers",
    desc: "Static-first architecture, component islands and View Transitions.",
  },
  {
    name: "Git & GitHub",
    cat: "tooling" as SkillCategory,
    tag: "Essential",
    level: 75,
    icon: "GitBranch",
    desc: "Branching workflows, reviewable commits and deployment pipelines.",
  },
  {
    name: "Accessibility & UX",
    cat: "styling" as SkillCategory,
    tag: "Focus",
    level: 80,
    icon: "Compass",
    desc: "Keyboard paths, contrast, ARIA semantics and mobile-first thinking.",
  },
  {
    name: "Databases (DBMS)",
    cat: "foundations" as SkillCategory,
    tag: "Coursework",
    level: 68,
    icon: "Database",
    desc: "Relational modelling, normalisation and SQL query fundamentals.",
  },
  {
    name: "Computer Networks",
    cat: "foundations" as SkillCategory,
    tag: "Coursework",
    level: 65,
    icon: "Network",
    desc: "TCP/IP stack, HTTP lifecycle, DNS and client–server architecture.",
  },
  {
    name: "Vite & PNPM",
    cat: "tooling" as SkillCategory,
    tag: "Workflow",
    level: 70,
    icon: "Zap",
    desc: "Fast dev servers, bundling, workspaces and dependency hygiene.",
  },
  {
    name: "Data Structures",
    cat: "foundations" as SkillCategory,
    tag: "Coursework",
    level: 64,
    icon: "Binary",
    desc: "Arrays, stacks, queues, linked lists and complexity intuition.",
  },
  {
    name: "UI Design in Figma",
    cat: "styling" as SkillCategory,
    tag: "Growing",
    level: 60,
    icon: "Frame",
    desc: "Wireframes, spacing systems, type scales and component thinking.",
  },
];

export const projects = [
  {
    slug: "registration",
    number: "01",
    title: "Student Registration Portal",
    kind: "Interactive Web Application",
    featured: true,
    summary:
      "A student intake system with real-time validation, semantic input grouping and a live digital ID card that updates as you type.",
    highlights: [
      "Live preview card bound to form state",
      "Native constraint validation with friendly feedback",
      "Accessible fieldsets and keyboard-complete flow",
    ],
    stack: ["HTML5", "Tailwind CSS", "JavaScript DOM", "Client Validation"],
    href: "/projects/registration/",
    cta: "Open live demo",
    accent: "brand",
  },
  {
    slug: "resume",
    number: "02",
    title: "Interactive Resume System",
    kind: "Profile & Print Platform",
    featured: false,
    summary:
      "A print-ready digital resume with theme-adaptive styling, a dedicated print stylesheet and smooth Astro View Transitions.",
    highlights: [
      "One document, screen and paper optimised",
      "Light / dark / system theme persistence",
      "Shared-element transitions between pages",
    ],
    stack: ["Astro 7", "Tailwind CSS", "View Transitions", "Print CSS"],
    href: "/resume/",
    cta: "View full resume",
    accent: "accent",
  },
  {
    slug: "portfolio",
    number: "03",
    title: "This Portfolio",
    kind: "Design System & Static Site",
    featured: false,
    summary:
      "A token-driven design system with an ambient aurora backdrop, scroll-reveal choreography, custom carousels and an animated timeline — zero UI libraries.",
    highlights: [
      "Hand-built carousel: drag, keyboard, autoplay, dots",
      "Scroll-linked timeline and reading progress",
      "Reduced-motion and print variants throughout",
    ],
    stack: ["Astro", "Tailwind v4", "TypeScript", "Lucide"],
    href: "#work",
    cta: "You are looking at it",
    accent: "violet",
  },
];

export const milestones = [
  {
    phase: "Foundation",
    period: "2023 – 2024",
    title: "Started the IT Diploma",
    place: "KGP Srinagar",
    icon: "GraduationCap",
    desc: "Began formal computing studies — programming basics, computer architecture and the first taste of building for the web.",
    tags: ["C Programming", "Architecture", "Web Basics"],
  },
  {
    phase: "Craft",
    period: "2024 – 2025",
    title: "Went deep on frontend",
    place: "Self-driven practice",
    icon: "Code",
    desc: "Moved from tutorials to shipping: semantic HTML, responsive CSS systems, DOM-driven interactivity and version control as a habit.",
    tags: ["HTML/CSS", "JavaScript", "Git"],
  },
  {
    phase: "Current",
    period: "2025 – 2026",
    title: "5th semester + real projects",
    place: "KGP Srinagar",
    icon: "Rocket",
    desc: "Balancing DBMS, networks and software engineering coursework with building production-shaped interfaces in Astro and Tailwind.",
    tags: ["DBMS", "Networks", "Astro"],
    current: true,
  },
  {
    phase: "Next",
    period: "Forward looking",
    title: "Software engineer",
    place: "Web & tech industry",
    icon: "Compass",
    desc: "Looking for an internship or junior role where I can learn from a strong team and ship human-centred software at a real standard of craft.",
    tags: ["Internship", "Frontend", "Full-stack"],
  },
];

export const learning = [
  {
    title: "TypeScript",
    status: "In progress",
    progress: 55,
    icon: "FileCode",
    desc: "Typing component props, narrowing DOM queries and catching mistakes before the browser does.",
  },
  {
    title: "React fundamentals",
    status: "Next up",
    progress: 25,
    icon: "Atom",
    desc: "Components, state and effects — the vocabulary most teams build with day to day.",
  },
  {
    title: "SQL & data modelling",
    status: "Coursework",
    progress: 65,
    icon: "Database",
    desc: "Joins, constraints and normalisation, reinforced by DBMS labs this semester.",
  },
  {
    title: "Web performance",
    status: "Ongoing",
    progress: 45,
    icon: "Gauge",
    desc: "Core Web Vitals, image formats, lazy loading and keeping JavaScript budgets honest.",
  },
  {
    title: "Testing basics",
    status: "Exploring",
    progress: 20,
    icon: "FlaskConical",
    desc: "Writing my first unit tests and learning what is actually worth asserting.",
  },
  {
    title: "Accessibility audits",
    status: "Practising",
    progress: 50,
    icon: "Accessibility",
    desc: "Screen-reader passes, focus order reviews and colour-contrast checks on every build.",
  },
];

export const principles = [
  {
    title: "Accessible by default",
    icon: "Accessibility",
    desc: "Semantics and keyboard paths first — not an audit bolted on at the end.",
  },
  {
    title: "Fast on purpose",
    icon: "Zap",
    desc: "Static-first delivery, lean JavaScript and images that carry their own weight.",
  },
  {
    title: "Systems over pages",
    icon: "Boxes",
    desc: "Tokens and reusable components so the tenth screen costs less than the first.",
  },
  {
    title: "Learn by shipping",
    icon: "Hammer",
    desc: "Every concept from class gets turned into something that actually runs.",
  },
];

export const navItems = [
  { label: "About", href: "#about", id: "about", icon: "User" },
  { label: "Skills", href: "#skills", id: "skills", icon: "Code" },
  { label: "Work", href: "#work", id: "work", icon: "Layers" },
  { label: "Journey", href: "#journey", id: "journey", icon: "Calendar" },
  { label: "Contact", href: "#contact", id: "contact", icon: "Mail" },
];
