/**
 * @file InteractionState.js
 * @description Centralized interaction state definitions for the Umlify diagram editor.
 * Enforces canvas exclusivity, ensuring that only one primary interaction mode is active at any time.
 */

/**
 * @typedef {string} InteractionStateType
 */

/**
 * Frozen object mapping all legal editor interaction states.
 * @type {Readonly<Object<string, InteractionStateType>>}
 */
export const InteractionState = Object.freeze({
  /**
   * Default state. The canvas is passive, listening for clicks or hover states.
   * Mouse pointer shows default arrow.
   */
  IDLE: 'IDLE',

  /**
   * One or more UML element nodes are actively being translated across the canvas.
   * Triggers on mouse down on a selected element.
   */
  DRAGGING_ELEMENTS: 'DRAGGING_ELEMENTS',

  /**
   * A relational connector line is being drawn from an anchor handle towards a target.
   * Triggers on mouse down on an element's perimeter anchor port (Top, Right, Bottom, Left).
   */
  DRAWING_CONNECTION: 'DRAWING_CONNECTION',

  /**
   * A selected UML element's width and height dimensions are being adjusted.
   * Triggers on mouse down on a bounding box resize handle (corner or edge).
   */
  RESIZING_ELEMENT: 'RESIZING_ELEMENT',

  /**
   * The user is drawing a vector boundary marquee box on empty canvas space to select multiple nodes.
   * Triggers on click-and-drag on empty canvas space.
   */
  MARQUEE_SELECTING: 'MARQUEE_SELECTING',

  /**
   * The active viewport coordinate matrix is being panned.
   * Triggers when holding Spacebar while dragging, or dragging with the middle mouse button.
   */
  PANNING: 'PANNING',

  /**
   * The user is editing the label of a node or connection line via a focused text input or textarea.
   * Blocks global canvas-level hotkeys (like Delete/Undo) to prevent keyboard leakage.
   */
  EDITING_LABEL: 'EDITING_LABEL',

  /**
   * An overlay menu is active (e.g. connection style picker or connection delete context trigger).
   * Restricts click actions outside the menu boundaries until closed.
   */
  CONTEXT_MENU_OPEN: 'CONTEXT_MENU_OPEN',

  /**
   * The global command palette overlay (⌘K / Ctrl+K) is open and focused.
   * Suspends all underlying canvas cursor and layout interactions.
   */
  COMMAND_PALETTE_OPEN: 'COMMAND_PALETTE_OPEN'
});
