# UMLify

An autonomous, client-side architectural compilation engine and interactive UML diagram editor built with **Vue 3**, **Vite**, and **Pinia**. 

UMLify provides software architects and developers with a fluid, fluid-state canvas to design, simulate, and compile system architectures into compliant UML representations without sending private infrastructure data to external rendering backends.

---

## 🚀 Architectural Overview

UMLify is built around an action-driven unidirectional state machine, ensuring absolute predictability across rapid canvas manipulations and heavy asynchronous compilation pipelines.

```
┌────────────────────────────────────────────────────────┐
│                   Interaction Canvas                   │
└───────────┬────────────────────────────────▲───────────┘
            │ User Interaction               │ Action-Driven
            │ (Move, Resize, Connect, ⌘K)    │ State Update
            ▼                                │
┌────────────────────────────────────────────┴───────────┐
│              Pinia Central State Engine                │
│   ┌────────────────────┐   ┌───────────────────────┐   │
│   │   Canvas State     │   │   Compiler Context    │   │
│   └────────────────────┘   └───────────────────────┘   │
└───────────┬────────────────────────────────────────────┘
            │ 
            │ Autonomous Sync
            ▼
┌────────────────────────────────────────────────────────┐
│            Autonomous Multi-Provider Engine            │
│       ┌───────────────┬────────────────┬───────────┐   │
│       │  Gemini Core  │   Groq Ultra   │ OpenRouter│   │
│       └───────────────┴────────────────┴───────────┘   │
└────────────────────────────────────────────────────────┘
```

### Key Modules
*   **The Interaction Engine (FSM):** A client-side Finite State Machine controlling selections, multi-node dragging, precise handle resizing, and link management.
*   **State Isolation Layer:** Powered by Pinia. Components are strictly decoupled from raw data modification—all canvas tracking, position offsets, and zoom values flow exclusively through atomic actions.
*   **Autonomous Compilation Engine:** Handles local compilation and interfaces cleanly with distributed client-side AI providers (`Gemini`, `Groq`, `OpenRouter`) via optimized multi-provider routing.

---

## ✨ Features & Capabilities

*   **Action-Driven Canvas Manipulation:** Fluid node placement, edge connection routing, and granular multi-axis resizing bound cleanly to centralized state actions.
*   **Integrated MiniMap:** A real-time, low-overhead visual layout overview for seamless large-scale architectural tracing.
*   **Command Palette (`⌘K` / `Ctrl+K`):** Quick actions and rapid node spawning triggered instantly via a focused global interaction module.
*   **Intelligent Layout Cycling:** Keyboard accessibility powered by strict canvas focus guards (`Tab` / `Shift+Tab`) that navigate nodes cleanly without hijacking code inputs or text areas.
*   **Rigid Design Token System:** Uniform styling across sidebars, utility drawers, canvas controllers, and delete clouds, keeping the theme predictable and extendable.
*   **Multi-Provider AI Routing:** Local client-side intelligence backing system compilation and error checking with native support for multiple inference streams.

---

## 🛠️ Technology Stack

*   **Core Framework:** Vue 3 (Composition API, `<script setup>`)
*   **State Management:** Pinia (Strict unidirectional action-driven architecture)
*   **Build Tooling:** Vite + ESBuild
*   **Styling Engine:** Tailwind CSS (Strictly tokenized utilities)
*   **Interaction Processing:** Custom Native Canvas Mouse/Keyboard FSM

---

## 📂 Project Structure

```text
src/
├── assets/           # Global styles and static design assets
├── components/       # Atomic canvas and utility elements
│   ├── canvas/       # Node layouts, resize handles, link vectors
│   ├── MiniMap.vue   # Real-time overhead spatial canvas tracking
│   ├── CommandPalette.vue # Global ⌘K / Ctrl+K quick action handler
│   └── ExportPanel.vue # Planned export & integrations extension hook
├── store/            # Centralized Pinia architecture engines
│   ├── index.js      # Consolidated state, action dispatchers, and workflows
└── core/             # Client-side multi-provider compilation logic
```

---

## ⚡ Getting Started

### Prerequisites

*   **Node.js** (v18.0.0 or higher recommended)
*   **Package Manager:** `npm` or `pnpm`
*   **Environment:** WAMP or native Windows local execution setups (fully compatible with PowerShell terminal tools)

### Installation

1. Clone the repository and enter the workspace directory:
   ```powershell
   git clone https://github.com/your-organization/umlify.git
   cd umlify
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Launch the local development server:
   ```powershell
   npm run dev
   ```

4. Build production distribution artifacts:
   ```powershell
   npm run build
   ```

---

## 📋 Release Tracking & Development Pipeline

### Current Specification: `v0.2.0-alpha`
*   **Status:** Stable Development Build
*   **Tree State:** Clean, verified baseline (`Commit: d7ae291`)
*   **System Integrity:** Standardized on strict action dispatching. Components no longer commit raw side-effect state writes directly.
*   **Legacy Pruning:** Orphaned utility prototypes (`AnimatedBackground.vue`, `DotField.vue`) have been fully retired to reduce codebase surface area and maintain target bundle efficiency.
