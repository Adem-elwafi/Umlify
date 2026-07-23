# Architectural Decision Records (ADR)
*The Official Log of Architectural Decisions for Umlify*

---

## ADR-001: Semantic Design Tokens Only

*   **Status:** Approved
*   **Context:** As a premium visual system, Umlify requires visual consistency across marketing pages, interactive sandboxes, dashboards, and the workspace canvas. Hardcoding utility hex codes or padding values breaks this consistency.
*   **Decision:** All component styling must be defined through semantic design tokens mapped to CSS variables under Tailwind v4 `@theme`. Ad-hoc styling values are strictly forbidden.
*   **Rationale:** Changing a styling choice (e.g., border color) requires updating a single variable inside `style.css` instead of searching the entire codebase for specific CSS rules.
*   **Consequences:** Developers must map colors to semantic definitions (e.g., `border-border-default`, `bg-bg-surface`, `text-text-primary`) rather than utilizing raw CSS configurations.

---

## ADR-002: No Hardcoded Colors or Spacing

*   **Status:** Approved
*   **Context:** Maintaining dark-mode and light-mode states requires dynamic variable switches. Hardcoding hex colors or pixel layout values locks components to a single theme state.
*   **Decision:** Components cannot contain hardcoded values (e.g., `text-[#fafafa]` or `p-[16px]`). All items must refer directly to registered tokens (e.g., `text-text-primary`, `p-md`).
*   **Rationale:** Guarantees that light/dark theme switches function seamlessly across all UI nodes.
*   **Consequences:** Theme switching operates automatically at the root element level, eliminating layout adjustments or inline style overrides.

---

## ADR-003: Reuse Surface Component as Visual Wrapper

*   **Status:** Approved
*   **Context:** Cards, panels, toolbars, sidebars, and dialog modals share common traits: background fills, border styles, radii, and elevations. Re-implementing these leads to duplicate styles.
*   **Decision:** Create a core component (`Surface.vue`) that manages visual envelope properties. High-level containers must wrap elements inside a `<Surface>` primitive to inherit visual elevations and curves.
*   **Rationale:** Consolidates border, shadow, and background styles, guaranteeing visual consistency across the app.
*   **Consequences:** Eliminates visual drift, keeping panel borders, elevations, and curves in sync.

---

## ADR-004: Layout Primitives-First Methodology

*   **Status:** Approved
*   **Context:** Layout wrappers (grids, stacks, margins) are frequently re-implemented using ad-hoc classes, cluttering templates and causing visual misalignment.
*   **Decision:** Establish layout primitive components (`Container`, `Section`, `Stack`, `Grid`) to manage structural spacings, horizontal boundaries, and layout grids.
*   **Rationale:** Developers compose pages using dedicated layout tags, keeping templates tidy and layouts consistent.
*   **Consequences:** Ensures grid lines, vertical margins, and column distributions align across views.

---

## ADR-005: Ergonomic, Distraction-Free Motion Philosophy

*   **Status:** Approved
*   **Context:** Interactive developer tools must feel fast. Slow animations, bouncing effects, or neon glowing animations cause eye strain and distract users.
*   **Decision:** Limit animations to immediate response times (`150ms` hovers, `250ms`/`350ms` transitions) using a tactile easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`). All transitions must use only `transform` and `opacity` properties.
*   **Rationale:** Keeps the interface feeling fast and lightweight while reducing layout reflow overhead.
*   **Consequences:** Animating elements requires using GPU-accelerated css properties, keeping interfaces rendering at 60fps.

---

## ADR-006: Accessibility & Keyboard-First Operability

*   **Status:** Approved
*   **Context:** Technical diagrams are typically built via mouse drags, which presents accessibility challenges and can slow down experienced power users.
*   **Decision:** Umlify is designed keyboard-first. Interactive elements must display visible focus rings (`focus-visible:ring-2`) and support screen reader layouts (`aria-label`, correct heading hierarchies).
*   **Rationale:** Empowers developers to navigate, create, and connect diagram models using keyboard controls.
*   **Consequences:** Focus rings and keyboard shortcuts must be integrated as core visual elements in the design system.

---

## ADR-007: Engineering-First Brand Aesthetics

*   **Status:** Approved
*   **Context:** Startup landing pages often rely on mesh gradients, cartoon illustrations, and marketing buzzwords. This style contradicts Umlify's identity as a precise developer utility.
*   **Decision:** The product interface is the visual hero. The visual language uses grid lines, monospace fonts, actual UML models, and precise 1px borders. Marketing copy must use clear, descriptive language instead of hype words.
*   **Rationale:** Establishes credibility and appeals directly to systems architects and software developers.
*   **Consequences:** Marketing illustrations are replaced with high-fidelity, functional UML layouts and syntax compilations.

---

## ADR-008: Design System Precedence over Feature Implementation

*   **Status:** Approved
*   **Context:** Feature changes can cause visual drift if built without a stable primitive baseline.
*   **Decision:** Establish a visual sandbox (`/playground`) and complete all foundational design system rules and UI primitives before building any page layout or editor feature.
*   **Rationale:** Ensures all features are built on a consistent, verified layout foundation, minimizing refactoring cycles.
*   **Consequences:** Development starts by validating design system primitives on the playground page, keeping styling organized.
## ADR-009 — Explicit Tailwind v4 Namespace Overrides

### Status
Accepted

### Context

Tailwind CSS v4 generates utilities from theme namespaces.

When only semantic spacing tokens were defined, sizing utilities
(max-width, width, height, etc.) inherited spacing values.

This caused utilities like `max-w-xl` to compile to
`max-width: var(--spacing-xl)` rather than their expected rem values.

### Decision

Explicitly declare the following namespaces:

- --max-width-*
- --min-width-*
- --width-*
- --height-*
- --min-height-*
- --max-height-*

Spacing tokens remain semantic and independent.

### Consequences

- Standard Tailwind sizing utilities behave correctly.
- Semantic spacing tokens remain reusable.
- Future contributors can safely use standard utility classes.
- Prevents hidden namespace collisions.

---

## ADR-010 — Decouple LLM Output from Diagram Layout

### Status
Accepted

### Context

The AI diagram generation pipeline (Use Case diagrams) originally asked the
LLM to emit fully-positioned coordinates (`x/y/width/height`) and connection
sides (`fromSide/toSide`) directly, and `applyPayload` trusted those numbers
with no validation. This produced several problems:

- AI-generated positions did not snap to the canvas's 20px manual-drag grid,
  so generated diagrams looked inconsistent with hand-edited ones.
- Malformed or overlapping coordinates from the model were accepted blindly.
- The layout "intelligence" (column placement, system box sizing, adjacency
  ordering) was delegated to a non-deterministic model instead of code, making
  output unpredictable across vendors and runs.

### Decision

Split the LLM's job from the layout's job.

The LLM now outputs **semantics only**, no coordinates, no connection sides:

```json
{
  "actors":    [{ "id": "string", "label": "string" }],
  "system":    { "id": "string", "label": "string" },
  "useCases":  [{ "id": "string", "label": "string" }],
  "connections": [{ "from": "id", "to": "id", "type": "association|include|extend|generalization|dependency" }]
}
```

A new **pure, deterministic layout engine** (`src/utils/useCaseLayout.js`,
`layoutUseCaseDiagram`) consumes that semantic payload and returns fully
positioned elements + connections (the same `{id,type,label,x,y,width,height}`
element shape and `{from,to,fromSide,toSide,type}` connection shape the store
already consumed). `applyPayload` runs the payload through this engine before
calling `diagramStore.addElement` / `connectElements`.

The layout engine:

- Places actors in a single vertical column, centered against total diagram height.
- Positions the System box to the right of the actor column, sized by use-case
  count + padding, growing only if a use-case label genuinely doesn't fit.
- Stacks use cases vertically inside the System box, horizontally centered.
- Orders use cases via barycenter + union-find clustering: each use case
  gets a "target y" from connected actor positions, then include/extend/
  generalization pairs are unioned into clusters; clusters are sorted by
  mean barycenter target and flattened to keep related use cases adjacent
  without a pairwise nudge pass — NOT full crossing-minimization.
- Rounds every coordinate to the nearest 20px (matching the canvas drag grid).
- Pulls default dimensions from `connectorRouting.js`'s `getElementDimensions`
  (single canonical source — no duplicated constants).
- Computes `fromSide`/`toSide` from the final relative element positions.

### Consequences

- Generated diagrams are deterministic, grid-aligned, and consistent with
  hand-edited ones. No coordinate validation is needed because code computes
  positions, not the model.
- The demo vendor now emits the new semantic shape and exercises the real
  layout engine (previously it hardcoded full x/y elements, bypassing layout).
- `connectorRouting.js` is unchanged — path routing only needs final element
  positions, which the engine provides.
- No external layout library (dagre/elkjs) is introduced; layout is plain
  deterministic logic, per this locked decision.