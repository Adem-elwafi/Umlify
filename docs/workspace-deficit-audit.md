# Technical Health Audit & Architectural Deficit Report

**Project:** UMLify Graphics Engine (Vue 3 / Pinia)  
**Date:** July 6, 2026  
**Author:** Principal Software Architect & Core Graphics Engine Coordinator  
**Status:** Brutal Production-Grade Review  

---

## Section 1: Latent Codebase Risks & Structural Regressions

### 1.1 Memory Leak Vectors in Canvas Event Listeners
- **Deficit**: Inside `Canvas.vue`, the mousemove and mouseup event listeners for dragging elements (`handleElementDragMove`), drawing connections (`handleConnectionMouseMove`), and resizing elements (`handleResizeMouseMove`) are registered dynamically on the global `window` object when a drag interaction is initiated.
- **Risk**: If the `Canvas.vue` component is unmounted mid-interaction (e.g., if the user logs out, switches views, or closes the project window while dragging an element or route), the corresponding `removeEventListener` calls inside mouseup handlers are never executed. This leaves active event listener closures on the global `window` referencing detached DOM elements and Vue component scopes, preventing garbage collection of the entire canvas context and diagram store instance.
- **Remediation**: In Phase 8.5, we applied proactive `removeEventListener` calls inside `onBeforeUnmount` to guarantee cleanup of all potential window listener bindings. However, the architecture should transition to a centralized, coordinate-based Event Bus or a canvas-level event delegation wrapper to avoid raw window event binding entirely.

### 1.2 Direct State Mutation Bypass in Pinia Stores
- **Deficit**: In `Canvas.vue`, the computed ref `selectedConnection` is directly mutated:
  ```javascript
  function changeSelectedConnectionType(newType) {
    if (selectedConnection.value) selectedConnection.value.type = newType;
  }
  ```
- **Risk**: Bypassing Pinia's store action dispatching mechanism and directly mutating reactive store elements breaks State FSM guarantees. Time-travel debugging, devtools mutation tracking, history snapshots, and audit logging cannot capture these mutations. This results in desynchronization under high-frequency execution cycles or when synchronizing diagram states over collaboration channels.
- **Remediation**: Mutation of connections must be encapsulated inside a store action (e.g., `diagramStore.updateConnection(id, type)`) to enforce mutation tracking and maintain clean undo/redo history stacks.

### 1.3 Memento Snapshots & Reference Sharing
- **Deficit**: The undo/redo engine relies on a snapshot mechanism utilizing `JSON.parse(JSON.stringify(elements.value))`.
- **Risk**: While deep-copying serializable attributes works for simple nodes, it breaks references between connections and elements. When a snapshot is restored, connection object references (`conn.from` and `conn.to`) are matched using element ID searches. If an element ID is updated or if connection coordinates are partially updated during a frame paint cycle, this lookup can fail or yield stale reference pairs, causing routing drift.

---

## Section 2: UX & Visual Ergonomics Deficits

### 2.1 Double Borders and Component Overlaps
- **Deficit**: The workspace layout features multiple container elements with explicit outer borders (e.g., the persistent left rail, the sliding spawner, and the center viewport). When these containers sit flush against each other, their border lines overlap, creating a double-width border line (2px instead of 1px).
- **Risk**: This breaks the clean "blueprint" grid aesthetic. It makes the interface look unpolished and ad-hoc.
- **Remediation**: The redesign of the shape spawner in `Toolbar.vue` into a unified grid matrix resolves this internally by utilizing clean inner grid lines (using `border-r` and `border-b` on grid children). A similar border-collapsing system should be applied to the top Navbar, left rail, and central canvas divisions.

### 2.2 Keyboard Input Leakage into Canvas Shortcuts
- **Deficit**: Canvas keyboard shortcuts (`Delete`, `Backspace`, `Ctrl+Z`, `Ctrl+Y`, `Ctrl+D`) are handled via a global window keydown listener in `Canvas.vue`. The current check:
  ```javascript
  const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  ```
- **Risk**: Non-standard input fields (e.g., custom select boxes, search bars, rich text editors, or web component shadow DOM inputs) that do not use standard tags or do not update `document.activeElement` will bypass this check. If a user presses `Backspace` or `Delete` inside one of these fields, the canvas intercepts the keypress and deletes the currently selected diagram element.
- **Remediation**: Implement a global focus state manager or require explicit canvas element focus (e.g., via a canvas `tabindex="0"` focus trap) before executing hotkeys.

### 2.3 Hardcoded Layout Sizes on High-Density Screens
- **Deficit**: The text label sizing (`text-[10px]`) and path coordinate clearances (e.g., `24px` clearance offset) are hardcoded pixel values.
- **Risk**: On high-DPI displays (4K screens with 150% scaling or mobile viewports), these hardcoded sizes do not scale fluidly with zoom or user scaling. This leads to text labels clipping, connector text halos overlapping line bends, and connection edit anchors (`•`) becoming extremely difficult to target with a cursor.

---

## Section 3: Strategic Feature Roadmap & Optimization Proposals

### 3.1 Viewport Culling and SVG Quadtree Indexing
- **Proposal**: For large scale UML models containing 100+ nodes and hundreds of connectors, real-time recalculation of SVG paths degrades FPS below 30. We propose introducing a Quadtree spatial index for all elements.
- **Mechanism**: On zoom/pan changes, check which nodes overlap the current viewport bounding box. Set `display: none` or skip rendering for nodes and paths outside the viewport boundary. This limits DOM updates to the active viewport, ensuring 60 FPS scaling regardless of diagram complexity.

### 3.2 Web Worker Offloaded Path Routing Engine
- **Proposal**: Decouple the orthogonal routing pathfinder from Vue's main UI thread.
- **Mechanism**: Move the path routing coordinates builder (`getOrthogonalPathPoints`) into a Web Worker. When a node is dragged, pass its coordinates to the worker thread, calculate the collision-free orthogonal path, and return the vertex array. This keeps the rendering thread focused on painting frames without getting blocked by pathfinding calculations.

### 3.3 Layout Engine Decoupling (Canvas vs DOM)
- **Proposal**: Transition the core graphics engine from heavy DOM layout templates to an optimized WebGL-based canvas engine (e.g., PixiJS or custom canvas rendering) for production scaling.
- **Benefits**: Eliminates browser layout thrashing, enables GPU-accelerated path drawing, and allows smooth rendering of thousands of connections.
