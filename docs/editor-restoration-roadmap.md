# Core Editor Restoration Roadmap

This document serves as the master engineering audit and restoration roadmap for the Umlify UML Editor. It catalogs regressions introduced during the design-system migration, diagnoses their root causes, rates severity, and maps out a prioritized restoration path to prepare the editor for version 1.0.

---

## 1. Complete Editor Deficit Inventory

| Issue ID | Feature / System Affected | Status (as of 2026-07-13) | Refactor Origin |
| :--- | :--- | :--- | :--- |
| **REG-01** | Selection Highlight Outline & Perimeter Anchors | **✅ Fixed** | Tailwind CSS v4 migration |
| **REG-02** | Marquee Selection Box & Link Drag Preview | **✅ Fixed** | Tailwind CSS v4 migration |
| **REG-03** | Element Drag-and-Drop and Resize Controls | **✅ Fixed** | Multiple event listener refactors |
| **REG-04** | Alignment Snap Coordinates Mismatch | **✅ Fixed** | Grid spacing adjustments |
| **REG-05** | Dark Mode Connector Label Aura | **✅ Fixed** | Dark theme variables update |
| **REG-06** | Productive Key Shortcuts (⌘K, Duplication, Tab) | **✅ Fixed** | Key binding migrations |
| **REG-07** | MiniMap (Thumbnail Viewport) | **✅ Fixed** | Core shell layout refactor |
| **REG-08** | Legacy Sidebar & Toolbar Containers | **⚠️ Partial** | Layer 2 primitives adoption |

> **Status legend:** ✅ = restored in the July 2026 remediation pass (Phases A–C). ⚠️ = partially addressed (see §4).

---

## 2. In-Depth Root Cause & Structural Diagnosis

### REG-01: Invisible Node Selection & Anchors
- **Affected Files**:
  - `Canvas.vue` (lines 43, 128)
  - `connector.vue` (lines 18, 25, 35, 62, 73)
- **Root Cause**: Selection outlines and connector paths reference the variable `var(--accent-violet)`. This variable is not defined in Tailwind v4 `@theme` inside [style.css](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/Vue.js/UML-IFY/UMLify-ui/src/style.css). Selected outlines render with default/transparent colors and are effectively invisible.
- **Complexity**: Low (requires replacing legacy variables with standard `--color-interactive-accent`).
- **Dependencies**: None.

### REG-02: Broken Marquee Box & Connection Drag Preview
- **Affected Files**:
  - `Canvas.vue` (lines 22, 128, 147, 162, 173)
- **Root Cause**: The canvas references `var(--color-accent-blue)`, `border-accent-blue`, and `bg-accent-blue/10` to draw the marquee box, snap lines, and temporary dashed drag paths. Because `accent-blue` is not a defined Tailwind v4 color (replaced by `interactive-accent` / `--color-interactive-accent`), the dragging preview is broken.
- **Complexity**: Low (requires re-binding paths to `--color-interactive-accent`).
- **Dependencies**: None.

### REG-03: Erratic Drag & Resize Event Collisions
- **Affected Files**:
  - `Canvas.vue` (line 38)
  - `Actor.vue` (lines 8, 44, 99, 125)
  - `UseCase.vue` (lines 9, 23, 79, 106)
  - `System.vue` / `Package.vue` / `Note.vue` (mousedown handlers)
- **Root Cause**: `Canvas.vue` listens to `@mousedown.stop="initiateElementsDrag"` on node wrappers, while child elements (`Actor.vue`, `UseCase.vue`, etc.) listen to their own `@mousedown="startDrag"` and `@mousedown.stop="startResize"` scripts. These handlers fight over pointer capture, resulting in coordinate jumps and drag failures.
- **Complexity**: Medium (requires stripping duplicate drag/resize handlers from child components and managing positions globally in `Canvas.vue`).
- **Dependencies**: REG-01 (visible selection handles are required to target resize bounds).

### REG-04: Alignment Snap Coordinate Mismatch
- **Affected Files**:
  - `Canvas.vue` (lines 564-607)
- **Root Cause**: The canvas snapping system quantizes dragging positions to a `16px` grid: `Math.round((baseX + deltaX) / 16) * 16`. However, the design specification in `docs/editor-design-system.md` dictates a `20px` interval dot grid. This mismatch causes elements to snap offset from the visible dots.
- **Complexity**: Medium (align coordinates to a clean `20px` interval grid).
- **Dependencies**: REG-03 (dragging physics must be consolidated first).

### REG-05: Dark Mode Connector Label Blinding Halo
- **Affected Files**:
  - `connector.vue` (line 343)
- **Root Cause**: Connector relationship labels use a hardcoded white outline (`stroke: #fafafa;`) to mask the text background. In dark mode, this outline remains white, creating a high-contrast halo over dark grids.
- **Complexity**: Low (bind the outline stroke to `--color-bg-base` to automatically adjust to the active theme).
- **Dependencies**: None.

### REG-06: Missing Key Shortcuts (⌘K & Duplicate)
- **Affected Files**:
  - `Canvas.vue` (lines 858-873)
  - `Home.vue` (key listeners)
- **Root Cause**: Keydown listeners in `Canvas.vue` only intercept `Ctrl+Z`, `Ctrl+Y`, and `Delete/Backspace`. Core keyboard workflows (⌘K action palette, `Ctrl+D` duplicate, `Tab` element focus) are unmapped.
- **Complexity**: Medium (requires building action triggers and connecting them to the canvas store).
- **Dependencies**: Command Palette layout completion.

### REG-07: Missing MiniMap Component
- **Affected Files**:
  - `Home.vue` (requires integration)
  - `MiniMap.vue` (needs creation)
- **Root Cause**: No MiniMap component exists in `src/components/`, leaving it as a placeholder.
- **Complexity**: Medium/High (requires rendering a scaled-down SVG schema reflecting active nodes).
- **Dependencies**: Diagram Store reactive element tracking.

### REG-08: Legacy Shell Containers
- **Affected Files**:
  - `Home.vue`
  - `Toolbar.vue`
  - `TerminalEditor.vue`
- **Root Cause**: Side panels, headers, and spawner buttons are styled with custom, hardcoded backgrounds and corners, bypassing design system primitives.
- **Complexity**: Medium (requires refactoring layouts to use `Surface`, `Stack`, `Grid`, `Input`, and `Button`).
- **Dependencies**: None.

---

## 3. Prioritized Restoration Roadmap

To restore editor functionality safely, we will execute the refactor in three prioritized sequences:

### Priority 1: Critical Editor Functionality (Core Physics & Selections)

1.  **Step 1: Color Token Repairs (REG-01, REG-02)**
    - *Action*: Swap `accent-violet` and `accent-blue` references with standard `interactive-accent` tokens.
    - *Goal*: Restore visibility to selection highlights, dragmarquee boxes, snap guidelines, and active link paths.
2.  **Step 2: Drag & Resize Event Consolidation (REG-03)**
    - *Action*: Delete local dragging/resizing event listeners from child nodes (`Actor`, `UseCase`, `System`, `Package`, `Note`). Route pointer capture exclusively through `Canvas.vue`.
    - *Goal*: Re-establish single coordinate tracking, preventing mouse lockups.
3.  **Step 3: Snap Grid Correction (REG-04)**
    - *Action*: Standardize snapping quantization to a `20px` interval grid (matching the visible dot grid).
    - *Goal*: Ensure relocated nodes align precisely with the blueprint matrix.

### Priority 2: Workflow Improvements (Productivity Loops)

4.  **Step 4: Keyboard Shortcuts & Focus (REG-06)**
    - *Action*: Wire keyboard listeners to handle element duplication (`Ctrl+D`), text comment toggles (`Ctrl+/`), and `Tab` cycles.
    - *Goal*: Enable keyboard-first productivity workflows.
5.  **Step 5: Shell Primitive Refactor (REG-08)**
    - *Action*: Refactor custom panel layouts in `Home.vue`, `Toolbar.vue`, and `TerminalEditor.vue` to adopt `Surface`, `Stack`, and `Grid` primitives.
    - *Goal*: Align the editor layout with the clean, modern look of the landing page.
6.  **Step 6: MiniMap Engine (REG-07)**
    - *Action*: Create `MiniMap.vue` rendering a mini SVG viewport syncing canvas bounds. Place it in the bottom-right corner.
    - *Goal*: Improve navigation on large diagram coordinates.

### Priority 3: Visual Polish (Contrast & Consistency)

7.  **Step 7: Connector Label Halos (REG-05)**
    - *Action*: Bind label outline masks to the background CSS variable (`--color-bg-base`).
    - *Goal*: Remove white blinding outlines in dark mode.
8.  **Step 8: Vector Arrowheads & Clearance Routing**
    - *Action*: Standardize relationship arrow markers (`▷`, `◇`, `◆`) and refine clearance routing margins to prevent lines overlapping node corners.
    - *Goal*: Complete academic UML representation compliance.

---

## 4. Resolution Status (July 2026 Remediation Pass — Phases A–C)

All regressions except REG-08 were fully restored in the July 2026 pass. Summary of what actually landed:

- **REG-01 / REG-02 / REG-03 / REG-04 / REG-05** — Fixed across the earlier editor work and Phase B. The original `accent-violet` / `accent-blue` tokens were eliminated entirely (grep returns zero references). The 20px snap grid already matched the design system.
  - *REG-02 caveat:* the marquee box and link-drag preview were fixed, but the **resize-handle dot** in every node component (`Actor.vue`, `UseCase.vue`, `System.vue`, `Package.vue`, `Note.vue`) still referenced the undefined `border-accent-blue` token. This was missed by the original fix and corrected in **Phase B** (rebound to `interactive-accent`).
- **REG-06** — Fixed in **Phase C**. `Ctrl+D` duplicate was already present; the **⌘K / Ctrl+K command palette** (`CommandPalette.vue`) was built and wired through the `COMMAND_PALETTE_OPEN` FSM state, and **Tab / Shift+Tab** now cycles the active selection (canvas-focused only, never hijacks input/control focus).
- **REG-07** — Fixed in **Phase B**. `MiniMap.vue` was already complete but never imported; it is now mounted in `Home.vue` and reflects live `elements` state.
- **REG-08** — **Partial.** Only the editor-shell spots enumerated in the plan were rebind:
  - Cloud-delete rows `bg-rose-600` → `bg-error`.
  - Sidebar resizer `bg-zinc-*` → `bg-bg-elevated` / `bg-border-elevated`.
  - `Toolbar.vue` "System Boundary" card `bg-white`/`border-zinc-*` → `bg-bg-surface`/`border-border-default`.
  - **Not done:** the `bg-navbar-bg` / `border-bar-border` header was intentionally left as-is — those are already mapped semantic tokens (not raw hex), and rebinding to `bg-bg-surface` would break the white-on-dark branding. Also **out of scope:** the pervasive hardcoded `zinc`/`white` classes across the UML node components, `Canvas.vue` anchors, `TerminalEditor.vue`, and the auth views (`Login.vue` / `Signup.vue`). A full REG-08 sweep of those is a separate, larger effort.

### Retired planning artifact: `UMLify-Editor-Engine-Refactor.json`

This file was referenced in planning chats as the source of "Phase 4A–8" (centralizing drag/resize *geometry ownership* into the `InteractionEngine`), but **it was never committed to the repo** — it exists only as a chat artifact and has been retired. Its intent is folded here:

- The `InteractionEngine` (`engines/interaction/`) remains a **permission gate + cursor side-effect** (FSM `transitionTo` / `is` / `canTransition` + cursor styling). It does **not** own pointer-move math.
- Drag, resize, and connection-drag geometry still live in `Canvas.vue`. The earlier "Phase 4A/4B" goal of moving that math **into the engine layer** has **not** been started. If that architectural move is still desired, it is a future item, not a regression.

### Version

Current tracked version is **`v0.2.0-alpha`** (see `project-status.md` and the `Home.vue` workspace header badge, which were reconciled to match).
