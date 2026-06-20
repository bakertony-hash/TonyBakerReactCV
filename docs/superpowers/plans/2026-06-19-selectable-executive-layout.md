# Selectable Static CV Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent Static Editorial layout alongside the existing Interactive CV while both presentations reuse the authoritative data in `src/data/cv.ts`.

**Architecture:** `App` becomes a small layout host backed by a defensive local-storage preference module. The current page moves intact to `InteractiveLayout`, while a separate `StaticLayout` renders every CV data group with its own semantic structure and scoped CSS. A shared `LayoutSwitcher` is rendered by both layouts so visitors can move between presentations without coupling their internal interactions.

**Tech Stack:** React 19, TypeScript, Vite 6, Vitest, Testing Library, Lucide React, CSS custom properties, ordinary responsive CSS

---

## File Structure

- Create `src/layouts/layoutPreference.ts`: layout identifiers plus defensive storage read/write functions.
- Create `src/layouts/layoutPreference.test.ts`: unit coverage for valid, invalid, absent, and failing storage.
- Create `src/components/LayoutSwitcher.tsx`: accessible presentation selector shared by both layouts.
- Create `src/layouts/InteractiveLayout.tsx`: current `App.tsx` presentation and interactions, moved without behavioural changes.
- Create `src/layouts/StaticLayout.tsx`: complete semantic Static Editorial renderer backed by `cv.ts`.
- Create `src/static.css`: CSS tokens and responsive presentation scoped to `.static-layout`.
- Modify `src/App.tsx`: initialize, persist, and render the chosen layout.
- Modify `src/App.test.tsx`: cover selection/persistence and preserve the existing interactive regression suite.
- Modify `src/styles.css`: add only shared layout-switcher rules and any extraction-safe global adjustments.
- Modify `src/main.tsx`: import `static.css` after the existing stylesheet.

## Task 1: Defensive Layout Preference

**Files:**
- Create: `src/layouts/layoutPreference.ts`
- Create: `src/layouts/layoutPreference.test.ts`

- [ ] **Step 1: Write the failing preference tests**

Create `src/layouts/layoutPreference.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import {
  LAYOUT_STORAGE_KEY,
  readLayoutPreference,
  writeLayoutPreference,
} from "./layoutPreference";

describe("layoutPreference", () => {
  it("returns a saved supported layout", () => {
    const storage = { getItem: vi.fn(() => "static") };

    expect(readLayoutPreference(storage)).toBe("static");
    expect(storage.getItem).toHaveBeenCalledWith(LAYOUT_STORAGE_KEY);
  });

  it.each([null, "", "magazine", "STATIC"])(
    "falls back to interactive for %s",
    (savedValue) => {
      const storage = { getItem: vi.fn(() => savedValue) };
      expect(readLayoutPreference(storage)).toBe("interactive");
    },
  );

  it("falls back when storage cannot be read", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new DOMException("blocked");
      }),
    };

    expect(readLayoutPreference(storage)).toBe("interactive");
  });

  it("writes the selected layout", () => {
    const storage = { setItem: vi.fn() };

    writeLayoutPreference("static", storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      LAYOUT_STORAGE_KEY,
      "static",
    );
  });

  it("does not throw when storage cannot be written", () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new DOMException("blocked");
      }),
    };

    expect(() => writeLayoutPreference("static", storage)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the unit test and verify the expected failure**

Run:

```powershell
pnpm test -- src/layouts/layoutPreference.test.ts
```

Expected: FAIL because `src/layouts/layoutPreference.ts` does not exist.

- [ ] **Step 3: Implement the preference module**

Create `src/layouts/layoutPreference.ts`:

```ts
export const LAYOUT_STORAGE_KEY = "tony-baker-cv-layout";

export const layoutIds = ["interactive", "static"] as const;
export type LayoutId = (typeof layoutIds)[number];

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

export function isLayoutId(value: unknown): value is LayoutId {
  return typeof value === "string" && layoutIds.includes(value as LayoutId);
}

export function readLayoutPreference(
  storage: ReadableStorage = window.localStorage,
): LayoutId {
  try {
    const savedValue = storage.getItem(LAYOUT_STORAGE_KEY);
    return isLayoutId(savedValue) ? savedValue : "interactive";
  } catch {
    return "interactive";
  }
}

export function writeLayoutPreference(
  layout: LayoutId,
  storage: WritableStorage = window.localStorage,
): void {
  try {
    storage.setItem(LAYOUT_STORAGE_KEY, layout);
  } catch {
    // Persistence is an enhancement; layout switching must still work.
  }
}
```

- [ ] **Step 4: Run the preference tests**

Run:

```powershell
pnpm test -- src/layouts/layoutPreference.test.ts
```

Expected: 8 generated test cases PASS (including the four invalid-value cases).

- [ ] **Step 5: Commit the preference boundary**

```powershell
git add src/layouts/layoutPreference.ts src/layouts/layoutPreference.test.ts
git commit -m "feat: add persistent CV layout preference"
```

## Task 2: Extract the Existing Interactive Layout

**Files:**
- Create: `src/layouts/InteractiveLayout.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Stabilize tests around the Interactive default**

In `src/App.test.tsx`, import `beforeEach` and clear storage before every test:

```ts
import { beforeEach, describe, expect, it } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
});
```

Keep all existing assertions. This makes the current suite explicitly exercise the default Interactive presentation.

- [ ] **Step 2: Run the regression suite before extraction**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: all existing App tests PASS.

- [ ] **Step 3: Move the existing presentation into `InteractiveLayout`**

Create `src/layouts/InteractiveLayout.tsx` from the complete current contents of `src/App.tsx`, then make only these mechanical changes:

```diff
-} from "./data/cv";
+} from "../data/cv";
+import LayoutSwitcher from "../components/LayoutSwitcher";
+import type { LayoutId } from "./layoutPreference";

-function App() {
+type InteractiveLayoutProps = {
+  currentLayout: LayoutId;
+  onLayoutChange: (layout: LayoutId) => void;
+};
+
+function InteractiveLayout({
+  currentLayout,
+  onLayoutChange,
+}: InteractiveLayoutProps) {
```

Render the shared selector directly above the existing theme-toggle button inside `.nav-rail`:

```tsx
<LayoutSwitcher
  currentLayout={currentLayout}
  onLayoutChange={onLayoutChange}
  compact
/>
```

Finish the file with:

```ts
export default InteractiveLayout;
```

At this step, create `src/components/LayoutSwitcher.tsx` with the following minimal accessible implementation so the extracted layout compiles:

```tsx
import type { LayoutId } from "../layouts/layoutPreference";

type LayoutSwitcherProps = {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
  compact?: boolean;
};

const choices: Array<{ id: LayoutId; label: string }> = [
  { id: "interactive", label: "Interactive" },
  { id: "static", label: "Static" },
];

function LayoutSwitcher({
  currentLayout,
  onLayoutChange,
  compact = false,
}: LayoutSwitcherProps) {
  return (
    <div
      className={compact ? "layout-switcher layout-switcher--compact" : "layout-switcher"}
      role="group"
      aria-label="CV layout"
    >
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          aria-pressed={currentLayout === choice.id}
          aria-label={`${choice.label} layout`}
          title={`${choice.label} layout`}
          onClick={() => onLayoutChange(choice.id)}
        >
          <span aria-hidden={compact}>{compact ? choice.label.slice(0, 1) : choice.label}</span>
        </button>
      ))}
    </div>
  );
}

export default LayoutSwitcher;
```

Replace `src/App.tsx` temporarily with a thin wrapper that renders the extracted layout:

```tsx
import InteractiveLayout from "./layouts/InteractiveLayout";

function App() {
  return (
    <InteractiveLayout
      currentLayout="interactive"
      onLayoutChange={() => undefined}
    />
  );
}

export default App;
```

- [ ] **Step 4: Run tests and build after extraction**

Run:

```powershell
pnpm test -- src/App.test.tsx
pnpm build
```

Expected: all App tests PASS and Vite produces `dist/` without TypeScript errors.

- [ ] **Step 5: Commit the extraction**

```powershell
git add src/App.tsx src/App.test.tsx src/components/LayoutSwitcher.tsx src/layouts/InteractiveLayout.tsx
git commit -m "refactor: isolate interactive CV layout"
```

## Task 3: Wire the Shared Layout Host and Selector

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Create: `src/layouts/StaticLayout.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing selection and persistence tests**

Add these imports to `src/App.test.tsx`:

```ts
import { LAYOUT_STORAGE_KEY } from "./layouts/layoutPreference";
```

Add these tests inside the `App` suite:

```ts
it("switches to the Static layout and persists the choice", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Static layout" }));

  expect(
    screen.getByRole("main", { name: "Static CV" }),
  ).toBeInTheDocument();
  expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("static");
});

it("restores the saved Static layout", () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");

  render(<App />);

  expect(
    screen.getByRole("main", { name: "Static CV" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Static layout" }),
  ).toHaveAttribute("aria-pressed", "true");
});

it("switches back to the Interactive layout", async () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Interactive layout" }));

  expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("interactive");
});
```

- [ ] **Step 2: Run the new App tests and verify failure**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: the three new tests FAIL because `App` does not yet own layout state.

- [ ] **Step 3: Add the layout host and initial Static renderer**

Replace `src/App.tsx` with:

```tsx
import { useState } from "react";
import StaticLayout from "./layouts/StaticLayout";
import InteractiveLayout from "./layouts/InteractiveLayout";
import {
  readLayoutPreference,
  writeLayoutPreference,
  type LayoutId,
} from "./layouts/layoutPreference";

function App() {
  const [layout, setLayout] = useState<LayoutId>(() => readLayoutPreference());

  const changeLayout = (nextLayout: LayoutId) => {
    setLayout(nextLayout);
    writeLayoutPreference(nextLayout);
  };

  if (layout === "static") {
    return (
      <StaticLayout
        currentLayout={layout}
        onLayoutChange={changeLayout}
      />
    );
  }

  return (
    <InteractiveLayout
      currentLayout={layout}
      onLayoutChange={changeLayout}
    />
  );
}

export default App;
```

Create the first valid `src/layouts/StaticLayout.tsx`:

```tsx
import LayoutSwitcher from "../components/LayoutSwitcher";
import { profile } from "../data/cv";
import type { LayoutId } from "./layoutPreference";

type StaticLayoutProps = {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
};

function StaticLayout({
  currentLayout,
  onLayoutChange,
}: StaticLayoutProps) {
  return (
    <div className="static-layout">
      <header className="static-header">
        <a href="#static-overview" className="static-wordmark">
          {profile.name}
        </a>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>
      <main aria-label="Static CV" id="static-overview">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
      </main>
    </div>
  );
}

export default StaticLayout;
```

Add shared selector rules to the end of `src/styles.css`:

```css
.layout-switcher {
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid currentColor;
  border-radius: 6px;
}

.layout-switcher button {
  min-height: 36px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: inherit;
  padding: 0 10px;
  cursor: pointer;
}

.layout-switcher button[aria-pressed="true"] {
  background: currentColor;
}

.layout-switcher button[aria-pressed="true"] span {
  color: var(--surface, #fff);
}

.layout-switcher button:focus-visible {
  outline: 3px solid var(--amber, #c5a059);
  outline-offset: 3px;
}

.layout-switcher--compact {
  display: grid;
  grid-template-columns: repeat(2, 32px);
}

.layout-switcher--compact button {
  min-height: 32px;
  padding: 0;
}
```

- [ ] **Step 4: Run the App tests**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: all existing tests and the three selection tests PASS.

- [ ] **Step 5: Commit the working selector flow**

```powershell
git add src/App.tsx src/App.test.tsx src/layouts/StaticLayout.tsx src/styles.css
git commit -m "feat: add selectable CV layouts"
```

## Task 4: Build the Complete Data-Driven Static Layout

**Files:**
- Modify: `src/layouts/StaticLayout.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add failing content-completeness tests**

Extend the `cv.ts` import in `src/App.test.tsx`:

```ts
import {
  education,
  expertise,
  impactHighlights,
  profile,
  timeline,
} from "./data/cv";
```

Add this test:

```ts
it("renders the complete CV data in the Static layout", () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");
  render(<App />);

  expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();

  for (const highlight of impactHighlights) {
    expect(screen.getByText(highlight.metric)).toBeInTheDocument();
    expect(screen.getByText(highlight.detail)).toBeInTheDocument();
  }

  for (const entry of timeline) {
    expect(screen.getByRole("heading", { name: entry.role })).toBeInTheDocument();
    for (const bullet of entry.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  }

  for (const category of expertise) {
    expect(screen.getByRole("heading", { name: category.label })).toBeInTheDocument();
    expect(screen.getByText(category.summary)).toBeInTheDocument();
  }

  expect(screen.getByRole("heading", { name: education.institution })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /download cv/i })).toHaveAttribute("download");
});

it("does not render fabricated Stitch facts", () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");
  render(<App />);

  expect(screen.queryByText("$40M")).not.toBeInTheDocument();
  expect(screen.queryByText(/VP of Infrastructure/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Staff Engineer/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the content tests and verify failure**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: the completeness test FAILS because the initial Static renderer contains only the profile header.

- [ ] **Step 3: Replace the initial renderer with the complete semantic layout**

Replace `src/layouts/StaticLayout.tsx` with:

```tsx
import {
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
} from "lucide-react";
import { useState } from "react";
import LayoutSwitcher from "../components/LayoutSwitcher";
import {
  availability,
  education,
  expertise,
  impactHighlights,
  profile,
  timeline,
} from "../data/cv";
import type { LayoutId } from "./layoutPreference";

type StaticLayoutProps = {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
};

const staticNav = [
  { href: "#static-experience", label: "Experience" },
  { href: "#static-capabilities", label: "Capabilities" },
  { href: "#static-education", label: "Education" },
];

function StaticLayout({
  currentLayout,
  onLayoutChange,
}: StaticLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="static-layout">
      <header className="static-header">
        <a className="static-wordmark" href="#static-overview">
          {profile.name}
        </a>
        <button
          className="static-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="static-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={20} aria-hidden="true" />
          <span>Menu</span>
        </button>
        <nav
          id="static-navigation"
          className={menuOpen ? "static-nav static-nav--open" : "static-nav"}
          aria-label="Static navigation"
        >
          {staticNav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="static-nav-download" href="/Tony_Baker_CV.pdf" download>
            Download CV
          </a>
          <a className="static-nav-contact" href={`mailto:${profile.email}`}>
            Contact
          </a>
        </nav>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>

      <main aria-label="Static CV">
        <section className="static-hero" id="static-overview">
          <div className="static-hero-copy">
            <p className="static-kicker">Distinguished Engineer</p>
            <h1>{profile.name}</h1>
            <p className="static-title">{profile.title}</p>
            <p className="static-location">
              <MapPin size={15} aria-hidden="true" />
              {profile.location}
            </p>
            <div className="static-summary">
              {profile.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="static-hero-actions">
              <a href={`mailto:${profile.email}`}>
                <Mail size={17} aria-hidden="true" /> Contact Tony
              </a>
              <a href="/Tony_Baker_CV.pdf" download>
                <Download size={17} aria-hidden="true" /> Download CV
              </a>
            </div>
          </div>
          <figure className="static-portrait">
            <img src="/tony-baker-headshot.png" alt="Tony Baker" />
          </figure>
        </section>

        <section className="static-impact" aria-labelledby="static-impact-title">
          <h2 className="visually-hidden" id="static-impact-title">Measured impact</h2>
          {impactHighlights.map((highlight) => (
            <article key={highlight.label}>
              <strong>{highlight.metric}</strong>
              <h3>{highlight.label}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </section>

        <section className="static-section" id="static-experience" aria-labelledby="static-experience-title">
          <header className="static-section-heading">
            <p>Career narrative</p>
            <h2 id="static-experience-title">Professional Experience</h2>
          </header>
          <div className="static-timeline">
            {timeline.map((entry, index) => (
              <article className="static-role" key={entry.id}>
                <div className="static-role-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{entry.period}</p>
                  <p>{entry.location}</p>
                </div>
                <div className="static-role-body">
                  <p className="static-company">{entry.company}</p>
                  <h3>{entry.role}</h3>
                  <p className="static-focus">{entry.focus}</p>
                  <ul>
                    {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <div className="static-tags" aria-label={`${entry.role} capabilities`}>
                    {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="static-section" id="static-capabilities" aria-labelledby="static-capabilities-title">
          <header className="static-section-heading">
            <p>Technical range</p>
            <h2 id="static-capabilities-title">Engineering Capabilities</h2>
          </header>
          <div className="static-capability-grid">
            {expertise.map((category) => (
              <article key={category.id}>
                <h3>{category.label}</h3>
                <p>{category.summary}</p>
                <ul>
                  {category.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="static-section static-education" id="static-education" aria-labelledby="static-education-title">
          <header className="static-section-heading">
            <p>Academic foundation</p>
            <h2 id="static-education-title">Education</h2>
          </header>
          <article>
            <GraduationCap size={28} aria-hidden="true" />
            <div>
              <h3>{education.institution}</h3>
              <p>{education.degree}</p>
              <p>{education.field}</p>
              <ul>{education.distinction.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        </section>
      </main>

      <footer className="static-footer">
        <div>
          <strong>{profile.name}</strong>
          <p>{availability}</p>
        </div>
        <div className="static-footer-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
          <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer">
            LinkedIn <ExternalLink size={14} aria-hidden="true" />
          </a>
          <a href="/Tony_Baker_CV.pdf" download>Download portfolio CV</a>
        </div>
      </footer>
    </div>
  );
}

export default StaticLayout;
```

- [ ] **Step 4: Run the content tests**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: completeness and fabricated-fact tests PASS along with the existing suite.

- [ ] **Step 5: Commit the complete Static structure**

```powershell
git add src/layouts/StaticLayout.tsx src/App.test.tsx
git commit -m "feat: render static CV from shared data"
```

## Task 5: Apply the Stitch Editorial System Responsively

**Files:**
- Create: `src/static.css`
- Modify: `src/main.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add the Static stylesheet import**

Update `src/main.tsx` so style order is explicit:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./static.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 2: Create scoped Static tokens and desktop composition**

Create `src/static.css` using the Stitch design reference values:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap");

.static-layout {
  --static-paper: #faf9f6;
  --static-paper-raised: #ffffff;
  --static-slate: #f1f0ea;
  --static-ink: #1a1a1a;
  --static-muted: #5e5f5d;
  --static-line: #d1d1cb;
  --static-gold: #c5a059;
  --static-copper: #b87333;
  min-height: 100vh;
  background: var(--static-paper);
  color: var(--static-ink);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.static-layout h1,
.static-layout h2,
.static-layout h3,
.static-layout p {
  margin-top: 0;
}

.static-layout h1,
.static-layout h2,
.static-role-body h3 {
  font-family: "Playfair Display", Georgia, serif;
}

.static-header,
.static-layout main,
.static-footer {
  width: min(calc(100% - 128px), 1200px);
  margin-inline: auto;
}

.static-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 32px;
  min-height: 76px;
  border-bottom: 1px solid var(--static-line);
}

.static-wordmark {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
}

.static-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  font-size: 0.71rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.static-nav a,
.static-footer a {
  color: var(--static-ink);
}

.static-nav-download,
.static-nav-contact,
.static-hero-actions a {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--static-ink);
  border-radius: 4px;
  padding: 0 14px;
}

.static-nav-contact,
.static-hero-actions a:first-child {
  background: var(--static-ink);
  color: var(--static-paper);
}

.static-menu-button {
  display: none;
}

.static-hero {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(260px, 4fr);
  gap: 88px;
  align-items: center;
  min-height: 600px;
  border-bottom: 1px solid var(--static-line);
  padding-block: 72px;
}

.static-kicker,
.static-section-heading > p,
.static-company,
.static-role-meta,
.static-tags,
.static-impact h3 {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.static-kicker,
.static-section-heading > p,
.static-company {
  color: var(--static-copper);
  font-size: 0.72rem;
  font-weight: 600;
}

.static-hero h1 {
  margin-bottom: 10px;
  font-size: clamp(4rem, 8vw, 7.25rem);
  line-height: 0.88;
  letter-spacing: -0.055em;
}

.static-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.2rem, 2.2vw, 1.75rem);
  font-style: italic;
}

.static-location {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--static-muted);
  font-size: 0.82rem;
}

.static-summary {
  max-width: 720px;
  border-left: 2px solid var(--static-copper);
  margin-block: 36px;
  padding-left: 24px;
  color: var(--static-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.static-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.static-portrait {
  margin: 0;
  border: 1px solid var(--static-line);
  background: var(--static-slate);
  padding: 12px;
}

.static-portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 22%;
  filter: saturate(0.74) contrast(1.04);
}

.static-impact {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--static-line);
  padding-block: 44px;
}

.static-impact article {
  min-width: 0;
  border-right: 1px solid var(--static-line);
  padding: 0 24px;
}

.static-impact article:first-of-type { padding-left: 0; }
.static-impact article:last-child { border-right: 0; }

.static-impact strong {
  display: block;
  color: var(--static-copper);
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1;
}

.static-impact h3 {
  margin-block: 10px;
  font-size: 0.65rem;
}

.static-impact p {
  color: var(--static-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.static-section {
  padding-block: 96px;
  border-bottom: 1px solid var(--static-line);
}

.static-section-heading {
  display: grid;
  grid-template-columns: 2fr 10fr;
  align-items: baseline;
  gap: 24px;
  margin-bottom: 48px;
}

.static-section-heading h2 {
  margin-bottom: 0;
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  letter-spacing: -0.035em;
}

.static-role {
  display: grid;
  grid-template-columns: 2fr 10fr;
  gap: 24px;
  border-top: 1px solid var(--static-line);
  padding-block: 42px;
}

.static-role-meta {
  color: var(--static-muted);
  font-size: 0.66rem;
  line-height: 1.6;
}

.static-role-meta span {
  display: block;
  margin-bottom: 20px;
  color: var(--static-copper);
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.4rem;
}

.static-role-body h3 {
  margin-bottom: 8px;
  font-size: clamp(1.65rem, 3vw, 2.5rem);
}

.static-focus {
  color: var(--static-muted);
  font-weight: 600;
}

.static-role-body ul {
  columns: 2;
  column-gap: 44px;
  margin-block: 26px;
  padding-left: 20px;
}

.static-role-body li {
  break-inside: avoid;
  margin-bottom: 14px;
  color: var(--static-muted);
  line-height: 1.58;
}

.static-role-body li::marker { color: var(--static-gold); }

.static-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  font-size: 0.62rem;
}

.static-tags span {
  border: 1px solid var(--static-line);
  border-radius: 2px;
  background: var(--static-slate);
  padding: 6px 8px;
}

.static-capability-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid var(--static-line);
  border-left: 1px solid var(--static-line);
}

.static-capability-grid article {
  border-right: 1px solid var(--static-line);
  border-bottom: 1px solid var(--static-line);
  padding: 30px;
}

.static-capability-grid h3 {
  font-size: 1.35rem;
}

.static-capability-grid p {
  color: var(--static-muted);
  line-height: 1.6;
}

.static-capability-grid ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.static-capability-grid li {
  border-bottom: 1px solid var(--static-gold);
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 0.68rem;
  padding-bottom: 3px;
}

.static-education > article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 22px;
  border: 1px solid var(--static-line);
  padding: 30px;
}

.static-education h3 {
  margin-bottom: 6px;
  font-size: 1.5rem;
}

.static-education p,
.static-education li {
  color: var(--static-muted);
}

.static-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  padding-block: 42px;
}

.static-footer p {
  max-width: 680px;
  color: var(--static-muted);
  line-height: 1.6;
}

.static-footer-links {
  display: grid;
  justify-items: end;
  gap: 8px;
  font-size: 0.78rem;
}

.static-layout a,
.static-layout button {
  transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease;
}

.static-layout a:hover { color: var(--static-copper); }

.static-layout a:focus-visible,
.static-layout button:focus-visible {
  outline: 3px solid var(--static-gold);
  outline-offset: 4px;
}
```

- [ ] **Step 3: Add tablet, mobile, and reduced-motion rules**

Append to `src/static.css`:

```css
@media (max-width: 960px) {
  .static-header,
  .static-layout main,
  .static-footer {
    width: min(calc(100% - 48px), 760px);
  }

  .static-header {
    grid-template-columns: 1fr auto auto;
  }

  .static-menu-button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--static-line);
    background: transparent;
    padding: 9px 12px;
  }

  .static-nav {
    position: absolute;
    top: 68px;
    right: 24px;
    z-index: 10;
    display: none;
    width: min(320px, calc(100vw - 48px));
    align-items: stretch;
    border: 1px solid var(--static-line);
    background: var(--static-paper-raised);
    padding: 18px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 5%);
  }

  .static-nav--open {
    display: grid;
  }

  .static-nav a { padding: 10px; }

  .static-hero {
    grid-template-columns: minmax(0, 1fr) 240px;
    gap: 40px;
  }

  .static-role-body ul { columns: 1; }
}

@media (max-width: 640px) {
  .static-header,
  .static-layout main,
  .static-footer {
    width: min(calc(100% - 32px), 520px);
  }

  .static-header {
    min-height: 64px;
    gap: 8px;
  }

  .static-wordmark { font-size: 0.95rem; }
  .static-menu-button span { display: none; }

  .static-header .layout-switcher {
    gap: 2px;
  }

  .static-header .layout-switcher button {
    min-height: 34px;
    padding: 0 6px;
    font-size: 0.7rem;
  }

  .static-hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-block: 48px;
  }

  .static-hero h1 { font-size: clamp(3.4rem, 17vw, 5rem); }

  .static-portrait {
    order: -1;
    width: min(72%, 270px);
  }

  .static-impact {
    grid-template-columns: repeat(2, 1fr);
  }

  .static-impact article {
    border-right: 0;
    border-bottom: 1px solid var(--static-line);
    padding: 22px 12px;
  }

  .static-impact article:nth-child(odd) {
    border-right: 1px solid var(--static-line);
    padding-left: 0;
  }

  .static-section { padding-block: 64px; }

  .static-section-heading,
  .static-role {
    grid-template-columns: 1fr;
  }

  .static-section-heading { gap: 8px; }

  .static-role-meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 16px;
  }

  .static-role-meta span {
    grid-row: 1 / 3;
    margin: 0;
  }

  .static-capability-grid { grid-template-columns: 1fr; }

  .static-footer {
    grid-template-columns: 1fr;
  }

  .static-footer-links { justify-items: start; }
}

@media (prefers-reduced-motion: reduce) {
  .static-layout {
    scroll-behavior: auto;
  }

  .static-layout *,
  .static-layout *::before,
  .static-layout *::after {
    transition-duration: 0.01ms !important;
  }
}
```

Confirm `src/styles.css` still contains the existing `.visually-hidden` utility. If absent, append:

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}
```

- [ ] **Step 4: Run automated checks**

Run:

```powershell
pnpm test
pnpm build
```

Expected: every Vitest test PASS and the production build completes without CSS or TypeScript errors.

- [ ] **Step 5: Compare both responsive views against Stitch**

Run:

```powershell
pnpm dev
```

Open the local URL and verify at 1440px and 390px against:

- `docs/stitch-reference/executive_cv_desktop/screen.png`
- `docs/stitch-reference/executive_cv_mobile/screen.png`

Check typography, section rhythm, portrait crop, impact strip, chronology reflow, capability grid, mobile menu, layout selector, and footer. Adjust only `src/static.css` for visual mismatches unless the semantic structure is the cause.

- [ ] **Step 6: Commit the responsive visual system**

```powershell
git add src/static.css src/main.tsx src/styles.css
git commit -m "feat: style responsive static CV layout"
```

## Task 6: Full Accessibility and Regression Verification

**Files:**
- Modify: `src/App.test.tsx` only if verification exposes a missing behavioural assertion

- [ ] **Step 1: Run the complete automated suite and build**

Run:

```powershell
pnpm test
pnpm build
```

Expected: all tests PASS and Vite reports a successful production build.

- [ ] **Step 2: Verify keyboard behaviour in both layouts**

Using the local development site, complete this exact sequence:

1. Reload with storage cleared and confirm Interactive renders.
2. Tab to the layout selector; verify a visible focus ring.
3. Activate Static using the keyboard.
4. Reload and confirm Static is restored.
5. Traverse header navigation, download, contact, role content, capabilities, education, and footer links.
6. At 390px, open and close the menu with keyboard controls and select a section link.
7. Switch back to Interactive and verify its timeline, expertise tabs, section highlights, and light/dark toggle.

Expected: focus order follows reading order, every control is operable, and switching never strands focus behind hidden navigation.

- [ ] **Step 3: Verify content integrity**

Search production source and rendered copy:

```powershell
rg -n '\$40M|200\+|99\.99%|VP of Infrastructure|Staff Engineer' src
```

Expected: no matches.

Confirm every `timeline` entry, every achievement bullet, every expertise category, all four impact metrics, education distinctions, availability, contact links, and PDF download appear in the Static presentation.

- [ ] **Step 4: Inspect the final working tree**

Run:

```powershell
git status --short
git diff --check
```

Expected: no whitespace errors. Only intentional files are modified; `docs/stitch-reference/` may remain untracked unless the user explicitly chooses to version the design artifacts.

- [ ] **Step 5: Commit any verification-only corrections**

If verification required code or test corrections, commit only those files:

```powershell
git add src/App.test.tsx src/App.tsx src/components/LayoutSwitcher.tsx src/layouts src/styles.css src/static.css src/main.tsx
git commit -m "fix: complete static layout verification"
```

If no corrections were required, do not create an empty commit.

