# Selectable Executive CV Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent Executive Editorial layout alongside the existing Interactive CV while both presentations reuse the authoritative data in `src/data/cv.ts`.

**Architecture:** `App` becomes a small layout host backed by a defensive local-storage preference module. The current page moves intact to `InteractiveLayout`, while a separate `ExecutiveLayout` renders every CV data group with its own semantic structure and scoped CSS. A shared `LayoutSwitcher` is rendered by both layouts so visitors can move between presentations without coupling their internal interactions.

**Tech Stack:** React 19, TypeScript, Vite 6, Vitest, Testing Library, Lucide React, CSS custom properties, ordinary responsive CSS

---

## File Structure

- Create `src/layouts/layoutPreference.ts`: layout identifiers plus defensive storage read/write functions.
- Create `src/layouts/layoutPreference.test.ts`: unit coverage for valid, invalid, absent, and failing storage.
- Create `src/components/LayoutSwitcher.tsx`: accessible presentation selector shared by both layouts.
- Create `src/layouts/InteractiveLayout.tsx`: current `App.tsx` presentation and interactions, moved without behavioural changes.
- Create `src/layouts/ExecutiveLayout.tsx`: complete semantic Executive Editorial renderer backed by `cv.ts`.
- Create `src/executive.css`: CSS tokens and responsive presentation scoped to `.executive-layout`.
- Modify `src/App.tsx`: initialize, persist, and render the chosen layout.
- Modify `src/App.test.tsx`: cover selection/persistence and preserve the existing interactive regression suite.
- Modify `src/styles.css`: add only shared layout-switcher rules and any extraction-safe global adjustments.
- Modify `src/main.tsx`: import `executive.css` after the existing stylesheet.

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
    const storage = { getItem: vi.fn(() => "executive") };

    expect(readLayoutPreference(storage)).toBe("executive");
    expect(storage.getItem).toHaveBeenCalledWith(LAYOUT_STORAGE_KEY);
  });

  it.each([null, "", "magazine", "EXECUTIVE"])(
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

    writeLayoutPreference("executive", storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      LAYOUT_STORAGE_KEY,
      "executive",
    );
  });

  it("does not throw when storage cannot be written", () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new DOMException("blocked");
      }),
    };

    expect(() => writeLayoutPreference("executive", storage)).not.toThrow();
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

export const layoutIds = ["interactive", "executive"] as const;
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
  { id: "executive", label: "Executive" },
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
- Create: `src/layouts/ExecutiveLayout.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing selection and persistence tests**

Add these imports to `src/App.test.tsx`:

```ts
import { LAYOUT_STORAGE_KEY } from "./layouts/layoutPreference";
```

Add these tests inside the `App` suite:

```ts
it("switches to the Executive layout and persists the choice", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Executive layout" }));

  expect(
    screen.getByRole("main", { name: "Executive CV" }),
  ).toBeInTheDocument();
  expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("executive");
});

it("restores the saved Executive layout", () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");

  render(<App />);

  expect(
    screen.getByRole("main", { name: "Executive CV" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Executive layout" }),
  ).toHaveAttribute("aria-pressed", "true");
});

it("switches back to the Interactive layout", async () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");
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

- [ ] **Step 3: Add the layout host and initial Executive renderer**

Replace `src/App.tsx` with:

```tsx
import { useState } from "react";
import ExecutiveLayout from "./layouts/ExecutiveLayout";
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

  if (layout === "executive") {
    return (
      <ExecutiveLayout
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

Create the first valid `src/layouts/ExecutiveLayout.tsx`:

```tsx
import LayoutSwitcher from "../components/LayoutSwitcher";
import { profile } from "../data/cv";
import type { LayoutId } from "./layoutPreference";

type ExecutiveLayoutProps = {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
};

function ExecutiveLayout({
  currentLayout,
  onLayoutChange,
}: ExecutiveLayoutProps) {
  return (
    <div className="executive-layout">
      <header className="executive-header">
        <a href="#executive-overview" className="executive-wordmark">
          {profile.name}
        </a>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>
      <main aria-label="Executive CV" id="executive-overview">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
      </main>
    </div>
  );
}

export default ExecutiveLayout;
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
git add src/App.tsx src/App.test.tsx src/layouts/ExecutiveLayout.tsx src/styles.css
git commit -m "feat: add selectable CV layouts"
```

## Task 4: Build the Complete Data-Driven Executive Layout

**Files:**
- Modify: `src/layouts/ExecutiveLayout.tsx`
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
it("renders the complete CV data in the Executive layout", () => {
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");
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
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");
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

Expected: the completeness test FAILS because the initial Executive renderer contains only the profile header.

- [ ] **Step 3: Replace the initial renderer with the complete semantic layout**

Replace `src/layouts/ExecutiveLayout.tsx` with:

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

type ExecutiveLayoutProps = {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
};

const executiveNav = [
  { href: "#executive-experience", label: "Experience" },
  { href: "#executive-capabilities", label: "Capabilities" },
  { href: "#executive-education", label: "Education" },
];

function ExecutiveLayout({
  currentLayout,
  onLayoutChange,
}: ExecutiveLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="executive-layout">
      <header className="executive-header">
        <a className="executive-wordmark" href="#executive-overview">
          {profile.name}
        </a>
        <button
          className="executive-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="executive-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={20} aria-hidden="true" />
          <span>Menu</span>
        </button>
        <nav
          id="executive-navigation"
          className={menuOpen ? "executive-nav executive-nav--open" : "executive-nav"}
          aria-label="Executive navigation"
        >
          {executiveNav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="executive-nav-download" href="/Tony_Baker_CV.pdf" download>
            Download CV
          </a>
          <a className="executive-nav-contact" href={`mailto:${profile.email}`}>
            Contact
          </a>
        </nav>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>

      <main aria-label="Executive CV">
        <section className="executive-hero" id="executive-overview">
          <div className="executive-hero-copy">
            <p className="executive-kicker">Distinguished Engineer</p>
            <h1>{profile.name}</h1>
            <p className="executive-title">{profile.title}</p>
            <p className="executive-location">
              <MapPin size={15} aria-hidden="true" />
              {profile.location}
            </p>
            <div className="executive-summary">
              {profile.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="executive-hero-actions">
              <a href={`mailto:${profile.email}`}>
                <Mail size={17} aria-hidden="true" /> Contact Tony
              </a>
              <a href="/Tony_Baker_CV.pdf" download>
                <Download size={17} aria-hidden="true" /> Download CV
              </a>
            </div>
          </div>
          <figure className="executive-portrait">
            <img src="/tony-baker-headshot.png" alt="Tony Baker" />
          </figure>
        </section>

        <section className="executive-impact" aria-labelledby="executive-impact-title">
          <h2 className="visually-hidden" id="executive-impact-title">Measured impact</h2>
          {impactHighlights.map((highlight) => (
            <article key={highlight.label}>
              <strong>{highlight.metric}</strong>
              <h3>{highlight.label}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </section>

        <section className="executive-section" id="executive-experience" aria-labelledby="executive-experience-title">
          <header className="executive-section-heading">
            <p>Career narrative</p>
            <h2 id="executive-experience-title">Professional Experience</h2>
          </header>
          <div className="executive-timeline">
            {timeline.map((entry, index) => (
              <article className="executive-role" key={entry.id}>
                <div className="executive-role-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{entry.period}</p>
                  <p>{entry.location}</p>
                </div>
                <div className="executive-role-body">
                  <p className="executive-company">{entry.company}</p>
                  <h3>{entry.role}</h3>
                  <p className="executive-focus">{entry.focus}</p>
                  <ul>
                    {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <div className="executive-tags" aria-label={`${entry.role} capabilities`}>
                    {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="executive-section" id="executive-capabilities" aria-labelledby="executive-capabilities-title">
          <header className="executive-section-heading">
            <p>Technical range</p>
            <h2 id="executive-capabilities-title">Executive Capabilities</h2>
          </header>
          <div className="executive-capability-grid">
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

        <section className="executive-section executive-education" id="executive-education" aria-labelledby="executive-education-title">
          <header className="executive-section-heading">
            <p>Academic foundation</p>
            <h2 id="executive-education-title">Education</h2>
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

      <footer className="executive-footer">
        <div>
          <strong>{profile.name}</strong>
          <p>{availability}</p>
        </div>
        <div className="executive-footer-links">
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

export default ExecutiveLayout;
```

- [ ] **Step 4: Run the content tests**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: completeness and fabricated-fact tests PASS along with the existing suite.

- [ ] **Step 5: Commit the complete Executive structure**

```powershell
git add src/layouts/ExecutiveLayout.tsx src/App.test.tsx
git commit -m "feat: render executive CV from shared data"
```

## Task 5: Apply the Stitch Editorial System Responsively

**Files:**
- Create: `src/executive.css`
- Modify: `src/main.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add the Executive stylesheet import**

Update `src/main.tsx` so style order is explicit:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./executive.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 2: Create scoped Executive tokens and desktop composition**

Create `src/executive.css` using the Stitch design reference values:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap");

.executive-layout {
  --executive-paper: #faf9f6;
  --executive-paper-raised: #ffffff;
  --executive-slate: #f1f0ea;
  --executive-ink: #1a1a1a;
  --executive-muted: #5e5f5d;
  --executive-line: #d1d1cb;
  --executive-gold: #c5a059;
  --executive-copper: #b87333;
  min-height: 100vh;
  background: var(--executive-paper);
  color: var(--executive-ink);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.executive-layout h1,
.executive-layout h2,
.executive-layout h3,
.executive-layout p {
  margin-top: 0;
}

.executive-layout h1,
.executive-layout h2,
.executive-role-body h3 {
  font-family: "Playfair Display", Georgia, serif;
}

.executive-header,
.executive-layout main,
.executive-footer {
  width: min(calc(100% - 128px), 1200px);
  margin-inline: auto;
}

.executive-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 32px;
  min-height: 76px;
  border-bottom: 1px solid var(--executive-line);
}

.executive-wordmark {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
}

.executive-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  font-size: 0.71rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.executive-nav a,
.executive-footer a {
  color: var(--executive-ink);
}

.executive-nav-download,
.executive-nav-contact,
.executive-hero-actions a {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--executive-ink);
  border-radius: 4px;
  padding: 0 14px;
}

.executive-nav-contact,
.executive-hero-actions a:first-child {
  background: var(--executive-ink);
  color: var(--executive-paper);
}

.executive-menu-button {
  display: none;
}

.executive-hero {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(260px, 4fr);
  gap: 88px;
  align-items: center;
  min-height: 600px;
  border-bottom: 1px solid var(--executive-line);
  padding-block: 72px;
}

.executive-kicker,
.executive-section-heading > p,
.executive-company,
.executive-role-meta,
.executive-tags,
.executive-impact h3 {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.executive-kicker,
.executive-section-heading > p,
.executive-company {
  color: var(--executive-copper);
  font-size: 0.72rem;
  font-weight: 600;
}

.executive-hero h1 {
  margin-bottom: 10px;
  font-size: clamp(4rem, 8vw, 7.25rem);
  line-height: 0.88;
  letter-spacing: -0.055em;
}

.executive-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.2rem, 2.2vw, 1.75rem);
  font-style: italic;
}

.executive-location {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--executive-muted);
  font-size: 0.82rem;
}

.executive-summary {
  max-width: 720px;
  border-left: 2px solid var(--executive-copper);
  margin-block: 36px;
  padding-left: 24px;
  color: var(--executive-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.executive-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.executive-portrait {
  margin: 0;
  border: 1px solid var(--executive-line);
  background: var(--executive-slate);
  padding: 12px;
}

.executive-portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 22%;
  filter: saturate(0.74) contrast(1.04);
}

.executive-impact {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--executive-line);
  padding-block: 44px;
}

.executive-impact article {
  min-width: 0;
  border-right: 1px solid var(--executive-line);
  padding: 0 24px;
}

.executive-impact article:first-of-type { padding-left: 0; }
.executive-impact article:last-child { border-right: 0; }

.executive-impact strong {
  display: block;
  color: var(--executive-copper);
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1;
}

.executive-impact h3 {
  margin-block: 10px;
  font-size: 0.65rem;
}

.executive-impact p {
  color: var(--executive-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.executive-section {
  padding-block: 96px;
  border-bottom: 1px solid var(--executive-line);
}

.executive-section-heading {
  display: grid;
  grid-template-columns: 2fr 10fr;
  align-items: baseline;
  gap: 24px;
  margin-bottom: 48px;
}

.executive-section-heading h2 {
  margin-bottom: 0;
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  letter-spacing: -0.035em;
}

.executive-role {
  display: grid;
  grid-template-columns: 2fr 10fr;
  gap: 24px;
  border-top: 1px solid var(--executive-line);
  padding-block: 42px;
}

.executive-role-meta {
  color: var(--executive-muted);
  font-size: 0.66rem;
  line-height: 1.6;
}

.executive-role-meta span {
  display: block;
  margin-bottom: 20px;
  color: var(--executive-copper);
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.4rem;
}

.executive-role-body h3 {
  margin-bottom: 8px;
  font-size: clamp(1.65rem, 3vw, 2.5rem);
}

.executive-focus {
  color: var(--executive-muted);
  font-weight: 600;
}

.executive-role-body ul {
  columns: 2;
  column-gap: 44px;
  margin-block: 26px;
  padding-left: 20px;
}

.executive-role-body li {
  break-inside: avoid;
  margin-bottom: 14px;
  color: var(--executive-muted);
  line-height: 1.58;
}

.executive-role-body li::marker { color: var(--executive-gold); }

.executive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  font-size: 0.62rem;
}

.executive-tags span {
  border: 1px solid var(--executive-line);
  border-radius: 2px;
  background: var(--executive-slate);
  padding: 6px 8px;
}

.executive-capability-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid var(--executive-line);
  border-left: 1px solid var(--executive-line);
}

.executive-capability-grid article {
  border-right: 1px solid var(--executive-line);
  border-bottom: 1px solid var(--executive-line);
  padding: 30px;
}

.executive-capability-grid h3 {
  font-size: 1.35rem;
}

.executive-capability-grid p {
  color: var(--executive-muted);
  line-height: 1.6;
}

.executive-capability-grid ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.executive-capability-grid li {
  border-bottom: 1px solid var(--executive-gold);
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 0.68rem;
  padding-bottom: 3px;
}

.executive-education > article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 22px;
  border: 1px solid var(--executive-line);
  padding: 30px;
}

.executive-education h3 {
  margin-bottom: 6px;
  font-size: 1.5rem;
}

.executive-education p,
.executive-education li {
  color: var(--executive-muted);
}

.executive-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  padding-block: 42px;
}

.executive-footer p {
  max-width: 680px;
  color: var(--executive-muted);
  line-height: 1.6;
}

.executive-footer-links {
  display: grid;
  justify-items: end;
  gap: 8px;
  font-size: 0.78rem;
}

.executive-layout a,
.executive-layout button {
  transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease;
}

.executive-layout a:hover { color: var(--executive-copper); }

.executive-layout a:focus-visible,
.executive-layout button:focus-visible {
  outline: 3px solid var(--executive-gold);
  outline-offset: 4px;
}
```

- [ ] **Step 3: Add tablet, mobile, and reduced-motion rules**

Append to `src/executive.css`:

```css
@media (max-width: 960px) {
  .executive-header,
  .executive-layout main,
  .executive-footer {
    width: min(calc(100% - 48px), 760px);
  }

  .executive-header {
    grid-template-columns: 1fr auto auto;
  }

  .executive-menu-button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--executive-line);
    background: transparent;
    padding: 9px 12px;
  }

  .executive-nav {
    position: absolute;
    top: 68px;
    right: 24px;
    z-index: 10;
    display: none;
    width: min(320px, calc(100vw - 48px));
    align-items: stretch;
    border: 1px solid var(--executive-line);
    background: var(--executive-paper-raised);
    padding: 18px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 5%);
  }

  .executive-nav--open {
    display: grid;
  }

  .executive-nav a { padding: 10px; }

  .executive-hero {
    grid-template-columns: minmax(0, 1fr) 240px;
    gap: 40px;
  }

  .executive-role-body ul { columns: 1; }
}

@media (max-width: 640px) {
  .executive-header,
  .executive-layout main,
  .executive-footer {
    width: min(calc(100% - 32px), 520px);
  }

  .executive-header {
    min-height: 64px;
    gap: 8px;
  }

  .executive-wordmark { font-size: 0.95rem; }
  .executive-menu-button span { display: none; }

  .executive-header .layout-switcher {
    gap: 2px;
  }

  .executive-header .layout-switcher button {
    min-height: 34px;
    padding: 0 6px;
    font-size: 0.7rem;
  }

  .executive-hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-block: 48px;
  }

  .executive-hero h1 { font-size: clamp(3.4rem, 17vw, 5rem); }

  .executive-portrait {
    order: -1;
    width: min(72%, 270px);
  }

  .executive-impact {
    grid-template-columns: repeat(2, 1fr);
  }

  .executive-impact article {
    border-right: 0;
    border-bottom: 1px solid var(--executive-line);
    padding: 22px 12px;
  }

  .executive-impact article:nth-child(odd) {
    border-right: 1px solid var(--executive-line);
    padding-left: 0;
  }

  .executive-section { padding-block: 64px; }

  .executive-section-heading,
  .executive-role {
    grid-template-columns: 1fr;
  }

  .executive-section-heading { gap: 8px; }

  .executive-role-meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 16px;
  }

  .executive-role-meta span {
    grid-row: 1 / 3;
    margin: 0;
  }

  .executive-capability-grid { grid-template-columns: 1fr; }

  .executive-footer {
    grid-template-columns: 1fr;
  }

  .executive-footer-links { justify-items: start; }
}

@media (prefers-reduced-motion: reduce) {
  .executive-layout {
    scroll-behavior: auto;
  }

  .executive-layout *,
  .executive-layout *::before,
  .executive-layout *::after {
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

Check typography, section rhythm, portrait crop, impact strip, chronology reflow, capability grid, mobile menu, layout selector, and footer. Adjust only `src/executive.css` for visual mismatches unless the semantic structure is the cause.

- [ ] **Step 6: Commit the responsive visual system**

```powershell
git add src/executive.css src/main.tsx src/styles.css
git commit -m "feat: style responsive executive CV layout"
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
3. Activate Executive using the keyboard.
4. Reload and confirm Executive is restored.
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

Confirm every `timeline` entry, every achievement bullet, every expertise category, all four impact metrics, education distinctions, availability, contact links, and PDF download appear in the Executive presentation.

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
git add src/App.test.tsx src/App.tsx src/components/LayoutSwitcher.tsx src/layouts src/styles.css src/executive.css src/main.tsx
git commit -m "fix: complete executive layout verification"
```

If no corrections were required, do not create an empty commit.
