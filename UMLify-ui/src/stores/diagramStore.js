import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useDiagramStore = defineStore('diagram', () => {
  const elements = ref([]);
  const connections = ref([]);
  const selectedElements = ref([]);
  const selectedConnectionId = ref(null);
  const zoomLevel = ref(1);
  const connectMode = ref(false);
  
  const undoStack = ref([]);
  const redoStack = ref([]);

  const createSnapshot = () => {
    return JSON.parse(JSON.stringify({
      elements: elements.value,
      connections: connections.value.map(c => ({
        id: c.id,
        fromId: c.from?.id,
        toId: c.to?.id,
        fromSide: c.fromSide,
        toSide: c.toSide,
        type: c.type
      }))
    }));
  };

  const saveToHistory = () => {
    undoStack.value.push(createSnapshot());
    redoStack.value = [];
  };

  const undo = () => {
    if (undoStack.value.length === 0) return;
    redoStack.value.push(createSnapshot());
    const prev = undoStack.value.pop();
    restoreFromSnapshot(prev);
  };

  const redo = () => {
    if (redoStack.value.length === 0) return;
    undoStack.value.push(createSnapshot());
    const nextState = redoStack.value.pop();
    restoreFromSnapshot(nextState);
  };

  const restoreFromSnapshot = (snap) => {
    elements.value = JSON.parse(JSON.stringify(snap.elements));
    connections.value = snap.connections.map(cs => {
      const fromNode = elements.value.find(e => String(e.id) === String(cs.fromId));
      const toNode = elements.value.find(e => String(e.id) === String(cs.toId));
      return {
        id: cs.id,
        from: fromNode,
        to: toNode,
        fromSide: cs.fromSide,
        toSide: cs.toSide,
        type: cs.type || 'association'
      };
    });
    selectedElements.value = [];
    selectedConnectionId.value = null;
  };

  const addActor = () => {
    saveToHistory();
    elements.value.push({
      id: Date.now(),
      type: 'actor', // Case-matched to template
      label: 'Actor',
      x: 400, y: 100
    });
  };

  const addUseCase = () => {
    saveToHistory();
    elements.value.push({
      id: Date.now(),
      type: 'usecase', // Case-matched to template
      label: 'useCase',
      x: 500, y: 200
    });
  };

  const addSystem = () => {
    saveToHistory();
    elements.value.push({
      id: Date.now(),
      type: 'System', // Case-matched to template
      label: 'System',
      x: 500, y: 200
    });
  };

  const updatePositionWithGroup = (id, newX, newY) => {
    const idStr = String(id);
    const el = elements.value.find(e => String(e.id) === idStr);
    if (!el) return;
    
    const deltaX = newX - el.x;
    const deltaY = newY - el.y;
    
    if (selectedElements.value.includes(idStr) && selectedElements.value.length > 1) {
      selectedElements.value.forEach(selectedId => {
        const selectedEl = elements.value.find(e => String(e.id) === selectedId);
        if (selectedEl) {
          selectedEl.x += deltaX;
          selectedEl.y += deltaY;
        }
      });
    } else {
      el.x = newX;
      el.y = newY;
    }
  };

  const updateSize = (id, newWidth, newHeight) => {
    const el = elements.value.find(e => e.id === id);
    if (el) {
      el.width = newWidth;
      el.height = newHeight;
    }
  };

  const updateLabel = (id, newLabel) => {
    saveToHistory();
    const el = elements.value.find(e => e.id === id);
    if (el) {
      el.label = newLabel;
    }
  };

  const connectElements = (id1, id2, side1 = 'right', side2 = 'left', type = 'association') => {
    const from = elements.value.find(e => String(e.id) === String(id1));
    const to = elements.value.find(e => String(e.id) === String(id2));
    if (from && to) {
      connections.value.push({
        id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        from,
        to,
        fromSide: side1,
        toSide: side2,
        type
      });
      return true;
    }
    return false;
  };

  const deleteElement = (id) => {
    saveToHistory();
    const idStr = String(id);
    elements.value = elements.value.filter(e => String(e.id) !== idStr);
    connections.value = connections.value.filter(c => String(c.from?.id) !== idStr && String(c.to?.id) !== idStr);
    selectedElements.value = selectedElements.value.filter(e => e !== idStr);
  };

  const resetDiagram = () => {
    saveToHistory();
    elements.value = [];
    connections.value = [];
    selectedElements.value = [];
    selectedConnectionId.value = null;
  };

  return {
    elements,
    connections,
    selectedElements,
    selectedConnectionId,
    zoomLevel,
    connectMode,
    undoStack,
    redoStack,
    createSnapshot,
    saveToHistory,
    undo,
    redo,
    addActor,
    addUseCase,
    addSystem,
    updatePositionWithGroup,
    updateSize,
    updateLabel,
    connectElements,
    deleteElement,
    resetDiagram
  };
});