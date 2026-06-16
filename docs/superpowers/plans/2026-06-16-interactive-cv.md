# Interactive CV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished React/TypeScript interactive CV website for Tony Baker that showcases senior AI engineering, architecture, and React capability.

**Architecture:** Use a Vite React single-page app with structured CV data in TypeScript and focused presentational components. Keep interaction state in `App.tsx`: active timeline item, active expertise filter, and theme.

**Tech Stack:** React, TypeScript, Vite, CSS custom properties, lucide-react icons.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`

- [x] **Step 1: Add Vite React/TypeScript project metadata**

Create a Vite app shell with scripts for development, build, preview, and package installation through pnpm.

- [x] **Step 2: Add TypeScript and Vite config**

Configure browser JSX compilation and strict TypeScript checks.

### Task 2: CV Content Model

**Files:**
- Create: `src/data/cv.ts`

- [x] **Step 1: Convert the DOCX content into typed data**

Represent profile, contact, target roles, expertise groups, impact highlights, timeline entries, education, and availability as exported constants.

- [x] **Step 2: Preserve exact high-value claims**

Keep measurable outcomes from the CV, including 90% configuration-time reduction, 25-minutes-to-under-1-minute solve time, 100% AI-assisted development adoption, and 82% API processing reduction.

### Task 3: React Interface

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`

- [x] **Step 1: Build the app layout**

Implement left navigation, hero summary, impact cards, interactive experience timeline, expertise filters, stack chips, availability, and contact actions.

- [x] **Step 2: Add interactivity**

Support active timeline selection, expertise category filtering, and dark/light theme toggle.

### Task 4: Styling

**Files:**
- Create: `src/styles.css`

- [x] **Step 1: Implement the engineering cockpit design**

Use an off-white, charcoal, deep-teal, warm-amber, and blue-accent palette with restrained cards, 8px radii, responsive grid layout, and polished typography.

- [x] **Step 2: Add responsive behavior**

Ensure the app works on desktop and mobile, with navigation collapsing into a horizontal toolbar and panels stacking naturally.

### Task 5: Verification

**Files:**
- No source files required.

- [x] **Step 1: Install dependencies**

Run pnpm install with the bundled Node runtime.

- [x] **Step 2: Build**

Run `pnpm build` and fix TypeScript or bundling errors.

- [x] **Step 3: Browser verification**

Run the dev server and inspect the app visually in a browser at desktop and mobile sizes.
