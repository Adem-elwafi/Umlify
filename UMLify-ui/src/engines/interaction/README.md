# Interaction Engine

A centralized, Finite State Machine (FSM) driven manager that governs all interaction states for the Umlify diagram editor. This engine acts as the single source of truth for the active interaction mode, replacing scattered boolean flags and preventing event race conditions.

---

## 1. Why the Interaction Engine Exists

In a complex graphical editor like Umlify, multiple systems (selection boxes, connection anchors, coordinate dragging, resizing handles, panning, keyboard shortcuts, overlays, command palettes) compete for user mouse and keyboard inputs.

Without a central coordinator, event handlers collide:
*   **Conflict A**: Grabbing a resize handle might accidentally initiate marquee selection on the canvas underneath.
*   **Conflict B**: Pressing keyboard keys (like `Delete`) while editing a label input could delete the active diagram node.
*   **Conflict C**: Dragging a node near a connection anchor might trigger dynamic connector routing previews.

The **Interaction Engine** solves these problems by enforcing **state exclusivity**: only one interaction state is active at any time.

---

## 2. Core API Usage

Import the engine directly inside any Vue component:

```javascript
import { useInteractionEngine, InteractionState } from '@/engines/interaction';

const interaction = useInteractionEngine();

// 1. Query states
if (interaction.is(InteractionState.IDLE)) {
  console.log('Editor is waiting for user interaction');
}

// 2. Perform state transitions
const startDragging = (selectedNodeIds, event) => {
  const payload = {
    ids: selectedNodeIds,
    origin: { x: event.clientX, y: event.clientY }
  };
  
  // Transition validation is handled internally by the engine
  interaction.transitionTo(InteractionState.DRAGGING_ELEMENTS, payload);
};

// 3. Revert to Idle
const stopDragging = () => {
  interaction.reset();
};
```

---

## 3. Metadata Payloads Schema

Every interaction state can register its own metadata payload. The engine stores these payloads without modifying them, allowing subsequent subsystems to read active transition coordinates:

#### `DRAGGING_ELEMENTS`
```json
{
  "ids": ["act_17200234"],
  "origin": { "x": 240, "y": 150 },
  "current": { "x": 260, "y": 180 }
}
```

#### `DRAWING_CONNECTION`
```json
{
  "sourceId": "act_17200234",
  "anchor": "right",
  "mouse": { "x": 380, "y": 210 }
}
```

#### `MARQUEE_SELECTING`
```json
{
  "start": { "x": 100, "y": 100 },
  "current": { "x": 350, "y": 420 }
}
```

#### `RESIZING_ELEMENT`
```json
{
  "id": "act_17200234",
  "cursor": "nwse-resize",
  "initialWidth": 140,
  "initialHeight": 80
}
```

---

## 4. Progressive Integration Strategy

We follow a two-step integration model to protect the current layout logic:

1.  **Parallel Mapping (Architecture Validation)**: We deploy the Interaction Engine foundation files alongside the existing editor without refactoring the components. This verifies Vue imports, reactivity, and packaging.
2.  **State Consolidation**: In subsequent phases, we progressively strip legacy local boolean flags (`isSelecting`, `isDraggingElements`, `resizing`, `dragging` refs) and bind pointer coordinates and triggers directly to the `InteractionEngine` singleton.
