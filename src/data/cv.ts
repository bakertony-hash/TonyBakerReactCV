export type ExpertiseCategory = {
  id: string;
  label: string;
  summary: string;
  items: string[];
};

export type ImpactHighlight = {
  metric: string;
  label: string;
  detail: string;
  theme: "teal" | "amber" | "blue" | "ink";
};

export type TimelineEntry = {
  id: string;
  company: string;
  logo?: {
    src: string;
    alt: string;
    variant?: "square" | "wide";
  };
  role: string;
  period: string;
  location: string;
  focus: string;
  tags: string[];
  bullets: string[];
};

export const profile = {
  name: "Tony Baker",
  title: "Distinguished Engineer | AI Engineering | Software Architect",
  location: "Auckland, New Zealand",
  email: "baker.tony@gmail.com",
  phone: "+64 201 111 721",
  linkedin: "linkedin.com/in/tony-baker-nz",
  targetRoles: [
    "Distinguished Engineer",
    "AI Engineering Lead",
    "AI Architect",
    "AI Product Engineer",
  ],
  summary: [
    "Distinguished Engineer and Software Architect with more than 26 years of experience delivering commercial software products, modernising high-throughput enterprise platforms and designing resilient, scalable systems.",
    "Hands‑on senior Individual Contributor (IC) specialising in emerging technologies and business execution, delivering production‑ready AI and agentic workflows while driving platform modernisation and cross‑functional alignment.",
  ],
};

export const expertise: ExpertiseCategory[] = [
  {
    id: "ai",
    label: "AI & Agent Ecosystem",
    summary: "Production-minded AI adoption, agent workflows and RAG systems.",
    items: [
      "Agentic workflows",
      "RAG Systems",
      "Vector Databases",
      "Custom Agents",
      "MCP",
      "Azure AI Foundry",
      "OpenAI APIs",
      "Claude Code",
      "Cursor",
      "Prompt Engineering",
    ],
  },
  {
    id: "architecture",
    label: "Architecture & Patterns",
    summary: "Enterprise architecture for resilient, high-throughput platforms.",
    items: [
      "Software architecture",
      "Distributed systems",
      "Microservices",
      "Event-driven architecture",
      "Predictive forecasting platforms",
      "SaaS",
      "Critical infrastructure",
    ],
  },
  {
    id: "stack",
    label: "Languages & Frameworks",
    summary: "Commercial software delivery across modern and legacy systems.",
    items: [
      "C#",
      ".NET",
      "TypeScript",
      "React",
      "SQL Server",
      "Oracle",
      "RabbitMQ",
      "C++",
    ],
  },
  {
    id: "enablement",
    label: "Infrastructure & Enablement",
    summary: "Enablement, automation and delivery infrastructure.",
    items: [
      "Kubernetes",
      "Azure",
      "AWS",
      "Azure DevOps",
      "CI/CD pipelines",
      "Enablement",
      "Technical strategy",
      "Global collaboration",
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    summary: "Strategic IC leadership across technical, product and business groups.",
    items: [
      "Technical strategy",
      "Architecture governance",
      "Enablement",
      "Stakeholder engagement",
      "Global team management",
      "Cross-border collaboration",
    ],
  },
];

export const impactHighlights: ImpactHighlight[] = [
  {
    metric: "90%",
    label: "reduction in configuration time",
    detail:
      "Architected self-service forecasting microservices that reduced multi-team engineering configuration from several hours to 15 minutes.",
    theme: "teal",
  },
  {
    metric: "96%+",
    label: "faster ensemble solve time",
    detail:
      "Optimised production compute performance, reducing forecasting solve times from 25 minutes to under 1 minute.",
    theme: "amber",
  },
  {
    metric: "100%",
    label: "AI-assisted development adoption",
    detail:
      "Drove practical adoption across cross-functional Forecasting teams in APAC and the US through workshops, pairing and safety frameworks.",
    theme: "blue",
  },
  {
    metric: "82%",
    label: "API processing improvement",
    detail:
      "Reduced critical legacy API processing time from 2m20s to 25s while improving throughput and lowering database CPU utilisation.",
    theme: "ink",
  },
];

export const timeline: TimelineEntry[] = [
  {
    id: "yes-distinguished",
    company: "Yes Energy",
    logo: {
      src: "/yes-energy-logo.png",
      alt: "Yes Energy logo",
      variant: "square",
    },
    role: "Distinguished Engineer",
    period: "May 2024 - Present",
    location: "Auckland, New Zealand (Remote / Hybrid)",
    focus: "AI integration, platform modernisation and cross-team Developer Enablement.",
    tags: ["Leadership", "AI", "Architecture", "Platform", "Enablement"],
    bullets: [
      "A senior hands-on IC directing AI integration, technical strategy, platform modernisation and cross-team developer enablement.",
      "Championed practical AI and agent workflows using Claude Code, Cursor, Azure AI Foundry, custom AI skills and targeted internal micro-agents.",
      "Designed production-grade forecasting automation architectures that centralised system execution and decoupled dependencies on SysOps and reliability teams.",
      "Constructed Azure DevOps CI/CD pipelines and modular infrastructure patterns for repeatable, predictable software deployment.",
      "Created automated migration utilities for substantial historical predictive forecast data sets, including roughly 38,800 records, resolving a critical commercial customer friction point.",
      "Accelerated organisational engineering productivity by driving 100% adoption of AI-assisted development across cross-functional Forecasting teams in APAC and the US via practical workshops, pair-programming and safety frameworks.",
    ],
  },
  {
    id: "tesla-md",
    company: "TESLA Asia Pacific",
    logo: {
      src: "/tesla-logo.png",
      alt: "TESLA logo",
      variant: "wide",
    },
    role: "Managing Director",
    period: "Mar 2021 - May 2024",
    location: "Auckland, New Zealand",
    focus: "Regional strategy, technical architecture, operations and post-acquisition continuity.",
    tags: ["Leadership", "Strategy", "Architecture", "Operations"],
    bullets: [
      "Directed regional business and technical strategies spanning core engineering, analytics delivery, support and international business development.",
      "Senior customer stakeholder management with direct technical architecture and product delivery.",
      "Guided the Asia Pacific business through post-acquisition integration with Yes Energy while maintaining customer continuity and operational performance.",
      "Intentionally realigned from operational leadership toward a Distinguished Engineer technical track.",
      "Managed APAC budget in excess of NZD $1 million.",
    ],
  },
  {
    id: "tesla-regional",
    company: "TESLA Asia Pacific",
    logo: {
      src: "/tesla-logo.png",
      alt: "TESLA logo",
      variant: "wide",
    },
    role: "Regional Director",
    period: "Dec 2010 - Mar 2021",
    location: "Auckland, New Zealand",
    focus: "Built APAC operation and delivered globally deployed forecasting SaaS products.",
    tags: ["Leadership", "SaaS", "Forecasting", "Architecture", "Business Building"],
    bullets: [
      "Founded and grew the Asia Pacific operation into a 10-person multidisciplinary regional business unit.",
      "Built long-term relationships with utilities, grid operators, energy retailers and trading organisations across the region.",
      "Served as principal architect and primary developer of TESLAWeb, a globally deployed energy forecasting SaaS platform.",
      "Worked across US, UK and APAC teams to support mission-critical forecasting operations and product delivery.",
    ],
  },
  {
    id: "tesla-europe",
    company: "TESLA Europe Limited",
    logo: {
      src: "/tesla-logo.png",
      alt: "TESLA logo",
      variant: "wide",
    },
    role: "Technical Manager",
    period: "Jul 2002 - Nov 2010",
    location: "London, United Kingdom",
    focus: "Engineering leadership for critical electricity and gas load forecasting applications.",
    tags: ["C#", ".NET", "C++", "SQL Server", "Energy"],
    bullets: [
      "Led engineering and delivery of critical commercial electricity and gas load forecasting applications.",
      "Architected, developed and maintained desktop and web analytical applications using C++, C#, .NET and SQL Server.",
      "Supported major utility operators comprising over 85% of the UK power market.",
    ],
  },
  {
    id: "earlier",
    company: "Earlier Career",
    role: "Software Engineer and Systems Developer",
    period: "1997 - 2002",
    location: "New Zealand and United Kingdom",
    focus: "Installation automation, trading systems, GPS software and data-heavy reporting.",
    tags: ["C++", "COM", "C#", ".NET", "SQL", "Automation"],
    bullets: [
      "Engineered remote deployment and automated installation packages for Barclays Bank PLC and HSBC AssetFinance.",
      "Developed middle-tier electronic trading components and early C#/.NET framework migrations at FFastFill Plc.",
      "Built high-performance C++/COM components, graphics engines and GPS receiver hardware library integrations at Trimble Navigation.",
      "Designed relational Access and SQL reporting databases for large-scale laboratory proficiency datasets at MAF Quality Management.",
    ],
  },
];

export const education = {
  degree: "Bachelor of Computing & Mathematical Sciences",
  field: "Computer Software Engineering",
  institution: "University of Waikato, NZ",
  distinction: [
    "First Class Honours",
    "Winner of the University Best Presentation Award in Computing and Mathematical Sciences",
  ],
};

export const availability =
  "Based in Auckland, New Zealand. Bringing 24+ years of cross-border collaboration spanning EU, US and APAC corporate time zones.";
