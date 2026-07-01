# Umlify Foundation Design System
*The Visual Core, Token Architecture, and Component Primitives*

---

## 1. Design Tokens

Design tokens represent the atomic design values of the Umlify product ecosystem. These tokens apply globally across both marketing pages and the editor.

### Spacing & Sizing Scale (8px Grid)
We use a strictly mathematical 8px base grid system.

```
[4px] ─── [8px] ─── [12px] ─── [16px] ─── [24px] ─── [32px] ─── [48px] ─── [64px]
 xxs       xs        sm         md         lg         xl         xxl        xxxl
```

*   `spacing-xxs`: `4px` — Micro-paddings, icon labels.
*   `spacing-xs`: `8px` — Inner button padding, badge elements.
*   `spacing-sm`: `12px` — Interactive inputs, dropdown list spacing.
*   `spacing-md`: `16px` — Standard card padding, small grid margins.
*   `spacing-lg`: `24px` — Sidebar margins, container inner padding.
*   `spacing-xl`: `32px` — Section gutters, larger card spacing.
*   `spacing-xxl`: `48px` — Large panel padding, structural dividers.
*   `spacing-xxxl`: `64px` — Top/bottom section padding.

### Border Radius System
*   `radius-interactive`: `6px` — Buttons, input fields, checkboxes. (Kept sharp and technical).
*   `radius-card`: `12px` — Panel grids, information cards.
*   `radius-panel`: `16px` — Dialog panels, dropdown wrappers, main workspace containers.

### Opacity Scale
*   `opacity-solid`: `1.0` — Clear body text, prominent icons.
*   `opacity-muted`: `0.7` — Secondary headers, descriptive text.
*   `opacity-dim`: `0.4` — Placeholder text, keyboard shortcut labels.
*   `opacity-ghost`: `0.08` — Disabled borders, subtle grid overlays.

### Z-Index Hierarchy
*   `z-toast`: `50` — System notifications.
*   `z-dialog`: `40` — Fullscreen modals and dialog blocks.
*   `z-overlay`: `30` — Backdrop filters.
*   `z-navigation`: `20` — Sticky global menus.
*   `z-dropdown`: `10` — Context lists, selector items.
*   `z-base`: `1` — Core application layout.

---

## 2. Typography System

We utilize a high-contrast sans-serif font stack (Geist/Inter) for interface structures and a developer-centric monospace stack (JetBrains Mono/SF Mono) for technical representations.

| Text Style | Size | Weight | Line Height | Letter Spacing | Primary Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 56px | 700 (Bold) | 1.1 | `-0.04em` | Main hero title. Limit to 3 lines. |
| **Hero Description** | 18px | 400 (Regular) | 1.6 | `-0.01em` | Explanatory subtext in the hero section. |
| **Section Heading** | 36px | 600 (Semi-Bold) | 1.2 | `-0.03em` | Primary section headings. |
| **Section Label** | 12px | 500 (Medium) | 1.4 | `+0.05em` | Monospace uppercase tag above headers. |
| **Card Title** | 20px | 600 (Semi-Bold) | 1.3 | `-0.02em` | Headline inside layout cards. |
| **Card Description** | 15px | 400 (Regular) | 1.5 | `0` | Supporting card copy. |
| **Button Text** | 14px | 500 (Medium) | 1.0 | `-0.01em` | Action triggers. |
| **Navigation Link** | 14px | 500 (Medium) | 1.0 | `-0.01em` | Top navigation items. |
| **Monospace Text** | 13px | 400 (Regular) | 1.5 | `0` | Monospace representation of code/syntax. |
| **Caption** | 13px | 400 (Regular) | 1.4 | `0` | Metadata labels and copyrights. |
| **Badge Text** | 12px | 500 (Medium) | 1.0 | `0` | Small tags, statuses, active tags. |

---

## 3. Color Token System

```
Surfaces      [ Base: #09090B ─────── Surface: #18181B ─────── Elevated: #27272A ]
Borders       [ Default Border: rgba(255,255,255,0.08) ─── Active: #3B82F6 ]
Text Color    [ Primary: #FAFAFA ───── Secondary: #A1A1AA ──── Muted: #52525B ]
```

### Surfaces & Overlays
*   `color-bg-base`: `#09090B` (Dark) / `#FFFFFF` (Light) — Primary screen canvas background.
*   `color-bg-surface`: `#18181B` (Dark) / `#F4F4F5` (Light) — Standard panels, cards, menus.
*   `color-bg-elevated`: `#27272A` (Dark) / `#E4E4E7` (Light) — Dialog layers, hovered surfaces.
*   `color-bg-overlay`: `rgba(9, 9, 11, 0.8)` (Dark) — Modal dimming layers.

### Typography
*   `color-text-primary`: `#FAFAFA` (Dark) / `#09090B` (Light) — Active titles, prominent emphasis.
*   `color-text-secondary`: `#A1A1AA` (Dark) / `#52525B` (Light) — Paragraphs, descriptions, secondary options.
*   `color-text-muted`: `#71717A` (Dark) / `#A1A1AA` (Light) — Metadata tags, hotkey indicators.

### Interactive & Semantic
*   `color-interactive-primary`: `#FFFFFF` (Dark) / `#09090B` (Light) — Core CTA button fill.
*   `color-interactive-accent`: `#3B82F6` (Dark) / `#2563EB` (Light) — Active focus, brand accents.
*   `color-interactive-hover`: `#60A5FA` (Dark) / `#1D4ED8` (Light) — Focus hover outlines.
*   `color-success`: `#10B981` (Green) — Clean execution states.
*   `color-warning`: `#F59E0B` (Amber) — Validating edits.
*   `color-error`: `#EF4444` (Red) — Invalid layouts.

---

## 4. Component Inventory: Abstraction Layer 1 & 2

Every complex section is composed of these basic components.

### Primitive Components
1.  **Button:** Tactile triggers.
    *   *Variations:* Primary (Solid), Secondary (Border), Ghost (Text only).
    *   *Hover:* Expands background or lightens text. Fast transition (`150ms`).
2.  **Icon:** Monoline `1.5px` stroke vectors. Max sizes: `16px` (button inline), `24px` (card header).
3.  **Input:** Custom input fields. Single border with transparent background. Focus triggers `color-interactive-accent` outline.
4.  **Textarea:** Multi-line text field. Inherits input properties with auto-growing height constraint.
5.  **Divider:** `1px` stroke. Dark mode uses `rgba(255,255,255,0.08)`. Light mode uses `rgba(0,0,0,0.08)`.
6.  **Badge / Tag:** Clean status label with tight margins and small font wrapper.
7.  **Tooltip:** Floating popup (`z-dropdown`) appearing on hover to explain actions or display keyboard shortcuts.
8.  **Avatar:** Round profile image indicator (`24px x 24px`) used for collaboration.

### Layout Components
1.  **Container:** Centered wrapper with standard layout widths (`1200px` max).
2.  **Section:** Layout blocks separating landing pages (standard `128px` vertical spacing).
3.  **Navbar:** Sticky header (`z-navigation`) housing brand identity and main links.
4.  **Sidebar:** Drawer layout for application tools. Expandable/collapsible state.
5.  **Toolbar:** Dense group of buttons managing active canvas tools.
6.  **Panel:** Modular window wrapper hosting tools, code, or settings.
7.  **Card:** Graphic box (`radius-card`) displaying structured items.
8.  **Dialog:** Overlay window (`z-dialog`) focusing screen attention on settings or confirmations.
9.  **Drawer:** Sidebar overlay sliding in from the screen edges on small devices.

---

## 5. Grid System & Responsiveness

```
Breakpoints:   [Mobile: bp-mobile (<768px)] ─── [Tablet: bp-tablet (768-1023px)] ─── [Desktop: bp-desktop (>=1024px)]
Layout Span:   [4 columns] ────────────────────── [8 columns] ─────────────────────── [12 columns]
Gutter size:   [16px] ─────────────────────────── [24px] ──────────────────────────── [32px]
```

### Layout Alignment Rules
*   Desktop columns use uniform `32px` gutter margins.
*   Mobile grids reflow multi-column cards into a stacked list.
*   Tap targets expand to a minimum dimension of `44px` on mobile screens to support touch inputs.

---

## 6. Elevation & Depth System

We stack layers vertically to represent hierarchy.

| Level | Token | Dark Mode Appearance | Light Mode Appearance | Intended Usage |
| :--- | :--- | :--- | :--- | :--- |
| **0** | `depth-base` | `#09090B` | `#FFFFFF` | Main background layer. |
| **1** | `depth-surface` | `#18181B` + border-default | `#F4F4F5` + border-default | Card decks, active sidebar panels. |
| **2** | `depth-elevated` | `#27272A` + border-elevated | `#E4E4E7` + border-elevated | Hover states, active dropdown lists. |
| **3** | `depth-floating` | `#27272A` + custom border shadow | `#FFFFFF` + soft outline drop shadow | Tooltips, dialog boxes. |
