# The Legend of the UML Canvas Kingdom: How the Interaction Engine Works

Once upon a time, inside a browser tab far, far away, there was a bustling kingdom called **The UML Canvas**. 

In this kingdom lived several families of UI elements:
*   **The Nodes (Actors & Use Cases)**: They loved to slide around (Dragging).
*   **The Resize Handles**: They lived on the edges of the Nodes and loved to stretch them (Resizing).
*   **The Anchor Ports**: Tiny circles on the perimeter who loved to build bridges to other nodes (Connection Drawing).
*   **The Marquee Selection Box**: A ghost-like rectangle that appeared on empty land to gather nodes together (Selecting).

For a long time, there was no centralized ruler. Every family did whatever they wanted, whenever they wanted. This led to **The Great Input Wars**...

---

## The Great Input Wars (The Problem)

Imagine a user named Adem clicks on an **Anchor Port** to draw a connection line to another Node. 

1.  **The Anchor** catches the mouse click: *"Aha! Adem wants to draw a connection! Set `activeDraggingLink = true`!"*
2.  But wait! The Anchor lives *inside* a **Node**. The Node also catches the mouse click: *"Wait, Adem clicked on me! He wants to move me! Set `isDraggingElements = true`!"*
3.  As Adem moves his mouse, both event handlers fight:
    *   The connection preview line stretches out.
    *   BUT the entire Node also slides across the canvas!
    *   *Chaos! The editor state becomes blurry and erratic.*

This happened because the components only managed their own local boolean variables (`isSelecting`, `isDraggingElements`, `dragging`) and had no idea what the other components were doing.

---

## Enter: The Grand Coordinator (The Interaction Engine)

To restore peace, the developers created **The Interaction Engine**—a Finite State Machine (FSM). 

The engine established one simple, golden law in the kingdom:
> **"Only ONE interaction state may be active at any given second."**

If you want to do something, you must ask the **Grand Coordinator** to change the state. If the coordinator is busy in another state, it will block conflicting actions.

```
                              ┌───────────────┐
                              │     IDLE      │
                              └───────────────┘
                                ▲           │
                Finish Dragging │           │ Begin Dragging
                                │           ▼
                      ┌──────────────────────────────┐
                      │      DRAGGING_ELEMENTS       │
                      └──────────────────────────────┘
```

---

## Concrete Example 1: Adem Drags an Element

Let's see how this works step-by-step when Adem drags an Actor node.

### 1. The Trigger (Mouse Down)
When Adem presses the mouse button on the Actor card:
*   The Canvas captures the click.
*   Instead of just setting a local boolean, it calls `transitionTo()` on the engine.

```javascript
// Inside Canvas.vue -> initiateElementsDrag
interaction.transitionTo(InteractionState.DRAGGING_ELEMENTS, {
  ids: ['actor-1'],
  origin: { x: event.clientX, y: event.clientY },
  current: { x: event.clientX, y: event.clientY }
});
```

### 2. The Engine's Gatekeeping
The Interaction Engine receives the request. It checks:
*   *"Are we currently doing something else, like drawing a connection? No? Okay, transition allowed!"*
*   It sets `state` to `DRAGGING_ELEMENTS` and stores the metadata payload (the node ID and mouse start positions).
*   It executes the **Entry Hook** for `DRAGGING_ELEMENTS` (which changes the cursor style of the entire browser body to `grabbing` so Adem gets instant visual feedback).

### 3. The Mouse Move
As Adem drags the mouse, the canvas moves the element. Because the state is locked to `DRAGGING_ELEMENTS`, any mouse actions trying to start a marquee selection are rejected.

### 4. The Release (Mouse Up)
When Adem lets go of the mouse button:
*   The Canvas notifies the engine:

```javascript
// Inside Canvas.vue -> handleElementDragMouseUp
interaction.transitionTo(InteractionState.IDLE);
```
*   The Engine enters the `IDLE` state.
*   It executes the **Exit Hook** for `DRAGGING_ELEMENTS` (which automatically reverts the cursor back to the default arrow).
*   Peace is restored, and the canvas waits for the next action.

---

## Concrete Example 2: Adem Types in a Label (Preventing Key Leaks)

A common bug in diagram editors is that if you press `Delete` while typing inside a text box, the editor deletes the node instead of deleting the character! 

Here is how the engine solves it:

### 1. Label Edit Begins
When Adem double-clicks a label to edit it:
*   The Node transitions the engine to `EDITING_LABEL`:
```javascript
interaction.transitionTo(InteractionState.EDITING_LABEL, {
  nodeId: 'actor-1',
  field: 'label'
});
```
*   **The Entry Hook** for `EDITING_LABEL` executes. It temporarily pauses the global keyboard manager.

### 2. Pressing Keys
Adem presses `Backspace` or `Delete`.
*   The global canvas keyboard listener receives the key press.
*   It asks the engine: *"Hey engine, what are we doing right now?"*
*   The engine replies: *"We are currently in `EDITING_LABEL` state!"*
*   The keyboard listener says: *"Ah! Then I will ignore this key press so Adem can type his text in peace."*

### 3. Focus Blurs
When Adem clicks outside the text box:
*   The input is blurred, and the engine resets:
```javascript
interaction.transitionTo(InteractionState.IDLE);
```
*   **The Exit Hook** runs, re-enabling the global keyboard manager. The canvas hotkeys work again!

---

## Why Is This Composable a "Singleton"?

In Vue 3, when you import a custom composable hook like `useInteractionEngine()`, you normally get a fresh copy of the variables. But we need a *single authority*—everyone must see the **exact same** active state.

To achieve this, the engine declares its reactive states *outside* the exported function:

```javascript
import { ref, readonly } from 'vue';

// 🔒 Shared globally in the file memory space.
// There is only ONE copy of these variables, no matter how many times useInteractionEngine is called.
const currentState = ref('IDLE');
const previousState = ref(null);
const activePayload = ref(null);

export function useInteractionEngine() {
  // Composable methods access the shared refs above...
  return {
    state: readonly(currentState),
    transitionTo
  };
}
```

Now, whether you are in `Canvas.vue`, `Actor.vue`, `Navbar.vue`, or the `KeyboardManager`, calling `useInteractionEngine()` connects you to the same central commander.
