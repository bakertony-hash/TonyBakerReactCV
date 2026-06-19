---
name: Executive Engineering Narrative
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5f5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#261900'
  on-tertiary-container: '#a17f3b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1a1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
  slate-surface: '#F1F0EA'
  ink-deep: '#0F172A'
  copper-accent: '#B87333'
  border-subtle: '#D1D1CB'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  quote-editorial:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 32px
  margin-page: 64px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  section-gap: 96px
---

## Brand & Style

This design system is built for the intersection of high-level strategic leadership and deep technical expertise. It adopts a **Premium Editorial** style that favors the clarity of traditional print journalism and the precision of modern engineering documentation. 

The aesthetic is grounded in **Minimalism** with an emphasis on typographic hierarchy and generous whitespace. It intentionally avoids "Silicon Valley" cliches—such as vibrant gradients or neon glow effects—in favor of a tactile, authoritative presence. The visual narrative communicates stability, strategic judgment, and a "hands-on" engineering credibility that doesn't need to shout to be heard. 

Key visual principles include:
- **Structural Integrity:** Heavy reliance on a disciplined grid and subtle 1px borders to define regions.
- **Intentional Negative Space:** Large margins to reduce cognitive load and emphasize high-value content.
- **Monochromatic Foundation:** Using tonal depth rather than color to guide the eye.

## Colors

The palette is centered on an "Ink and Paper" philosophy. The primary color is a **Deep Charcoal (#1A1A1A)**, providing maximum contrast for readability and a sense of permanence. The background uses a **Warm Off-white (#FAF9F6)** to reduce eye strain compared to pure white, evoking the feel of high-quality stationery.

**Sophisticated Gold (#C5A059)** serves as the primary accent, used sparingly for interactive states, key milestones, or highlighting "distinguished" achievements. For more technical or "active" elements, **Muted Copper (#B87333)** provides a secondary bridge between the warmth of the background and the coldness of the charcoal.

Grays are kept neutral and desaturated to maintain the "editorial" feel, ensuring that any photography or code snippets remain the focal point of the page.

## Typography

Typography is the backbone of this design system. It uses a high-contrast pairing of **Playfair Display** for headlines and **Inter** for body text. 

- **Display & Headlines:** Use Playfair Display to convey authority and an "Executive" feel. Keep tracking tight on larger sizes to maintain a modern, editorial look.
- **Body Text:** Inter is utilized for its exceptional legibility in technical contexts. Line heights are kept generous (1.5x - 1.6x) to ensure long-form engineering essays remain approachable.
- **Technical Labels:** For code snippets, metadata, and "Engineering Lead" tags, **JetBrains Mono** is introduced to subtly signal the technical nature of the content without breaking the premium aesthetic.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop, mimicking the columns of a high-end magazine. Content is centered within a 1200px container, utilizing a 12-column grid.

- **The 4px/8px Rhythm:** All internal component spacing (padding, gaps) must be a multiple of 4px. 
- **Vertical Rhythm:** Sections are separated by significant vertical gaps (96px+) to give the content "room to breathe."
- **Editorial Reflow:** On tablet and mobile, the 12-column grid collapses to 4 columns. Sidebars containing metadata (dates, categories) should reflow to sit above the main content, maintaining a single-column reading experience.
- **Margins:** Page margins are generous (64px) to ensure the content never feels cramped against the edge of the viewport.

## Elevation & Depth

This design system avoids heavy shadows and floating elements. Depth is communicated through **Tonal Layers** and **Subtle Outlines**.

- **Surfaces:** The primary background is `FAF9F6`. Secondary content areas (like code blocks or sidebars) use `F1F0EA` (Slate Surface) to create a recessed effect.
- **Borders:** Instead of shadows, use 1px solid borders in `D1D1CB`. This creates a "blueprint" or "architectural" feel.
- **Restrained Shadows:** If a shadow is absolutely necessary (e.g., for a top-level modal), use an ambient, low-opacity shadow: `0 4px 20px rgba(0, 0, 0, 0.05)`. 
- **Z-Index:** Hierarchy is flat. Content should feel like it is part of the same plane, similar to a printed page.

## Shapes

The shape language is "Soft-Mechanical." Roundedness is kept minimal to maintain a sense of professional rigor. 

- **Standard Elements:** Buttons, input fields, and cards use a subtle 4px (`0.25rem`) radius.
- **Large Containers:** Section containers or featured image masks may use an 8px (`0.5rem`) radius.
- **Exceptions:** No pill-shaped or circular buttons are permitted, as they lean too far into "friendly/social" UI patterns. Rectilinear shapes with very slight softening represent "Precision Engineering."

## Components

### Buttons
- **Primary:** Solid `Deep Charcoal` background with `Off-white` Inter SemiBold text. 4px radius. No shadow.
- **Secondary:** 1px `Deep Charcoal` border with transparent background.
- **Ghost:** `Deep Charcoal` text with no background; background appears as `Slate Surface` on hover.

### Cards
- Cards do not use shadows. They are defined by a 1px border (`D1D1CB`) or a slight background color shift to `Slate Surface`. 
- Padding should be generous (min 24px).

### Input Fields
- Underlined or fully boxed with a 1px border. Focus state uses the `Sophisticated Gold` for the border color.
- Labels use `Label-Mono` for a technical, precise feel.

### Chips & Tags
- Used for "Skills" or "Technologies." Small, `JetBrains Mono` text.
- Rectangular with 2px radius. Low-contrast background (`F1F0EA`) with `Deep Charcoal` text.

### Lists
- Editorial lists use custom "Gold" bullets or numeric markers in `Playfair Display` to elevate simple bullet points into structured narratives.

### Navigation
- Top-level navigation is minimalist, using `Inter` Medium in all caps or standard sentence case with increased letter spacing. No icons; text-only for maximum clarity.