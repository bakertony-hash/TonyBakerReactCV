# Selectable Executive CV Layout Design

## Summary

Add the Stitch-designed Executive Editorial presentation as a second selectable layout while preserving the existing interactive CV. Both layouts render the same authoritative content from `src/data/cv.ts`; layout selection changes presentation, not CV facts.

The existing interactive layout remains the default for first-time visitors. A visitor can switch between **Interactive** and **Executive** layouts, and the chosen layout persists in the browser.

## Goals

- Preserve the current interactive CV without visual or behavioural regressions.
- Add a substantially different Executive Editorial layout based on the exported Stitch references.
- Reuse all profile, impact, experience, expertise, education, availability, and contact data from `src/data/cv.ts`.
- Keep the two presentations responsive, accessible, and independently maintainable.
- Avoid introducing Tailwind, Material Symbols, a backend, or new runtime CDN dependencies.

## Non-goals

- Replacing or rewriting `src/data/cv.ts` content.
- Importing Stitch's generated HTML directly into the application.
- Reproducing factual text invented by Stitch.
- Adding a visual page builder or user-editable themes.
- Combining every layout-specific element into a single configurable component tree.

## Reference Material

The design reference is stored under `docs/stitch-reference/`:

- `executive_cv_desktop/screen.png` and `code.html`
- `executive_cv_mobile/screen.png` and `code.html`
- `executive_engineering_narrative/DESIGN.md`
- The exported headshot reference

The screenshots define visual intent. The exported HTML and design document provide measurements, typography, colours, and responsive clues. They are reference material rather than production source code.

If the exported reference conflicts with `src/data/cv.ts`, the local CV data wins. This explicitly excludes fabricated Stitch content such as unsupported metrics or job titles.

## Architecture

`App` becomes a small layout host responsible for selecting and rendering a presentation. The current page moves into an `InteractiveLayout` component with its existing interactions intact. The new page is implemented as an independent `ExecutiveLayout` component.

```text
src/data/cv.ts
      |
      +-------------------+
      |                   |
InteractiveLayout   ExecutiveLayout
      |                   |
      +---------+---------+
                |
          Layout selector
          and persistence
```

The layouts import the existing data exports directly unless a small aggregate object improves prop clarity. No duplicated copy is stored inside either layout.

Layout-specific components live close to their layout. Small semantic components may be shared when they have genuinely identical behaviour, such as contact links or the layout selector. Visual cards and section compositions remain independent so the Executive layout is not constrained by the existing design.

## Layout Selection

The supported layout identifiers are:

```ts
type LayoutId = "interactive" | "executive";
```

The existing Interactive layout is the default when no valid saved preference exists. The chosen identifier is stored in `localStorage` and restored on future visits.

Unknown or malformed stored values fall back to `interactive` without interrupting rendering. Storage read/write failures are ignored so private browsing or restricted storage cannot break the CV.

Each layout exposes a compact selector labelled clearly as a layout choice, not a light/dark colour toggle. The control is keyboard operable, has an accessible name, and visibly indicates the current selection.

## Existing Interactive Layout

The existing layout retains:

- Fixed navigation rail and responsive mobile navigation
- Overview, impact, experience, expertise, education, and contact content
- Selectable experience timeline
- Selectable expertise categories
- Section navigation highlights
- Light/dark appearance control
- Contact and PDF download actions

Moving the layout into its own component must not alter these behaviours. Its existing light/dark state remains scoped to the Interactive layout for this feature.

## Executive Editorial Layout

The Executive layout follows the Stitch reference while rendering the complete genuine CV data.

### Visual system

- Warm off-white and stone surfaces
- Black and charcoal primary text
- Copper accent derived from the Stitch design system
- Playfair Display-style editorial headings, Inter-style body text, and restrained monospaced labels
- Fine dividers, generous whitespace, minimal shadows, and limited card framing
- Strong typographic hierarchy suitable for executive and technical readers

Production font loading will be explicit and resilient. System fallbacks must preserve readability if web fonts fail.

### Desktop composition

- Slim masthead with identity, section navigation, CV download, and contact action
- Editorial hero with positioning, summary, location, and portrait
- Prominent four-item impact strip
- Full professional chronology using every entry and achievement from `timeline`
- Executive capabilities section derived from all `expertise` categories
- Academic foundation section derived from `education`
- Availability, contact, LinkedIn, and CV download footer

The chronology may use responsive columns within each role, but it must display every achievement rather than shortening the data to match Stitch's sample copy.

### Mobile composition

- Compact header and accessible menu/navigation treatment
- Editorial identity and portrait treatment adapted for a narrow viewport
- Vertically stacked impact metrics
- Readable chronological experience flow
- Stacked capability groups and education content
- Persistent access to layout switching without obscuring content

Mobile is a deliberate composition based on the Stitch mobile reference, not a scaled desktop canvas.

### Interaction

The Executive layout favours immediate scanning. Experience and capability content is visible by default rather than placed behind tabs. Navigation uses native anchors and smooth scrolling where motion preferences permit. Interactive states cover hover, focus, active, and selected controls.

## Styling Strategy

The implementation uses ordinary project CSS and CSS custom properties. Executive tokens are scoped under an Executive layout root to prevent leakage into the Interactive layout.

Stitch Tailwind utility classes will be translated into semantic class names. Material Symbols will be replaced with existing Lucide icons or accessible text. The current Vite build remains free of Tailwind and runtime styling scripts.

Shared global rules remain minimal. Each layout owns its typography, spacing, navigation, section, and responsive rules so changes to one presentation do not unintentionally restyle the other.

## Data Flow

1. `App` initializes the layout identifier from persistent storage, falling back to `interactive`.
2. `App` renders the selected layout.
3. The selected layout consumes the exports from `src/data/cv.ts`.
4. User interaction within a layout remains local to that layout.
5. Changing the layout updates state and attempts to persist the new identifier.
6. The alternative layout renders the same CV data in its own component structure.

No conversion layer rewrites CV prose. Small presentational transformations such as grouping skills or formatting links are allowed, but source values remain authoritative.

## Accessibility and Responsive Requirements

- Semantic landmarks and heading order in both layouts
- Keyboard-operable navigation, selectors, tabs, and buttons
- Visible focus indicators that meet contrast requirements
- Meaningful portrait alternative text
- No information conveyed by colour alone
- Support for `prefers-reduced-motion`
- Readable content from 320px upward
- Touch targets appropriate for mobile navigation
- Layout selector announced with its current state

## Testing

Automated tests cover:

- Interactive layout is the default without a saved preference
- A valid saved Executive preference is restored
- Switching layouts renders the selected presentation
- The selected identifier is persisted
- Invalid saved identifiers fall back safely
- Storage failures do not prevent rendering or switching
- Both layouts render representative CV content from `cv.ts`
- Existing Interactive light/dark and core interaction tests continue to pass

Verification also includes:

- `pnpm test`
- `pnpm build`
- Browser comparison against desktop and mobile Stitch screenshots
- Manual keyboard and responsive checks
- Confirmation that fabricated Stitch facts do not appear in the rendered site

## Implementation Boundaries

This feature may extract the existing page into focused files as required by the layout boundary. It will not perform unrelated refactoring. The initial implementation supports exactly two layouts and does not introduce a generic plugin system.

## Acceptance Criteria

- Visitors can select Interactive or Executive presentation from either layout.
- Interactive remains the first-visit default and retains its existing behaviour.
- The preference survives a page reload when browser storage is available.
- Executive closely reflects the supplied desktop/mobile design references.
- Both layouts use the same `cv.ts` content and existing public assets.
- All real experience bullets and expertise groups remain accessible.
- No unsupported Stitch-generated facts appear.
- Tests and production build pass.
