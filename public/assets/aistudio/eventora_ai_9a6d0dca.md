---
name: Eventora AI
colors:
  surface: '#15121a'
  surface-dim: '#15121a'
  surface-bright: '#3b3741'
  surface-container-lowest: '#100d15'
  surface-container-low: '#1d1a22'
  surface-container: '#211e27'
  surface-container-high: '#2c2831'
  surface-container-highest: '#37333c'
  on-surface: '#e8e0ec'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#e8e0ec'
  inverse-on-surface: '#332f38'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#c8c2e9'
  on-secondary: '#302c4b'
  secondary-container: '#494566'
  on-secondary-container: '#bab4da'
  tertiary: '#ddb8ff'
  on-tertiary: '#490081'
  tertiary-container: '#b175ec'
  on-tertiary-container: '#400071'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#e5deff'
  secondary-fixed-dim: '#c8c2e9'
  on-secondary-fixed: '#1b1735'
  on-secondary-fixed-variant: '#474363'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb8ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#62259b'
  background: '#15121a'
  on-background: '#e8e0ec'
  surface-variant: '#37333c'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system establishes an atmospheric, high-end GenAI product presence tailored for next-generation event orchestrators, luxury venue producers, and creative directors. The design language marries precision SaaS architecture with dark, luminescent glassmorphism and ambient violet illumination.

The emotional core is curated intelligence, mystique, and effortless authority. By layering deep charcoal obsidian, near-black plum canvases, and luminous violet lighting, the interface treats every planning decision—from multi-million dollar vendor negotiations to run-of-show choreography—as an artful production.

Key styling principles:
- **Atmospheric Depth:** Deep, layered surfaces anchored by dark plum tones rather than sterile pitch black.
- **Controlled Radiance:** Subtle radial backlights, violet edge-reflections, and luminous specular highlights that indicate computational vitality.
- **Architectural Typography:** High-contrast pairing of expressive geometric sans typography with clinical monospaced data accents for algorithmic telemetry and budgetary figures.

## Colors

The palette relies on a tonal hierarchy engineered specifically for low-light environments, avoiding high eye-strain while preserving high visual hierarchy.

### Canvas & Surfaces
- **Canvas Base:** `#0D0A12` (Void canvas for outer bounds and bottom viewport layers).
- **Surface Deep:** `#120F17` (Default root background for application viewports).
- **Surface Elevated:** `#181320` (Sidebar navigation, secondary panels, grouped card containers).
- **Surface Glass:** `rgba(36, 27, 53, 0.55)` with backdrop filter blur (16px to 24px).
- **Glass Borders:** `rgba(168, 85, 247, 0.14)` for dormant states; `rgba(192, 132, 252, 0.35)` on interactive hover.

### Accents & Illumination
- **Primary Violet:** `#A855F7` (Interactive active states, critical CTAs, core generative triggers).
- **Deep Violet:** `#9333EA` (Gradient endpoints, pressed button states, saturated glows).
- **Soft Lavender:** `#DDD6FE` (Secondary actions, pill highlight surfaces, focused metadata labels).
- **Electric Lavender:** `#C084FC` (Accent strokes, focused iconography, AI prompt tags).

### Typography Tones
- **Text Headings:** `#FFFFFF` (Solid luminous contrast for primary headlines).
- **Text Subheadings:** `#F3F4F6` (High-readability secondary information).
- **Text Body:** `#CBD5E1` (Neutral cool readability for long-form paragraphs).
- **Text Muted:** `#94A3B8` (Captions, inactive icon strokes, helper copy).
- **Text Disabled:** `#475569` (Inactive states, recessed system info).

### Semantic & Status
- **Success / On Track:** `#10B981` (Glow: `rgba(16, 185, 129, 0.25)`)
- **Warning / Upcoming:** `#F59E0B` (Glow: `rgba(245, 158, 11, 0.25)`)
- **Critical / Budget Alert:** `#F43F5E` (Glow: `rgba(244, 63, 94, 0.28)`)

## Typography

The typographic ladder balances the sculptural weight of **Outfit** for major wayfinding and headlines with the legibility of **Plus Jakarta Sans** for workflows, conversational AI feeds, and guest registers. 

To reinforce algorithmic rigor, **JetBrains Mono** is introduced for system telemetry, timestamps, financial totals, attendance caps, and status counters. All monospaced tokens apply slight positive letter-spacing and uppercase transformations where appropriate. Large display sizes utilize optical tightening (`-0.03em`) to deliver modern editorial weight.

## Layout & Spacing

This design system utilizes an asymmetrical 12-column fluid grid on desktop and tablet landscapes, folding into a 6-column grid on tablets, and a 4-column flow on mobile viewports.

### Breakpoints & Container Rules
- **Desktop (1440px and above):** 12-column layout, max container width of 1440px, `margin: 2.5rem`, `gutter: 1.5rem`.
- **Laptop / Small Desktop (1024px – 1439px):** 12-column layout, dynamic edge scaling, `margin: 2rem`, `gutter: 1.25rem`.
- **Tablet (768px – 1023px):** 6-column layout, multi-column cards collapse to dual or single columns, `margin: 1.5rem`, `gutter: 1rem`.
- **Mobile (320px – 767px):** 4-column layout, bottom sheets replace complex flyouts, horizontal scroll snap for data card rows, `margin: 1rem`, `gutter: 0.75rem`.

Internal component spacing adheres to an 8-point base grid, with 4-point micro steps for tight metric badges and segmented controls.

## Elevation & Depth

Visual hierarchy does not rely on opaque grey dropshadows. Instead, elevation is expressed through refractive glass stacking, translucent internal fills, and chromatic violet glow diffusion.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Flat `#0D0A12` with subtle background radial gradients (`radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.08) 0%, transparent 60%)`).
- **Level 1 (Structural Cards & Modules):** `rgba(36, 27, 53, 0.45)` fill, `backdrop-filter: blur(20px)`, hairline border of `1px solid rgba(168, 85, 247, 0.12)`. Subtle drop shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.45)`.
- **Level 2 (Hover States & Elevated Panels):** `rgba(36, 27, 53, 0.70)` fill, `backdrop-filter: blur(28px)`, border `1px solid rgba(192, 132, 252, 0.28)`. Drop shadow: `0 16px 40px -8px rgba(0, 0, 0, 0.65), 0 0 24px 0 rgba(168, 85, 247, 0.12)`.
- **Level 3 (Modals, Overlays & Prompts):** `rgba(24, 19, 32, 0.88)` fill, `backdrop-filter: blur(36px)`, border `1px solid rgba(221, 214, 254, 0.25)`. Drop shadow: `0 24px 64px -12px rgba(0, 0, 0, 0.85), 0 0 32px 2px rgba(168, 85, 247, 0.20)`.

### Lighting & Specular Accent
Every glass layer includes an inner specular edge highlight created using `box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.10)`. This mimics light catching the bevel of polished crystal.

## Shapes

The interface embraces generous, polished curvature to soften complex analytical displays and evoke luxury hospitality hardware.

- **Base Radius (`rounded-md`, 8px):** Form controls, inputs, micro menu selections, and tags.
- **Medium Radius (`rounded-lg`, 16px):** Nested containers, action popovers, and table envelopes.
- **Card Radius (`rounded-2xl`, 24px):** Standard dashboard widgets, timeline segments, and summary modules.
- **Feature Radius (`rounded-3xl`, 32px):** Primary AI orchestration console, hero spotlight banners, and modal dialogs.
- **Pill Radius (`rounded-full`, 9999px):** Status badges, chips, generative trigger pills, and floating action dock bars.

## Components

### Buttons
- **Primary (Generative Trigger):** Solid violet-to-plum gradient (`linear-gradient(135deg, #A855F7 0%, #9333EA 100%)`), text `#FFFFFF`, roundedness `rounded-full` or `rounded-xl`. Enhanced with an ambient hover glow: `box-shadow: 0 0 20px rgba(168, 85, 247, 0.45)`.
- **Secondary Glass:** Background `rgba(168, 85, 247, 0.08)`, border `1px solid rgba(168, 85, 247, 0.22)`, text `#DDD6FE`. Hover triggers `background: rgba(168, 85, 247, 0.16)` and white text.
- **Ghost Action:** Transparent background, text `#94A3B8`, hover text `#FFFFFF` with soft background `rgba(255, 255, 255, 0.05)`.

### Cards & Surfaces
- Structural background of frosted dark plum (`rgba(36, 27, 53, 0.45)`), 20px blur, and subtle borders. 
- Headers inside cards display `headline-sm` with top-aligned monospaced status badges. Hover states shift the border color to `rgba(192, 132, 252, 0.35)` with an eased transition of `250ms cubic-bezier(0.16, 1, 0.3, 1)`.

### Input Fields & Prompt Bars
- Deep inset background `rgba(13, 10, 18, 0.65)`, border `1px solid rgba(168, 85, 247, 0.15)`, text `#F3F4F6`, placeholder `#64748B`.
- Focused state applies `border-color: #A855F7`, alongside an outer ring glow: `box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.20)`.
- GenAI query inputs are rendered as oversized pill containers with trailing glowing submit badges and instant token auto-completions.

### Chips & Badges
- Pill-shaped (`rounded-full`) with uppercase typography set in `label-mono-sm`.
- **Success:** Background `rgba(16, 185, 129, 0.12)`, text `#10B981`, border `1px solid rgba(16, 185, 129, 0.3)`.
- **Warning:** Background `rgba(245, 158, 11, 0.12)`, text `#F59E0B`, border `1px solid rgba(245, 158, 11, 0.3)`.
- **Alert:** Background `rgba(244, 63, 94, 0.12)`, text `#F43F5E`, border `1px solid rgba(244, 63, 94, 0.3)`.

### Checkboxes & Segmented Controls
- Checkboxes: 18px rounded squares (`rounded-md`), border `1px solid rgba(168, 85, 247, 0.3)`, fill `#181320`. Checked state fills with `#A855F7` carrying a white checkmark.
- Interactive Tabs: Enclosed pill dock (`rgba(18, 15, 23, 0.8)`) where the active tab floats above using `rgba(168, 85, 247, 0.22)`, border `1px solid rgba(168, 85, 247, 0.35)`, and luminous white typography.

### Specialized AI Components
- **GenAI Prompt Assistant:** Floating persistent dock centered at the bottom viewport, glassmorphic blur 32px, equipped with audio waveform telemetry and intelligent suggestion chips.
- **Run-of-Show Timelines:** Vertical timeline tracks rendered with glowing status nodes, connected by subtle gradient threads transitioning from violet to emerald upon item completion.