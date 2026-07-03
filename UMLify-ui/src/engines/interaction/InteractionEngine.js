/**
 * @file InteractionEngine.js
 * @description Centralized state transition manager (Finite State Machine) for Umlify editor interactions.
 * Implemented as a singleton Vue composable to share a single source of truth across all components.
 */

import { ref, readonly } from 'vue';
import { InteractionState } from './InteractionState';

// ==========================================
// 🔒 SINGLETON MODULE-LEVEL REACTIVE STATE
// ==========================================
/** @type {import('vue').Ref<string>} */
const currentState = ref(InteractionState.IDLE);

/** @type {import('vue').Ref<string|null>} */
const previousState = ref(null);

/** @type {import('vue').Ref<any>} */
const activePayload = ref(null);

// ==========================================
// 🛠️ STATE TRANSITION HOOKS (PLACEHOLDERS)
// ==========================================

/**
 * Hook executed immediately before transitioning out of a state.
 * @param {string} state - The state being exited.
 */
function onExit(state) {
  switch (state) {
    case InteractionState.DRAGGING_ELEMENTS:
    case InteractionState.PANNING:
    case InteractionState.RESIZING_ELEMENT:
      // Revert body cursor to default when exit action triggers
      if (typeof document !== 'undefined') {
        document.body.style.cursor = '';
      }
      break;
    case InteractionState.EDITING_LABEL:
      // Future hooks: resume global keyboard manager listeners
      break;
    case InteractionState.CONTEXT_MENU_OPEN:
      // Future hooks: close contextual menus
      break;
    case InteractionState.COMMAND_PALETTE_OPEN:
      // Future hooks: resume background input captures
      break;
    default:
      break;
  }
}

/**
 * Hook executed immediately after transitioning into a state.
 * @param {string} state - The new state being entered.
 * @param {any} payload - The metadata associated with the new state.
 */
function onEnter(state, payload) {
  switch (state) {
    case InteractionState.DRAGGING_ELEMENTS:
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'grabbing';
      }
      break;
    case InteractionState.PANNING:
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'grab';
      }
      break;
    case InteractionState.RESIZING_ELEMENT:
      // Set cursor dynamically based on payload axis if provided
      if (typeof document !== 'undefined') {
        document.body.style.cursor = payload?.cursor || 'nwse-resize';
      }
      break;
    case InteractionState.EDITING_LABEL:
      // Future hooks: suspend global keyboard shortcuts
      break;
    case InteractionState.CONTEXT_MENU_OPEN:
      // Future hooks: render connection editor panel
      break;
    case InteractionState.COMMAND_PALETTE_OPEN:
      // Future hooks: freeze underlying canvas viewport
      break;
    default:
      break;
  }
}

// ==========================================
// 🚀 PUBLIC COMPOSABLE INTERFACE
// ==========================================

/**
 * Composable providing access to the centralized Umlify Interaction Engine.
 * Shared state refs ensure a single source of truth across the application.
 */
export function useInteractionEngine() {

  /**
   * Helper to verify if the active state matches a specific query state.
   * @param {string} checkState - The state value to check.
   * @returns {boolean} True if the current state matches.
   */
  const is = (checkState) => {
    return currentState.value === checkState;
  };

  /**
   * Evaluates if a transition to a target state is permitted.
   * Enables adding future transition filters or verification guards.
   * @param {string} targetState - The destination state.
   * @returns {boolean} True if the transition is allowed.
   */
  const canTransition = (targetState) => {
    // Prevent transition if the target state value is not recognized
    if (!Object.values(InteractionState).includes(targetState)) {
      return false;
    }
    // Prevent self-transition
    if (currentState.value === targetState) {
      return false;
    }
    // Add additional transition guard rules here if needed
    return true;
  };

  /**
   * Executes a state transition, triggering entry/exit hooks and updating metadata.
   * @param {string} newState - The destination state value.
   * @param {any} [payload=null] - Optional metadata payload associated with the state.
   * @returns {boolean} True if the transition succeeded.
   */
  const transitionTo = (newState, payload = null) => {
    if (!canTransition(newState)) {
      return false;
    }

    // Trigger exit hook for current state
    onExit(currentState.value);

    // Swap states
    previousState.value = currentState.value;
    currentState.value = newState;
    activePayload.value = payload;

    // Trigger entry hook for new state
    onEnter(newState, payload);

    return true;
  };

  /**
   * Reverts the Interaction Engine back to IDLE state, clearing metadata.
   */
  const reset = () => {
    transitionTo(InteractionState.IDLE, null);
  };

  return {
    // State indicators (exposed as read-only to prevent direct mutation outside transitionTo)
    state: readonly(currentState),
    previousState: readonly(previousState),
    payload: readonly(activePayload),

    // State actions
    transitionTo,
    reset,

    // Query helpers
    is,
    canTransition
  };
}
