# Umlify Project Architecture
*The Technical Framework, Folder Structures, and System Layer Boundaries*

---

## 1. Folder Structure

The project separates documentation, user interface (UI), and API boundaries cleanly:

```
UML-IFY/
├── docs/                      # Architectural designs, strategy, and progress status tracking
├── UMLify-ui/                 # Frontend Web Application (Vue 3, Vite, Tailwind v4)
│   ├── src/
│   │   ├── assets/            # Global images and static resources
│   │   ├── components/
│   │   │   ├── ui/            # Core UI Primitives (Button, Input, Badge, Divider)
│   │   │   │   └── layout/    # Layout Primitives (Surface, Container, Stack, Grid, Section)
│   │   │   └── ...            # High-level editor tools (Canvas, Actor, UseCase, connector)
│   │   ├── router/            # Vue Router mappings (index.js)
│   │   ├── stores/            # Pinia state managers (authStore.js)
│   │   ├── Views/             # High-level views (Landing.vue, Playground.vue, Home.vue)
│   │   ├── App.vue            # Root template wrapper consuming base styles
│   │   ├── main.js            # Frontend application bootstrapper
│   │   └── style.css          # Global CSS, @theme design tokens, scrollbars
│   ├── tailwind.config.js     # Legacy config (Tailwind v4 reads theme directly from style.css)
│   └── vite.config.js         # Vite configuration with Vue and Tailwind v4 plugins
└── Umlify-api/                # Backend API boundaries
```

---

## 2. Design Token System

Umlify configures design tokens inside `UMLify-ui/src/style.css` using custom CSS variables mapped in both light and dark modes:

*   **Light Theme Variables (`:root`):**
    *   `--color-bg-base`: `#ffffff`
    *   `--color-bg-surface`: `#f4f4f5`
    *   `--color-bg-elevated`: `#e4e4e7`
    *   `--color-text-primary`: `#09090b`
    *   `--color-text-secondary`: `#52525b`
    *   `--color-text-muted`: `#a1a1aa`
    *   `--color-interactive-primary`: `#09090b`
    *   `--color-interactive-accent`: `#2563eb`
    *   `--color-interactive-hover`: `#1d4ed8`
    *   `--color-border-default`: `rgba(0, 0, 0, 0.08)`
    *   `--color-border-elevated`: `rgba(0, 0, 0, 0.12)`
    *   `--color-accent-aura`: `#63e`
*   **Dark Theme Variables (`.dark`):**
    *   `--color-bg-base`: `#09090b`
    *   `--color-bg-surface`: `#18181b`
    *   `--color-bg-elevated`: `#27272a`
    *   `--color-text-primary`: `#fafafa`
    *   `--color-text-secondary`: `#a1a1aa`
    *   `--color-text-muted`: `#71717a`
    *   `--color-interactive-primary`: `#ffffff`
    *   `--color-interactive-accent`: `#3b82f6`
    *   `--color-interactive-hover`: `#60a5fa`
    *   `--color-border-default`: `rgba(255, 255, 255, 0.08)`
    *   `--color-border-elevated`: `rgba(255, 255, 255, 0.12)`
    *   `--color-accent-aura`: `#63e`

### Tailwind v4 Integration (`@theme`)
These CSS variables are bound directly inside Tailwind v4's `@theme` directive, which compiles them into reusable utility classes (e.g., `bg-bg-base`, `text-text-primary`, `border-border-default`, `p-md`, `rounded-interactive`, etc.).

---

## 3. Component Hierarchy

Umlify components are organized strictly by abstraction layers, preventing layout-bleed and code duplication:

```
┌────────────────────────────────────────────────────────┐
│  Layer 4: Product/Landing Views (Hero, FeatureGrid)    │ [Uses Layers 1, 2, 3]
├────────────────────────────────────────────────────────┤
│  Layer 3: Editor Views (Canvas, Inspector, SyntaxEditor)│ [Uses Layers 1, 2]
├────────────────────────────────────────────────────────┤
│  Layer 2: Layout Primitives (Surface, Container, Stack)│ [Uses Layer 1]
├────────────────────────────────────────────────────────┤
│  Layer 1: UI Primitives (Button, Input, Badge, Divider)│ [Base Level]
└────────────────────────────────────────────────────────┘
```

---

## 4. Primitive Implementations

### UI Primitives (Abstraction Level 1)
*   **`Button.vue`:** Standard action button supporting `primary`, `secondary`, and `ghost` presets. Handles disabled states, loading spinners, block layouts (`full`), and keyboard focus outlines.
*   **`Input.vue` & `Textarea.vue`:** Input forms featuring labels, custom inputs, and dynamic error state triggers.
*   **`Badge.vue`:** Inline metadata indicator tag (neutral, success, warning, error, accent).
*   **`Divider.vue`:** Layout line supporting horizontal and vertical directions.

### Layout Primitives (Abstraction Level 2)
*   **`Surface.vue`:** Core structural container mapping backgrounds, border styles, radii (`radius-interactive`/`radius-card`/`radius-panel`), and hover states. Cards, panels, and dialogs inherit from `Surface.vue`.
*   **`Container.vue`:** Handles layout bounds.
*   **`Stack.vue`:** Flexbox layout manager controlling rows/columns, gaps, alignments, justifications, and wrap behaviors.
*   **`Grid.vue`:** CSS Grid builder mapping mobile, tablet, and desktop columns across breakpoints.
*   **`Section.vue`:** standard padding wrapper.

---

## 5. Motion System

Animations are modeled to make the digital interface feel responsive, physical, and alive:

*   **Easing & Timing:** Standard tactile ease `cubic-bezier(0.16, 1, 0.3, 1)` with transitions of `150ms` (fast hovers), `250ms` (card entrances), and `350ms` (navbars, overlays).
*   **Sequenced Page Load:** Elements trigger sequentially on mount (Navbar -> Badge -> Headline -> Paragraph -> CTAs -> Trust Row -> Workspace Editor Preview).
*   **Ambient Transitions:** Micro-interactions (cursor blinking, compile loop animation) are integrated directly inside the workspace preview.
*   **Accessibility Overrides:** CSS media query `@media (prefers-reduced-motion: reduce)` overrides all transitions, delays, and transforms to prevent animation triggers.

---

## 6. Routing Structure

Umlify maps browser paths to views inside `src/router/index.js`:

*   `/` — Landing Page (rebuilt with high-fidelity components, Navbar, Hero).
*   `/workspace` — Editor Workspace (`Home.vue`, protected by authentication guards).
*   `/playground` — Visual Design System Sandbox (`Playground.vue` renders all primitives).
*   `/login` / `/signup` — Account access panels.

---

## 7. Developer Workflow

1.  **Verify Components:** Always implement UI features by combining existing primitives (`Surface`, `Stack`, `Grid`, `Button`). Never write custom borders, backgrounds, or radii.
2.  **Visual Check:** Trigger local dev server, edit styles inside `style.css`, and review changes on `/playground` to ensure changes compile correctly and don't break existing panels.
3.  **Vite Compilation:** Run `npm run build` to confirm Vite bundles assets successfully before merging changes.
