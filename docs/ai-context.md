# Umlify Overview & AI Context

This document provides a comprehensive overview of the Umlify project's architecture, design system, technology stack, and engineering rules. It serves as the single source of truth for future AI coding assistants to quickly understand the project context without parsing the entire codebase.

---

## Umlify Overview

Umlify is a modern, high-performance web application that allows users to create, edit, and export professional UML diagrams directly in the browser.

*   **Target Audience:** Software engineers, systems architects, technical leads, technical product managers, and computer science students.
*   **Core Value Proposition:** Speed and visual clarity. Unlike clunky legacy UML tools or general-purpose whiteboards, Umlify merges syntax-driven precision (or keyboard-driven semantic inputs) with auto-layout compilation to generate presentation-ready diagram models instantly.
*   **Product Vision:** A premium engineering utility that respects developer ergonomics, maintaining a distraction-free, responsive workspace.

---

## Technology Stack

The project frontend is housed in the `UMLify-ui/` directory and utilizes the following stack:

*   **Framework:** Vue.js 3 (using Composition API with `<script setup>` syntax).
*   **Language:** Vanilla JavaScript (no TypeScript).
*   **Build Tool & Dev Server:** Vite.
*   **Styling (CSS):** Tailwind CSS v4 (configured via CSS-first directives with `@theme` overrides).
*   **Iconography:** Lucide Icons (`lucide-vue-next` package).
*   **State Management:** Pinia (for auth and workspace diagram state handling).
*   **Routing:** Vue Router.

---

## Design Philosophy

Umlify is built as an **engineering tool**, not a marketing site. Visual decisions must reflect utility, structure, and ergonomics:

*   **Clarity Before Decoration:** Visual items must represent logical relationships (inheritance, association, composition), never arbitrary decorative noise.
*   **Visual Precision:** Employs 1px borders and grid coordinates rather than soft, blurry shadows or glowing neon backdrops.
*   **Ergonomic Calm:** A dark-mode-first environment using low-contrast backgrounds (Midnight Slate, Charcoal) to reduce eye strain during hours of complex system design.
*   **Craftsmanship & Focus:** Uses mathematical spacing grids and premium typography (Inter/Monospace stacks) to direct focus onto the diagrams.

---

## Design System

All visual layouts are constructed by composing reusable tokens and abstractions defined in the design system. Never write ad-hoc utility overrides.

*   **Design Tokens:**
    *   *Spacing Grid:* Base-8 spacing scale (`spacing-xxs` (4px) to `spacing-xxxl` (64px)).
    *   *Radius System:* Sharp, technical curves: `radius-interactive` (6px), `radius-card` (12px), `radius-panel` (16px).
    *   *Elevation Layers:* Stacking depth levels: `depth-base` (Level 0), `depth-surface` (Level 1), `depth-elevated` (Level 2), and `depth-floating` (Level 3).
*   **Layout Primitives (`src/components/ui/layout/`):**
    *   `Surface.vue` — Visual box container mapping backgrounds, border styles, and elevation layers.
    *   `Container.vue` — Restricts horizontal layout spans (Standard max-width: `1200px`, Narrow: `800px`).
    *   `Stack.vue` — Flexbox layout engine for spacing, alignments, and wrapping.
    *   `Grid.vue` — CSS Grid layout mapping responsive columns across breakpoints.
    *   `Section.vue` — Standard vertical block padding wrapper.
*   **UI Primitives (`src/components/ui/`):**
    *   `Button.vue` — Standard buttons with `primary`, `secondary`, and `ghost` presets. Supports loading, disabled, and full-width block states.
    *   `Input.vue` & `Textarea.vue` — Text input fields with error validation highlights.
    *   `Badge.vue` — Status tags (neutral, success, warning, error, accent).
    *   `Divider.vue` — Thin dividing lines (horizontal or vertical).
    *   `Dialog.vue` — Modal overlay viewport utilizing backdrop filters and transition scales.
    *   `Panel.vue` — Dense collapsible sidebar containers.

---

## Development Rules

Future code additions must strictly follow these engineering guidelines:

1.  **No Hardcoded Colors/Spacing:** Always use Tailwind v4 utility values mapped to design tokens (e.g., `bg-bg-base`, `p-md`, `rounded-interactive`, `ease-tactile`).
2.  **Inherit from Surface:** Never reinvent containers. Custom cards, panels, or toolbars must utilize the `<Surface>` primitive to inherit visual elevations and borders.
3.  **Responsive-First:** Viewport layouts must support Desktop (12-col grid), Tablet (8-col reflow), and Mobile (1-col stack). Tap targets must be a minimum of `44px` on mobile.
4.  **Respect prefers-reduced-motion:** Wrap all css/animate keyframes in media queries to disable transitions when accessibility flags are set.
5.  **A11y Compliant:** Add standard screen reader attributes (`aria-label`) and ensure focus rings are visible on keyboard navigation (`focus-visible:ring-2`).
6.  **GPU-Accelerated Performance:** Restrict animations to `opacity` and `transform` properties to prevent DOM reflow cycles and keep renderings at 60fps.

---

## Folder Architecture

The primary folders inside the repository are structured as follows:

```
UML-IFY/
├── docs/                      # Architectural designs, strategy, and progress status tracking
└── UMLify-ui/
    ├── src/
    │   ├── assets/            # Global images and static resources
    │   ├── components/
    │   │   └── ui/            # Core UI Primitives (Button, Input, Badge, etc.)
    │   │       └── layout/    # Layout Primitives (Surface, Container, Stack, etc.)
    │   ├── router/            # Vue Router mappings
    │   ├── stores/            # Pinia state managers (auth, diagram compilation)
    │   ├── Views/             # Page layouts (Landing.vue, Playground.vue, Home.vue)
    │   ├── App.vue            # Root template wrapper consuming base styles
    │   └── style.css          # Global CSS, @theme design tokens, scrollbars
```

---

## Locked Components

The following modules are fully production-ready and **must not** be modified or redesigned:

*   `Surface.vue`, `Container.vue`, `Stack.vue`, `Grid.vue`, `Section.vue` (Core layout engines).
*   `Button.vue`, `Input.vue`, `Textarea.vue`, `Badge.vue`, `Divider.vue`, `Dialog.vue`, `Panel.vue` (UI Primitives).
*   `Navbar.vue` (Responsive glassmorphic header).
*   `Hero.vue` (Sequenced page-load layout and UML editor preview).

---

## Current Project Phase

We are in the **Landing Page Implementation** phase.
*   **Completed:** Core layout primitives, typography tokens, production Navbar, Hero section, and the visual Component Playground.
*   **Next Steps:** Implement the Features list section of the landing page.

---

## AI Instructions for Future Work

*   **Extend, Don't Recreate:** When building new components, compile them using existing primitives (`Surface`, `Stack`, `Grid`, `Button`) instead of writing raw HTML/CSS nodes.
*   **Align Copywriting:** Marketing text must remain engineering-focused. Avoid hype words ("AI-powered", "revolutionary") and describe features with functional precision.
*   **Verify on Playground:** If modifying token definitions in `style.css`, always load `/playground` to visually verify that layout changes do not break other primitives.
