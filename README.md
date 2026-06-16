# Tony Baker Interactive CV

An interactive React and TypeScript CV for Tony Baker, designed for recruiters, hiring managers, and technical leaders who want more than a static resume PDF.

The site presents Tony's senior engineering profile as a focused, explorable web experience. It combines a concise executive summary, measurable impact highlights, an interactive career timeline, a capability map, education details, and direct contact actions in a single responsive application.

## Purpose

This project is both a personal CV and a small product-quality frontend example. The aim is to make Tony's experience easy to scan quickly while still giving technical readers enough depth to understand the kind of systems, teams, and business problems he has worked with.

The content is aimed at roles such as:

- Distinguished Engineer
- AI Engineering Lead
- AI Architect
- AI Product Engineer
- Senior hands-on individual contributor roles

## What the Website Does

The application turns a traditional CV into an interactive profile.

### Overview Section

The first screen introduces Tony's professional positioning, location, target roles, and summary. It includes two primary actions:

- Start a conversation by opening a pre-addressed email link.
- Download a PDF copy of the CV from the public assets folder.

The profile panel also highlights role fit, location, and core positioning around production AI, architecture, and platform modernisation.

### Navigation Rail

A fixed navigation rail lets visitors jump directly to key sections:

- Overview
- Impact
- Experience
- Expertise
- Contact

When a visitor clicks a navigation item, the target section receives a short visual highlight. This helps orient the reader and makes the single-page layout feel more deliberate.

### Theme Toggle

The site supports light and dark modes through local React state. The theme toggle changes the root application class, and the visual system is driven by CSS custom properties so both themes share the same component structure.

### Impact Highlights

The impact section surfaces measurable engineering outcomes, including:

- 90% reduction in configuration time.
- Ensemble solve times reduced to under one minute.
- 100% AI-assisted development adoption across relevant teams.
- 82% improvement in legacy API processing time.

These cards are intended to help recruiters and hiring managers quickly identify concrete results rather than only responsibilities.

### Interactive Experience Timeline

The experience section is built as a selectable timeline. Each role appears as a button in the timeline list. Selecting a role updates the detail panel with:

- Role title
- Company
- Dates
- Location
- Professional focus
- Capability tags
- Achievement bullets

This makes the career history easier to explore than a long static list, especially for visitors who want to compare leadership, architecture, AI, and hands-on engineering work across different periods.

### Expertise Map

The expertise section groups capabilities into selectable categories:

- AI and agent ecosystem
- Architecture and patterns
- Languages and frameworks
- Infrastructure and enablement
- Leadership

Each category updates the panel beside it with a summary and skill tags. The goal is to make the technical range visible without overwhelming the page with a single dense skills list.

### Education and Availability

The closing section includes education, academic distinction, availability, contact links, phone, email, and LinkedIn. It is designed as a conversion point for recruiters who have finished scanning the profile and want to make contact.

## Technical Overview

This is a Vite-powered React application using TypeScript.

Core technologies:

- React 19
- TypeScript
- Vite
- Lucide React icons
- CSS custom properties for theming
- Responsive CSS media queries

The app is intentionally lightweight. It does not require a backend, database, authentication, or environment variables. All CV content is local structured data rendered by React components.

## Project Structure

```text
.
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public/
│   ├── Tony_Baker_CV.pdf
│   ├── tony-baker-headshot.png
│   └── waikato-logo.svg
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── data/
│       └── cv.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## How the Code Works

### `src/data/cv.ts`

This file contains the structured CV content used by the application. It exports:

- `profile`: name, title, contact details, target roles, and summary copy.
- `impactHighlights`: measurable outcomes shown in the impact card grid.
- `timeline`: career history used by the interactive experience section.
- `expertise`: grouped skill and capability categories.
- `education`: degree, field, institution, and distinction.
- `availability`: current availability and working-time-zone context.

Keeping the CV content in a dedicated data file makes the site easier to maintain. Most copy updates can be made without changing the React component structure.

### `src/App.tsx`

This is the main application component. It handles:

- Rendering the full single-page CV experience.
- Tracking the selected timeline entry.
- Tracking the selected expertise category.
- Switching between light and dark themes.
- Triggering temporary section highlights when navigation links are used.
- Rendering smaller UI components such as `TimelineButton` and `ExpertisePanel`.

The component uses `useState`, `useMemo`, `useRef`, and `useEffect` for local interaction state. There is no global state management because the app is small and self-contained.

### `src/styles.css`

This file contains the full visual system and responsive layout. It defines:

- Light and dark theme tokens.
- Page layout and fixed navigation.
- Hero, impact, timeline, expertise, education, contact, and footer styles.
- Section highlight animation.
- Mobile and tablet responsive rules.
- Reduced-motion handling through `prefers-reduced-motion`.

The design uses CSS variables heavily so that theme changes are centralized and component styles remain consistent.

### `public/`

The public folder contains static assets that Vite serves from the site root:

- `/Tony_Baker_CV.pdf` for the downloadable CV.
- `/tony-baker-headshot.png` for the profile image.
- `/waikato-logo.svg` for the education section.

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Vite will serve the site locally. The project script binds to `127.0.0.1`.

## Production Build

Create a production build:

```bash
pnpm build
```

This runs TypeScript compilation first, then creates the optimized Vite output in:

```text
dist/
```

Preview the production build locally:

```bash
pnpm preview
```

## Deploying to Vercel

This project is ready for Vercel as a standard Vite app.

Recommended Vercel import settings:

- Framework Preset: `Vite`
- Root Directory: `./`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Environment Variables: none required

After the GitHub repository is connected to Vercel, pushes to the production branch can automatically trigger deployments.

## Maintenance Notes

To update the CV content, edit:

```text
src/data/cv.ts
```

To change layout, styling, theme colors, or responsive behavior, edit:

```text
src/styles.css
```

To update the main rendering logic or add new interactive sections, edit:

```text
src/App.tsx
```

To replace the downloadable PDF or image assets, update the files in:

```text
public/
```

## Quality Checks

Before publishing changes, run:

```bash
pnpm build
```

This verifies that TypeScript compiles successfully and that Vite can produce the production build Vercel will deploy.
