/**
 * Single source of truth for everything on the site.
 * Edit this file to update content — every section reads from here.
 */

export const site = {
  url: "https://srikar-knightark007-portfolio.vercel.app",
  name: "Srikar Molahalli",
  shortName: "Srikar",
  title: "Srikar Molahalli — Software Engineer · Compilers, Cloud & Quantum",
  description:
    "CS undergrad at NMIMS MPSTME building compilers, cloud systems, spacecraft simulations and Rust-based quantum tooling. Ex-Collins Aerospace (RTX) and IISER Kolkata. AIR 455 in GATE 2026.",
  resume: "/Srikar_Molahalli_Resume.pdf",
}

/**
 * Festive intro. Set `enabled: false` once the season is over and the
 * site opens straight into the hero.
 */
export const festival = {
  enabled: true,
  /** Shown once per browser session; the diya button in the nav replays it. */
  oncePerSession: true,
  leetcodeHandle: "ProtagonistSyndrome",
}

export const contact = {
  email: "srikar.molahalli@gmail.com",
  phone: "+91 94288 52241",
  phoneHref: "tel:+919428852241",
  github: "https://github.com/Arknight007",
  githubHandle: "Arknight007",
  linkedin: "https://www.linkedin.com/in/srikar-molahalli",
  linkedinHandle: "srikar-molahalli",
  leetcode: "https://leetcode.com/u/ProtagonistSyndrome/",
}

export const hero = {
  eyebrow: "B.Tech CSE · NMIMS MPSTME, Mumbai",
  roles: [
    "builds compilers from scratch.",
    "ships cloud-native systems.",
    "simulates spacecraft landings.",
    "writes Rust for qubits.",
    "leads GDG Cloud on campus.",
  ],
  summary:
    "CS undergrad working across full-stack Java, cloud, research-driven software engineering and Rust-based quantum computing. I've shipped secure authentication systems, my own programming language and solar-science simulations, and I lead cloud computing at Google Developer Group and the Coding Club at NMIMS.",
  orbits: [
    { label: "Compilers", icon: "braces" },
    { label: "Cloud", icon: "cloud" },
    { label: "Quantum", icon: "atom" },
    { label: "Aerospace", icon: "satellite" },
    { label: "Full-stack", icon: "layers" },
    { label: "Web3", icon: "wallet" },
  ],
} as const

export const honours = [
  { value: 455, prefix: "AIR ", suffix: "", label: "GATE 2026", note: "All India Rank" },
  { value: 94, prefix: "", suffix: "%ile", label: "JEE Main", note: "Percentile" },
  { value: 12, prefix: "", suffix: "k", label: "JEE Advanced", note: "Rank" },
  { value: 0, prefix: "", suffix: "", text: "KVPY", label: "Scholar", note: "Kishore Vaigyanik Protsahan Yojana" },
  { value: 0, prefix: "", suffix: "", text: "NTSE", label: "Scholar", note: "National Talent Search Exam" },
] as const

export const stats = [
  { value: 2, suffix: "", label: "research & industry internships" },
  { value: 75, suffix: "%", label: "less turnaround with asyncio parsers" },
  { value: 95, suffix: "%", label: "test coverage on shipped systems" },
  { value: 10, suffix: "+", label: "certifications across GCP, AWS & AI" },
]

export type Metric = { label: string; from?: string; to?: string; value: number; direction: "up" | "down"; absolute?: boolean }

export type Role = {
  id: string
  org: string
  orgShort: string
  role: string
  program?: string
  period: string
  location: string
  accent: "saffron" | "teal"
  viz: "pipeline" | "descent"
  bullets: string[]
  metrics: Metric[]
  stack: string[]
}

export const experience: Role[] = [
  {
    id: "collins",
    org: "RTX Corporation · Collins Aerospace",
    orgShort: "Collins Aerospace",
    role: "Junior Software Intern, Mission Systems",
    program: "Summer Engineering Internship Program",
    period: "May 2025 — Jul 2025",
    location: "Bengaluru, India",
    accent: "saffron",
    viz: "pipeline",
    bullets: [
      "Accelerated the processing pipeline with CUDA and multithreading, cutting overall compute time by 20%.",
      "Automated parsing workflows with Python asyncio, shrinking turnaround from 8 hours to 2 hours.",
      "Expanded the integration test suite with multiprocessing, lifting coverage to 95% and speeding releases by 40%.",
      "Set up Jenkins-driven CI/CD pipelines that trimmed manual integration work by 50%.",
    ],
    metrics: [
      { label: "Compute time", value: 20, direction: "down" },
      { label: "Parse turnaround", from: "8h", to: "2h", value: 75, direction: "down" },
      { label: "Test coverage", value: 95, direction: "up", absolute: true },
      { label: "Release speed", value: 40, direction: "up" },
      { label: "Manual integration", value: 50, direction: "down" },
    ],
    stack: ["CUDA", "Python asyncio", "Multiprocessing", "Jenkins", "CI/CD"],
  },
  {
    id: "iiser",
    org: "Indian Institute of Science Education and Research",
    orgShort: "IISER Kolkata",
    role: "Junior Summer Associate Research Intern",
    period: "May 2024 — Jul 2024",
    location: "Kolkata, India",
    accent: "teal",
    viz: "descent",
    bullets: [
      "Studied instability patterns to support fuel-efficient mission planning for soft landings — a 15% gain overall.",
      "Explored spacecraft paths through simulation workflows, lowering landing deviation by 10% in evaluation.",
      "Modelled spacecraft motion with numerical analysis, improving touchdown precision by 5% across key scenarios.",
      "Built an interactive trajectory & flow dashboard that cut interpretation time by 30%.",
    ],
    metrics: [
      { label: "Fuel efficiency", value: 15, direction: "up" },
      { label: "Landing deviation", value: 10, direction: "down" },
      { label: "Touchdown precision", value: 5, direction: "up" },
      { label: "Interpretation time", value: 30, direction: "down" },
    ],
    stack: ["Numerical methods", "Trajectory simulation", "Python", "Dashboards"],
  },
]

export type Project = {
  id: string
  name: string
  tagline: string
  date: string
  stack: string[]
  link: string
  bullets: string[]
  highlights: { value: string; label: string }[]
  viz: "compiler" | "solar" | "defi"
}

export const projects: Project[] = [
  {
    id: "quasar",
    name: "Quasar",
    tagline: "A statically-typed programming language and its compiler, down to 32-bit x86.",
    date: "Oct 2025",
    stack: ["C", "LLVM", "Flex", "Bison", "x86 Assembly"],
    link: "https://github.com/Arknight007",
    bullets: [
      "Hand-built lexer and parser that construct a syntax tree for semantic validation and code generation.",
      "LLVM infrastructure for an optimised intermediate representation and faster execution.",
      "Full pipeline — syntax, semantics, code emission — processing 1,000+ lines of source.",
      "95% test coverage with a validation pipeline across diverse input programs.",
    ],
    highlights: [
      { value: "95%", label: "test coverage" },
      { value: "1k+", label: "LoC compiled" },
      { value: "x86", label: "32-bit target" },
    ],
    viz: "compiler",
  },
  {
    id: "solar",
    name: "Solar Positioning Equinox Simulator",
    tagline: "Where is the Sun, right now, from here? A real-time astronomical simulation.",
    date: "Mar 2025",
    stack: ["Java", "JavaFX", "Swing", "JDBC/ODBC"],
    link: "https://github.com/Arknight007/Solar-Positioning-Equinox-Simulator-",
    bullets: [
      "Visualises the Sun's position relative to Earth across equinoxes and solstices with trigonometric models.",
      "Four major astronomical events animated in real time — 60% higher user engagement.",
      "Interface refactor for 30% lower latency and a cleaner modular codebase.",
      "Side panel with 10+ inputs for dimension control — 40% more simulation flexibility.",
    ],
    highlights: [
      { value: "60%", label: "more engagement" },
      { value: "−30%", label: "latency" },
      { value: "10+", label: "live controls" },
    ],
    viz: "solar",
  },
  {
    id: "borderless",
    name: "Borderless Financial Inclusion",
    tagline: "DeFi remittances for SDG 10 — instant, low-fee transfers across chains.",
    date: "Apr 2025",
    stack: ["React", "TypeScript", "Flask", "Ethers.js", "Web3", "three.js", "Tailwind"],
    link: "https://github.com/Arknight007/Borderless-FinTrans-Defi",
    bullets: [
      "Flask-backed DeFi platform across 5+ blockchains, reducing cross-border remittance fees by 90%.",
      "Responsive React + three.js + Web3 frontend with 30% faster UI rendering.",
      "Customised yield wallets with user-specific strategies delivering up to 40% APY.",
      "Real-time transaction tracking with Ethers.js; data models handling 10,000+ records.",
    ],
    highlights: [
      { value: "−90%", label: "remittance fees" },
      { value: "5+", label: "chains" },
      { value: "10k+", label: "records" },
    ],
    viz: "defi",
  },
]

export const sideQuests = [
  {
    name: "SecureAuth CRUD System",
    blurb: "Full-stack auth: registration, login, password management and protected routes.",
    lang: "JavaScript",
    stack: "Node · Express · MongoDB · React",
    link: "https://github.com/Arknight007/SecureAuth_CRUD-System",
  },
  {
    name: "Neural Synthesis",
    blurb: "Text-to-3D model generator powered by Hyper3D Rodin.",
    lang: "TypeScript",
    stack: "Next.js · 3D",
    link: "https://github.com/Arknight007/Neural-Synthesis-",
  },
  {
    name: "OrbitX6 · SIH",
    blurb: "Crew-autonomy platform: predictive health, spacecraft maintenance and threat management.",
    lang: "TypeScript",
    stack: "AI · Space systems",
    link: "https://github.com/Arknight007/SIH_OrbitX6",
  },
  {
    name: "Heart Disease Prediction",
    blurb: "LogReg baseline vs Random Forest vs XGBoost on 920 patients from the UCI dataset.",
    lang: "Jupyter Notebook",
    stack: "scikit-learn · XGBoost",
    link: "https://github.com/Arknight007/Heart-Disease-Prediction-System",
  },
  {
    name: "Air Quality IoT",
    blurb: "Live air-quality telemetry from sensors to a dashboard via Blynk.",
    lang: "TypeScript",
    stack: "IoT · Blynk",
    link: "https://github.com/Arknight007/Air-Quality-IOT-Blynk",
  },
  {
    name: "Leave Application System",
    blurb: "Student leave workflow with faculty approvals and real-time status.",
    lang: "Java",
    stack: "Java Swing · MySQL",
    link: "https://github.com/Arknight007/leave-applicationNM",
  },
]

export const langColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  C: "#555555",
  Python: "#3572A5",
}

export type SkillGroup = { id: string; label: string; blurb: string; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    blurb: "Systems to scripting — from x86 emission to notebooks.",
    skills: ["Python", "Java", "C", "C++", "Rust", "TypeScript", "JavaScript", "SQL", "Scala", "Julia", "R", "HTML"],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    blurb: "Full-stack web, APIs and desktop UIs.",
    skills: ["React", "Next.js", "Node.js", "Express", "FastAPI", "Flask", "Angular", "JavaFX", "Tailwind", "REST", "Ethers.js"],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    blurb: "Containers, pipelines and three clouds.",
    skills: ["Google Cloud", "AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "Azure DevOps", "GCP CI/CD", "Linux", "GitLab", "Monitoring"],
  },
  {
    id: "data",
    label: "Data",
    blurb: "Relational, graph, document and warehouse.",
    skills: ["PostgreSQL", "Neo4j", "MongoDB", "BigQuery", "Snowflake", "Supabase", "Neon", "AppSheet"],
  },
  {
    id: "ai",
    label: "AI & Quantum",
    blurb: "Models, GPUs and qubits.",
    skills: ["PyTorch", "CUDA", "Qiskit", "Cirq", "Ollama", "Selenium", "Postman", "Git"],
  },
]

export const education = {
  school: "NMIMS Deemed-to-be University",
  campus: "Mukesh Patel School of Technology Management & Engineering",
  degree: "B.Tech, Computer Science",
  period: "Jul 2023 — Present",
  cgpa: "2.97 / 4",
  coursework: [
    { name: "Edge Cloud Computing", icon: "cloud" },
    { name: "Distributed System Design", icon: "network" },
    { name: "Operating Systems & Research", icon: "cpu" },
    { name: "Data Structures & Algorithms", icon: "braces" },
    { name: "Computer Networks & Security", icon: "shield" },
    { name: "Database Management Systems", icon: "database" },
    { name: "Computer Architecture", icon: "chip" },
    { name: "AI/ML: Deep Learning", icon: "brain" },
    { name: "Quantum Computing", icon: "atom" },
  ],
} as const

export const leadership = [
  { role: "Cloud Computing Lead", org: "Google Developer Group on Campus" },
  { role: "Lead", org: "Coding Club, NMIMS" },
]

export const publication = {
  title: "Beyond Relational: Leveraging Graph Databases for Efficient Real-time Data Processing",
  venue: "Annacis Research and Event Centre, Vancouver, Canada",
  status: "To be published in Inspire Intelligence Journal (ISSN 3110-942X)",
}

export const certifications = [
  { name: "Cloud Computing Foundations", issuer: "Google Cloud" },
  { name: "Networking & Security in Google Cloud", issuer: "Google Cloud" },
  { name: "AWS Certified AI Practitioner (AIF-C01)", issuer: "Amazon Web Services" },
  { name: "Claude with Amazon Bedrock", issuer: "Anthropic" },
  { name: "Claude with Google Cloud's Vertex AI", issuer: "Anthropic" },
  { name: "CS50x: Introduction to Computer Science", issuer: "Harvard" },
  { name: "CS50P: Programming with Python", issuer: "Harvard" },
  { name: "CS50AI: AI with Python", issuer: "Harvard" },
  { name: "DeepLearning.AI Certificate", issuer: "DeepLearning.AI" },
]

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
]
