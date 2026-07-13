# Umlify Project Status

This document tracks the current progress, completed milestones, active work, and planned roadmap for Umlify.

---

## Current Version

**`v0.2.0-alpha`**

---

## Completed Milestones

- `[x]` Brand Positioning & Product Strategy Specifications
- `[x]` Landing Page Information Architecture & Storytelling Blueprint
- `[x]` Design System Tokens & Abstraction Specifications
- `[x]` Tailwind CSS v4 Global CSS `@theme` variables setup
- `[x]` Folder Architecture setup (Primitives and Layout divisions)
- `[x]` Core UI Primitives:
  - `[x]` `Button.vue` (Variants, loading states, block configurations)
  - `[x]` `Input.vue` (Labels, states, validation error highlights)
  - `[x]` `Textarea.vue` (Multi-line syntax boxes)
  - `[x]` `Badge.vue` (Status tags)
  - `[x]` `Divider.vue` (Horizontal and vertical separating strokes)
- `[x]` Core Layout Primitives:
  - `[x]` `Surface.vue` (Visual container driving depth elevations and borders)
  - `[x]` `Container.vue` (Responsive layout boundaries)
  - `[x]` `Stack.vue` (Flex alignment systems)
  - `[x]` `Grid.vue` (Responsive column distributions)
  - `[x]` `Section.vue` (Vertical padding sections)
- `[x]` Refactored Components:
  - `[x]` `Card.vue` (Inherits styling from `Surface`)
  - `[x]` `Panel.vue` (Collapsible sidebar pane, inherits from `Surface`)
  - `[x]` `Dialog.vue` (Floating modal panel, inherits from `Surface`)
- `[x]` Visual Component Playground (`/playground` view)
- `[x]` Production Sticky Navbar (Glassmorphic blur, scroll transparency offsets, mobile drawer menu)
- `[x]` Production Hero Section (Sequenced page-load transformations, static high-fidelity editor diagram workspace mock, compile/cursor ambient loops)

---

## In Progress

- `[/]` Landing Page content assembly — Navbar, Hero, and Interactive Showcase complete; Features, Diagram Types, Export & Integrations, Keyboard Productivity, FAQ, and Footer still open.
- `[/]` Workspace Refactor / Editor Restoration (ACTIVE) — REG-01–07 restored, REG-08 partially; ⌘K command palette and Tab selection added; MiniMap mounted.

---

## Planned Milestones

### 1. Landing Page Assembly
- `[ ]` Diagram Types Showcase Panel (Interactable class, sequence, activity switcher)
- `[ ]` Workflow Integrations & Trust section
- `[ ]` Landing page Footer

### 2. Dashboard
- `[ ]` Template browser gallery
- `[ ]` Document listing grid (Create, delete, rename diagrams)
- `[ ]` User Account Settings panel

### 3. Editor Workspace & Canvas Refactor
- `[ ]` Left toolbox drawer
- `[ ]` Main Canvas WebGL/SVG rendering engine
- `[ ]` Right Inspector properties form
- `[ ]` Live syntax code input panel with error indicators
- `[ ]` Command Palette omnibar search (`⌘K`)
- `[ ]` Real-time multiplayer synchronization (user cursors and selectors)

---

## Locked Components

The following components are marked as production-ready and locked against redesigns:

*   **Layout Primitives:** `Surface.vue`, `Container.vue`, `Stack.vue`, `Grid.vue`, `Section.vue`
*   **UI Primitives:** `Button.vue`, `Input.vue`, `Textarea.vue`, `Badge.vue`, `Divider.vue`, `Card.vue`, `Panel.vue`, `Dialog.vue`
*   **Production Views:** `Navbar.vue`, `Hero.vue`

---

## Next Immediate Goal

**Finish the Landing Page sections** (Features / Product Showcase, Diagram Types, Export & Integrations, Keyboard Productivity, FAQ, Footer) using `Section`, `Grid`, and `Card`, then complete the `Inspector` panel and any remaining `REG-08` shell cleanup to reach a consistent v1.0.

---

## Notes

*   **Reusability First:** Always compose new pages and sections using existing layout and UI primitives. Never duplicate background, border, or rounded radii rules.
*   **Architecture Track:** Any major change to the visual or folder structure must update the documentation in `/docs` to maintain single-source-of-truth integrity.
