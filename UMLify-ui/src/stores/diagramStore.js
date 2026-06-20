import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useDiagramStore = defineStore('diagram', () => {
  // Centralised Core Reactive Canvas States
  const elements = ref([]);
  const connections = ref([]);
  const selectedElements = ref([]);
  const selectedConnectionId = ref(null);
  const zoomLevel = ref(1);
  const isDirty = ref(false);

  // Asynchronous Cloud Persistence States
  const currentDiagramId = ref(null);
  const currentDiagramTitle = ref('Untitled Diagram');
  const savedDiagramsList = ref([]);
  const networkErrorMessage = ref(null);
  const globalSaveStatusMessage = ref('');

  // Global Modal Configuration
  const globalModalConfig = ref({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null
  });

  const openGlobalConfirmation = (config) => {
    globalModalConfig.value = {
      isOpen: true,
      title: config.title || 'Confirmation',
      message: config.message || 'Are you sure?',
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: config.onConfirm || null
    };
  };

  const closeGlobalModal = () => {
    globalModalConfig.value.isOpen = false;
    globalModalConfig.value.onConfirm = null;
  };

  // Undo/Redo Historical Engine Stacks
  const undoStack = ref([]);
  const redoStack = ref([]);

  // Snapshot Memento Helpers
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
    isDirty.value = true;
    undoStack.value.push(createSnapshot());
    redoStack.value = [];
  };

  const undo = () => {
    if (undoStack.value.length === 0) return;
    isDirty.value = true;
    redoStack.value.push(createSnapshot());
    const prev = undoStack.value.pop();
    restoreFromSnapshot(prev);
  };

  const redo = () => {
    if (redoStack.value.length === 0) return;
    isDirty.value = true;
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

  const resetDiagram = () => {
    elements.value = [];
    connections.value = [];
    selectedElements.value = [];
    selectedConnectionId.value = null;
    currentDiagramId.value = null;
    currentDiagramTitle.value = 'Untitled Diagram';
    globalSaveStatusMessage.value = '';
    networkErrorMessage.value = null;
    isDirty.value = false;
  };

  // Helper config to fetch auth headers reactively from authStore
  const getAuthHeaders = () => {
    const authStore = useAuthStore();
    return {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    };
  };

  // ==========================================
  // 🌐 ASYNCHRONOUS CLOUD AXIOS ACTIONS
  // ==========================================
  
  const fetchUserDiagrams = async () => {
    networkErrorMessage.value = null;
    try {
      const response = await axios.get('http://localhost:5000/api/diagrams', getAuthHeaders());
      savedDiagramsList.value = response.data || [];
    } catch (err) {
      networkErrorMessage.value = err.response?.data?.message || 'Failed to list saved diagrams from cloud repo.';
    }
  };

  const saveCurrentDiagram = async (title) => {
    networkErrorMessage.value = null;
    globalSaveStatusMessage.value = 'Saving...';
    
    if (title && title.trim()) {
      currentDiagramTitle.value = title.trim();
    }

    const payloadBundle = {
      diagramId: currentDiagramId.value,
      title: currentDiagramTitle.value,
      payload: {
        elements: elements.value,
        connections: connections.value.map(c => ({
          id: c.id,
          fromId: c.from?.id,
          toId: c.to?.id,
          fromSide: c.fromSide,
          toSide: c.toSide,
          type: c.type
        })),
        zoomLevel: zoomLevel.value
      }
    };

    try {
      const response = await axios.post('http://localhost:5000/api/diagrams/save', payloadBundle, getAuthHeaders());
      if (response.data && response.data.diagramId) {
        currentDiagramId.value = response.data.diagramId;
        globalSaveStatusMessage.value = 'Saved Successfully!';
        isDirty.value = false;
        await fetchUserDiagrams(); // Refresh metadata dashboard drawer
        setTimeout(() => { globalSaveStatusMessage.value = '' }, 3000);
        return true;
      }
    } catch (err) {
      globalSaveStatusMessage.value = '';
      networkErrorMessage.value = err.response?.data?.message || 'Cloud backup transmission failure.';
    }
    return false;
  };

  const loadDiagramById = async (id) => {
    networkErrorMessage.value = null;
    try {
      const response = await axios.get(`http://localhost:5000/api/diagrams/${id}`, getAuthHeaders());
      const record = response.data;
      if (record && record.payload) {
        // Clear viewport active state properties
        elements.value = JSON.parse(JSON.stringify(record.payload.elements || []));
        zoomLevel.value = Number(record.payload.zoomLevel) || 1;
        currentDiagramId.value = record.id;
        currentDiagramTitle.value = record.title || 'Untitled Diagram';
        
        // Re-construct line relational pointers to matched element items
        connections.value = (record.payload.connections || []).map(cs => {
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
        }).filter(c => c.from && c.to);

        selectedElements.value = [];
        selectedConnectionId.value = null;
        undoStack.value = [];
        redoStack.value = [];
        isDirty.value = false;
        return true;
      }
    } catch (err) {
      networkErrorMessage.value = err.response?.data?.message || 'Failed to acquire target payload data.';
    }
    return false;
  };

  const deleteDiagram = async (id) => {
    networkErrorMessage.value = null;
    try {
      const response = await axios.delete(`http://localhost:5000/api/diagrams/${id}`, getAuthHeaders());
      if (response.status === 200 || response.status === 204) {
        savedDiagramsList.value = savedDiagramsList.value.filter(d => d.id !== id);
        if (currentDiagramId.value === id) {
          resetDiagram();
        }
        return true;
      }
    } catch (err) {
      networkErrorMessage.value = err.response?.data?.message || 'Failed to delete target diagram.';
      return false;
    }
  };

  // Canvas local layout factories
  const addActor = () => {
    saveToHistory();
    elements.value.push({ id: `act_${Date.now()}`, type: 'actor', label: 'Actor', x: 200, y: 150 });
  };

  const addUseCase = () => {
    saveToHistory();
    elements.value.push({ id: `uc_${Date.now()}`, type: 'usecase', label: 'UseCase', x: 350, y: 200 });
  };

  const addSystem = () => {
    saveToHistory();
    elements.value.push({ id: `sys_${Date.now()}`, type: 'System', label: 'System', x: 300, y: 100, width: 300, height: 400 });
  };

  const addPackage = () => {
    saveToHistory();
    elements.value.push({ id: `pkg_${Date.now()}`, type: 'package', label: 'Package', x: 200, y: 150, width: 200, height: 150 });
  };

  const addNote = () => {
    saveToHistory();
    elements.value.push({ id: `note_${Date.now()}`, type: 'note', label: 'Note', x: 200, y: 150, width: 120, height: 120 });
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
    isDirty.value = true;
  };

  const updateSize = (id, newWidth, newHeight) => {
    const el = elements.value.find(e => e.id === id);
    if (el) { el.width = newWidth; el.height = newHeight; isDirty.value = true; }
  };

  const updateLabel = (id, newLabel) => {
    saveToHistory();
    const el = elements.value.find(e => e.id === id);
    if (el) { el.label = newLabel; }
  };

  const connectElements = (id1, id2, side1 = 'right', side2 = 'left', type = 'association') => {
    const from = elements.value.find(e => String(e.id) === String(id1));
    const to = elements.value.find(e => String(e.id) === String(id2));
    if (from && to) {
      connections.value.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        from, to, fromSide: side1, toSide: side2, type
      });
      isDirty.value = true;
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
    isDirty.value = true;
  };

  return {
    elements,
    connections,
    selectedElements,
    selectedConnectionId,
    zoomLevel,
    isDirty,
    currentDiagramId,
    currentDiagramTitle,
    savedDiagramsList,
    networkErrorMessage,
    globalSaveStatusMessage,
    globalModalConfig,
    openGlobalConfirmation,
    closeGlobalModal,
    undoStack,
    redoStack,
    undo,
    redo,
    resetDiagram,
    fetchUserDiagrams,
    saveCurrentDiagram,
    loadDiagramById,
    deleteDiagram,
    saveToHistory,
    addActor,
    addUseCase,
    addSystem,
    addPackage,
    addNote,
    updatePositionWithGroup,
    updateSize,
    updateLabel,
    connectElements,
    deleteElement
  };
});