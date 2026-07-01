# Umlify Interaction Specifications
*Behavioral States, Input Pipelines, and UX Micro-Interaction Flows*

---

## 1. Node Selection & Dragging Sequence

This flow manages how users select, highlight, move, and snap UML nodes on the canvas.

```
[Idle Node]
   │
   ▼ (User Mouse Hover)
[Anchor Nodes Appear + Pointer Cursor]
   │
   ▼ (Mouse Down)
[Selection Outline Activated (Blue 1.5px border)]
   │
   ▼ (Drag Initiative)
[Drag Preview: Translucent Node Outline + Coordinates Shown]
   │
   ▼ (Node Center approaches Grid Interval < 10px)
[Grid Snap Indicator Lines Displayed]
   │
   ▼ (Mouse Release)
[Drop Completed + Snap to Coordinates + Coordinates Saved]
   │
   ▼ (Trigger Layout Compiler)
[Success Animation: Brief subtle green glow outline fades in 200ms]
```

---

## 2. Connector & Relationship Creation

This flow handles linking two distinct UML nodes together.

```
[Hover Node Anchor Point (6px circle)]
   │
   ▼ (Mouse Down + Drag outward)
[Draw Preview: Dotted relation line tracking cursor position]
   │
   ▼ (Cursor enters target Node collision radius)
[Connection Snap Target Highlights (Success Green ring)]
   │
   ▼ (Mouse Release on Valid Target)
[Open Relationship Selection Menu (z-dropdown overlay)]
   │
   ▼ (Keyboard Arrow Navigate / Click option)
[Generate Semantic UML Line (Solid/Dashed + Terminal arrow)]
   │
   ▼ (Trigger Canvas Layout Reflow)
[Completed: Line state saved and compiled]
```

---

## 3. Command Palette Omnibar Navigation

This sequence maps the global command overlay triggered by keyboard shortcut commands.

```
[Key Trigger: ⌘K or Ctrl+K]
   │
   ▼ (Overlay Fade In - 150ms ease-out)
[Auto-Focus Input Field (Text cursor active)]
   │
   ▼ (User Types Search Query)
[Debounced Filter (50ms): List updates matching search options]
   │
   ▼ (Arrow Keys: Up / Down navigation)
[Highlight Active Item: color-bg-elevated background update]
   │
   ▼ (Key Press: Enter)
[Select Item -> Trigger Action (e.g., "Insert Class Node")]
   │
   ▼ (Omnibar Closes - 150ms fade-out)
[Action Executed on Canvas]
```

---

## 4. Live Syntax Editor Compilation Feedback Loop

This specifies how text syntax changes convert to diagrams and report errors.

```
[User Text Input in SyntaxEditor]
   │
   ▼ (Debounce Timer: 300ms inactivity pause)
[Initiate Parser: Check UML syntax standards]
   │
   ├── If Compilation Fails ──► [Draw squiggles on error lines]
   │                            [Status Bar displays red error warning]
   │                            [Canvas retains last valid rendering]
   │
   └── If Compilation Succeeds ─► [Clear previous errors]
                                 [Canvas diagram fades & scales to match new syntax]
                                 [Status Bar updates: Green "Saved" cloud status]
```

---

## 5. Zoom & Pan Navigation Controls

Navigating a large diagram requires smooth, non-intrusive viewport transforms.

### Viewport Panning (Canvas Movement)
*   **Trigger 1:** Hold Spacebar + Mouse Drag.
*   **Trigger 2:** Click Middle Mouse Scroll Wheel + Mouse Drag.
*   **Visual Sequence:**
    1.  Cursor changes from `default` to `grab` on trigger keypress.
    2.  On mouse down, cursor swaps to `grabbing`.
    3.  As the mouse moves, the SVG coordinate plane `viewBox` coordinates offset at a 1:1 pixel scale with cursor delta values.
    4.  On release, cursor reverts to `grab` or `default`.

### Viewport Zooming
*   **Trigger:** Hold `Ctrl` (or `⌘`) + Mouse Scroll Wheel.
*   **Visual Sequence:**
    1.  Determine screen cursor coordinates (focal point).
    2.  Scale canvas layout matrix centered on that focal point.
    3.  Enforce Zoom Tokens boundary check (clamp scale between `0.1` and `4.0`).
    4.  Update bottom status bar zoom percentage indicator (e.g., `120%`).
