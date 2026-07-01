# Umlify Editor & Product Design System
*UML Editor Behavior, Canvas Rules, and Layout Components*

---

## 1. UML Node Visual Design Rules

UML nodes model structure and behavior. They must be mathematically precise and immediately recognizable.

```
┌──────────────────────────────────────┐
│  «Interface»                         │  <- Stereotype (Monospace, Muted)
│  InvoiceManager                      │  <- Entity Name (Sans-Serif, Bold)
├──────────────────────────────────────┤
│  - invoices: List<Invoice>           │  <- Attributes Compartment
├──────────────────────────────────────┤
│  + processPayment(id: String): Bool  │  <- Operations Compartment
└──────────────────────────────────────┘
```

### Visual Specifications
*   **Structure:** Rectangular boxes with `4px` corner radii.
*   **Borders:** `1px solid color-border-default` (`rgba(255,255,255,0.08)` in dark mode). Swaps to `1px solid color-interactive-accent` (`#3B82F6`) when selected.
*   **Dividers:** `1px solid rgba(255,255,255,0.08)` separating the three compartment blocks.
*   **Text Formatting:**
    *   *Stereotypes (`«interface»`):* Monospace, `11px`, center-aligned.
    *   *Class Names:* Sans-Serif, `13px`, bold (`600` weight), center-aligned.
    *   *Attributes & Operations:* Monospace, `12px`, left-aligned, standard `8px` padding.
*   **Visibility Colors:**
    *   `+` (Public): Emerald Green (`#10B981`)
    *   `-` (Private): Muted Gray (`#71717A`)
    *   `#` (Protected): Amber Gold (`#F59E0B`)
    *   `~` (Package): Blue (`#3B82F6`)

---

## 2. Connector & Relationship Styles

Connector lines link UML entities. They must follow official specifications with custom aesthetic sizing.

### Relationship Configurations

| Relation Name | Line Style | Terminal Arrowhead Type | UML Semantic Meaning |
| :--- | :--- | :--- | :--- |
| **Association** | Solid | Standard open arrowhead (`>`) | Structural relationship |
| **Generalization**| Solid | Hollow closed triangle (`▷`) | Inheritance / Sub-classing |
| **Realization** | Dashed | Hollow closed triangle (`▷`) | Interface implementation |
| **Aggregation** | Solid | Hollow closed diamond (`◇`) | Whole-part relationship |
| **Composition** | Solid | Filled closed diamond (`◆`) | Strong ownership dependency |
| **Dependency** | Dashed | Standard open arrowhead (`>`) | Reference dependency |

### Stroke Configurations
*   **Stroke Width:** `1.5px` (Standard line), `2.5px` (Active selection state).
*   **Dashed style:** `stroke-dasharray: 6, 4`.
*   **Routing System:** Connectors default to **orthogonal routing** (aligned to 90-degree bend axes). Straight routing is user-configurable.

---

## 3. Canvas Workspace Specifications

The canvas is the core interactive area where diagrams are drawn and rendered.

### Zoom & Pan Settings
*   **Zoom limits:** Scale scales between `0.1` (`10%`) and `4.0` (`400%`). Default initialization is `1.0` (`100%`).
*   **Grid layout:** SVG-rendered grid dot patterns at `20px` intervals.
*   **Snapping Behavior:** Relocated elements align boundaries to the nearest `20px` coordinate point on mouse-up / drag-release.

---

## 4. Component Inventory: Abstraction Layer 3 & 4

These high-level modules assemble the marketing landing page and the functional application workspace.

### Editor Components
1.  **Canvas:** The infinite diagram coordinate workspace. Renders the SVG/HTML5 grid, nodes, and lines.
2.  **Node:** The individual visual UML node container. Includes title compartments and property visibility logic.
3.  **Connector:** Dynamic line renderer connecting two node coordinates. Auto-calculates start/end path angles.
4.  **Inspector:** Right-side sidebar panel (`320px` width) displaying edit forms for the selected node or connector.
5.  **MiniMap:** Small thumbnail view in the bottom-right corner showing a scaled overview of the full canvas coordinate space.
6.  **PropertyPanel:** Property sheets inside the Inspector managing visibility, names, class methods, and attributes.
7.  **SyntaxEditor:** Code editing layout panel supporting syntax highlighting, line indicators, and live compiler bindings.
8.  **CommandPalette:** Floating modal (`⌘K`) providing quick actions, node insertions, and search tools.
9.  **StatusBar:** Bottom technical ribbon (`28px` height) reporting cursor positions, zoom scales, and compiler issues.

### Landing Components
1.  **Hero:** Top layout container hosting the value proposition heading, primary CTA triggers, and the initial editor mockup.
2.  **FeatureGrid:** Modular layout blocks highlighting core app features with high-fidelity screenshots.
3.  **MetricCard:** Single statistic callouts displaying app speed and layout rendering specs.
4.  **CTA Panel:** Final conversion panel at the bottom of the page, prompting immediate editor access.
5.  **LogoCloud:** Muted, monochrome logotypes of companies or integrations supported by Umlify.
6.  **Testimonials:** Clean quote cards showing real feedback from verified software engineers.
7.  **Footer:** Low-contrast bottom links containing sitemaps, copyright, and developer social links.
