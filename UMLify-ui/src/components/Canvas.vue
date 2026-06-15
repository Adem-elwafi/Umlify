<template>
  <div 
    id="uml-canvas" 
    class="canvas-container" 
    :class="{'pencil-cursor': connectMode}"
    @dragover.prevent="handleDragOver"
    @drop="handleDrop"
  >
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn" title="Zoom In"><span>+</span></button>
      <span class="zoom-level font-mono">{{ Math.round(zoomLevel * 100) }}%</span>
      <button @click="zoomOut" class="zoom-btn" title="Zoom Out"><span>−</span></button>
      <button @click="resetZoom" class="zoom-btn reset-btn" title="Reset Zoom"><span>⟲</span></button>
    </div>
    
    <div 
      class="drawing-area" 
      @click.self="clearSelectedConnection" 
      @mousedown="handleCanvasMouseDown"
    >
      <div 
        v-if="isSelecting"
        class="selection-box"
        :style="{
          left: Math.min(selectionBox.startX, selectionBox.currentX) + 'px',
          top: Math.min(selectionBox.startY, selectionBox.currentY) + 'px',
          width: Math.abs(selectionBox.currentX - selectionBox.startX) + 'px',
          height: Math.abs(selectionBox.currentY - selectionBox.startY) + 'px'
        }"
      />

      <div 
        class="elements-container" 
        :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }"
      >
        <div 
          v-for="element in elements" 
          :key="element.id" 
          :data-element-id="element.id"
          class="absolute element-draggable-wrapper"
          :style="getElementStyle(element)"
          @mousedown.stop="initiateElementDrag($event, element)"
        >
          <System
            v-if="element.type === 'System'"
            :label="element.label"
            :x="0"
            :y="0"
            :width="element.width || 300"
            :height="element.height || 400"
            :onDrag="null"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click.stop="selectElement(element.id)"
            @delete="deleteElement(element.id)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
          />
          <Actor
            v-if="element.type === 'actor'"
            :label="element.label"
            :x="0"
            :y="0"
            :width="element.width || 80"
            :height="element.height || 120"
            :onDrag="null"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click.stop="selectElement(element.id)"
            @connection-point-click="(side) => handleConnectionPointClick(element.id, side)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            :class="{'pencil-cursor': connectMode}"
            @delete="deleteElement(element.id)"
          />
          <UseCase 
            v-else-if="element.type === 'usecase'"
            :label="element.label"
            :x="0"
            :y="0"
            :width="element.width || 140"
            :height="element.height || 80"
            :onDrag="null"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click.stop="selectElement(element.id)"
            @connection-point-click="(side) => handleConnectionPointClick(element.id, side)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            @delete="deleteElement(element.id)"
          />
        </div>
      </div>

      <Connector
        v-for="conn in connections"
        :key="conn.id || `${conn.from?.id}-${conn.to?.id}`"
        :from="getConnectionPoint(conn.from, conn.fromSide)"
        :to="getConnectionPoint(conn.to, conn.toSide)"
        :type="conn.type"
      />

      <div
        v-for="conn in connections"
        :key="`anchor-${conn.id || `${conn.from?.id}-${conn.to?.id}`}`"
        class="conn-edit-anchor"
        :style="getMidpointStyle(conn)"
      >
        <button class="conn-dot" title="Edit connection type" @click.stop="selectConnection(conn.id)">•</button>
      </div>

      <div v-if="selectedConnection" class="conn-editor" :style="getMidpointStyle(selectedConnection)" @click.stop>
        <select class="conn-select" :value="selectedConnection.type" @change="e => changeSelectedConnectionType(e.target.value)">
          <option v-for="t in connectionTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <button class="conn-close" @click="clearSelectedConnection" title="Close">✕</button>
      </div>
    </div>

    <Toolbar
      v-model="selectedType"
      @local-export="exportDiagram"
      @local-import="importDiagram"
      @local-snapshot="exportAsImage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDiagramStore } from '../stores/diagramStore';
import Actor from './Actor.vue';
import Connector from './connector.vue';
import UseCase from './UseCase.vue';
import Toolbar from './Toolbar.vue';
import System from './System.vue'; 
import html2canvas from 'html2canvas'; 

const props = defineProps({ onLogout: Function });

const diagramStore = useDiagramStore();
const { elements, connections, selectedElements, selectedConnectionId, zoomLevel, connectMode } = storeToRefs(diagramStore);
const { updateSize, updateLabel, deleteElement, connectElements, undo, redo, saveToHistory } = diagramStore;

const selectedType = ref('association');
const connectFrom = ref(null);
const connectFromSide = ref(null);

const isSelecting = ref(false);
const selectionBox = ref({ startX: 0, startY: 0, currentX: 0, currentY: 0 });

const connectionTypes = ['association', 'include', 'extend', 'generalization', 'dependency'];
const selectedConnection = computed(() => connections.value.find(c => c.id === selectedConnectionId.value) || null);

// ==========================================
// 🚀 HIGH-PERFORMANCE NON-LAGGING DRAG PHYSICS
// ==========================================
const isDraggingElements = ref(false);
const activeTrackedElements = ref([]); 
let dragStartMouseX = 0;
let dragStartMouseY = 0;

const initiateElementDrag = (event, element) => {
  if (connectMode.value || event.button !== 0) return;
  
  const idStr = String(element.id);
  if (!selectedElements.value.includes(idStr)) {
    if (event.ctrlKey) {
      selectedElements.value.push(idStr);
    } else {
      selectedElements.value = [idStr];
    }
  }

  isDraggingElements.value = true;
  dragStartMouseX = event.clientX;
  dragStartMouseY = event.clientY;

  // Cache baseline configuration geometries
  activeTrackedElements.value = elements.value
    .filter(el => selectedElements.value.includes(String(el.id)))
    .map(el => ({
      id: el.id,
      baseX: el.x,
      baseY: el.y,
      currentX: el.x,
      currentY: el.y
    }));

  window.addEventListener('mousemove', handleElementDragMove);
  window.addEventListener('mouseup', handleElementDragMouseUp);
};

const handleElementDragMove = (event) => {
  if (!isDraggingElements.value) return;

  // Calculate un-tracked coordinates scaled precisely by zoom matrix divisors
  const deltaX = (event.clientX - dragStartMouseX) / zoomLevel.value;
  const deltaY = (event.clientY - dragStartMouseY) / zoomLevel.value;

  activeTrackedElements.value.forEach(item => {
    item.currentX = item.baseX + deltaX;
    item.currentY = item.baseY + deltaY;

    // Direct DOM mutation bypassing Pinia proxy triggers to achieve 144Hz performance
    const domWrapper = document.querySelector(`[data-element-id="${item.id}"]`);
    if (domWrapper) {
      domWrapper.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0)`;
    }
  });
};

const handleElementDragMouseUp = () => {
  if (!isDraggingElements.value) return;
  isDraggingElements.value = false;

  window.removeEventListener('mousemove', handleElementDragMove);
  window.removeEventListener('mouseup', handleElementDragMouseUp);

  // Flush mutations to the global store once dragging completely stops
  diagramStore.saveToHistory();
  activeTrackedElements.value.forEach(item => {
    diagramStore.updatePositionWithGroup(item.id, item.currentX, item.currentY);
  });
  activeTrackedElements.value = [];
};

const getElementStyle = (element) => {
  return {
    transform: `translate3d(${element.x}px, ${element.y}px, 0)`,
    position: 'absolute',
    top: 0,
    left: 0
  };
};

// ==========================================
// 🗄️ SIDEBAR HTML5 DRAG AND DROP ZONE
// ==========================================
const handleDragOver = (event) => {
  event.dataTransfer.dropEffect = 'move';
};

const handleDrop = (event) => {
  const elementType = event.dataTransfer.getData('text/plain');
  if (!['actor', 'usecase', 'System'].includes(elementType)) return;

  const canvasArea = document.querySelector('.drawing-area');
  if (!canvasArea) return;

  const rect = canvasArea.getBoundingClientRect();
  
  const droppedX = (event.clientX - rect.left + canvasArea.scrollLeft) / zoomLevel.value;
  const droppedY = (event.clientY - rect.top + canvasArea.scrollTop) / zoomLevel.value;

  diagramStore.saveToHistory();
  
  const generatedId = `${elementType.toLowerCase()}_${Date.now()}`;
  const elementPayload = {
    id: generatedId,
    type: elementType,
    label: elementType === 'System' ? 'System Boundary' : `New ${elementType}`,
    x: droppedX - (elementType === 'actor' ? 40 : elementType === 'System' ? 150 : 70),
    y: droppedY - (elementType === 'actor' ? 60 : elementType === 'System' ? 200 : 40),
    width: elementType === 'actor' ? 80 : elementType === 'System' ? 300 : 140,
    height: elementType === 'actor' ? 120 : elementType === 'System' ? 400 : 80
  };

  elements.value.push(elementPayload);
};

function selectConnection(id) { selectedConnectionId.value = id; }
function clearSelectedConnection() { selectedConnectionId.value = null; }
function zoomIn() { if (zoomLevel.value < 2) zoomLevel.value = Math.min(2, zoomLevel.value + 0.1); }
function zoomOut() { if (zoomLevel.value > 0.5) zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1); }
function resetZoom() { zoomLevel.value = 1; }

function handleCanvasMouseDown(e) {
  if (e.button !== 0 || e.target.closest('.element, .ConectingPoint, .conn-edit-anchor, .conn-editor')) return;
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left + canvas.scrollLeft) / zoomLevel.value;
  const y = (e.clientY - rect.top + canvas.scrollTop) / zoomLevel.value;
  isSelecting.value = true;
  selectionBox.value = { startX: x, startY: y, currentX: x, currentY: y };
  if (!e.ctrlKey) selectedElements.value = [];
}

function handleCanvasMouseMove(e) {
  if (!isSelecting.value) return;
  const canvas = document.querySelector('.drawing-area');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  selectionBox.value.currentX = (e.clientX - rect.left + canvas.scrollLeft) / zoomLevel.value;
  selectionBox.value.currentY = (e.clientY - rect.top + canvas.scrollTop) / zoomLevel.value;
  updateSelectionFromBox();
}

function handleCanvasMouseUp() { isSelecting.value = false; }

function updateSelectionFromBox() {
  const { startX, startY, currentX, currentY } = selectionBox.value;
  const minX = Math.min(startX, currentX);
  const maxX = Math.max(startX, currentX);
  const minY = Math.min(startY, currentY);
  const maxY = Math.max(startY, currentY);
  const newSelection = [];
  
  elements.value.forEach(el => {
    const w = el.width || (el.type === 'actor' ? 80 : el.type === 'System' ? 300 : 140);
    const h = el.height || (el.type === 'actor' ? 120 : el.type === 'System' ? 400 : 80);
    if (el.x < maxX && el.x + w > minX && el.y < maxY && el.y + h > minY) {
      newSelection.push(String(el.id));
    }
  });
  selectedElements.value = newSelection;
}

function getConnectionPoint(element, side = 'right') {
  if (!element) return { x: 0, y: 0 };
  const elementContainer = document.querySelector(`[data-element-id="${element.id}"]`);
  if (elementContainer) {
    const cp = elementContainer.querySelector(`.ConectingPoint.${side}`);
    if (cp) {
      const rect = cp.getBoundingClientRect();
      const canvasRect = document.querySelector('.drawing-area').getBoundingClientRect();
      return {
        x: rect.left - canvasRect.left + (rect.width / 2),
        y: rect.top - canvasRect.top + (rect.height / 2)
      };
    }
  }
  const w = element.width || (element.type === 'actor' ? 80 : 140);
  const h = element.height || (element.type === 'actor' ? 120 : 80);
  const pos = {
    top: { x: element.x + w / 2, y: element.y - 7 },
    bottom: { x: element.x + w / 2, y: element.y + h + 7 },
    left: { x: element.x - 7, y: element.y + h / 2 },
    right: { x: element.x + w + 7, y: element.y + h / 2 }
  };
  return pos[side] || pos.right;
}

function getMidpointStyle(conn) {
  const f = getConnectionPoint(conn.from, conn.fromSide);
  const t = getConnectionPoint(conn.to, conn.toSide);
  return { left: `${(f.x + t.x) / 2}px`, top: `${(f.y + t.y) / 2}px` };
}

function handleConnectionPointClick(id, side) {
  const idStr = String(id);
  if (!connectMode.value) return;
  if (!connectFrom.value) {
    connectFrom.value = idStr;
    connectFromSide.value = side;
    selectedElements.value = [idStr];
    return;
  }
  if (connectFrom.value === idStr) {
    connectFrom.value = null;
    connectFromSide.value = null;
    selectedElements.value = [];
    return;
  }
  diagramStore.connectElements(connectFrom.value, idStr, connectFromSide.value, side, selectedType.value);
  connectFrom.value = null;
  connectFromSide.value = null;
  selectedElements.value = [];
}

function handleKeydown(e) {
  const active = document.activeElement;
  const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
  if (e.ctrlKey && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
  if (isTyping) return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedElements.value.length > 0) {
      [...selectedElements.value].forEach(id => deleteElement(id));
      selectedElements.value = [];
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('mousemove', handleCanvasMouseMove);
  window.addEventListener('mouseup', handleCanvasMouseUp);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('mousemove', handleCanvasMouseMove);
  window.removeEventListener('mouseup', handleCanvasMouseUp);
});

function exportDiagram() {
  const data = {
    elements: elements.value.map(e => ({ id: e.id, type: e.type, label: e.label, x: e.x, y: e.y, width: e.width, height: e.height })),
    connections: connections.value.map(c => ({ id: c.id, from: c.from?.id, to: c.to?.id, fromSide: c.fromSide, toSide: c.toSide, type: c.type }))
  };
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  link.download = 'uml-diagram.json';
  link.click();
}

function importDiagram(data) {
  diagramStore.saveToHistory();
  elements.value = data.elements.map(e => ({ id: e.id, type: e.type, label: e.label, x: e.x, y: e.y, width: e.width, height: e.height }));
  connections.value = data.connections.map(c => ({
    id: c.id,
    from: elements.value.find(e => String(e.id) === String(c.from)),
    to: elements.value.find(e => String(e.id) === String(c.to)),
    fromSide: c.fromSide,
    toSide: c.toSide,
    type: c.type
  })).filter(c => c.from && c.to);
}

function exportAsImage() {
  const el = document.getElementById('uml-canvas');
  if (el) html2canvas(el).then(canvas => {
    const link = document.createElement('a');
    link.download = 'uml-diagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}
</script>

<style scoped>
.canvas-container { width: 100%; height: 100%; position: relative; overflow: hidden; background-color: #121214; display: flex; flex-direction: column; }
.zoom-controls { position: absolute; top: 20px; right: 20px; display: flex; align-items: center; gap: 8px; background: rgba(38, 38, 43, 0.9); padding: 8px 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 30; border: 1px solid #374151; backdrop-filter: blur(10px); }
.zoom-btn { width: 32px; height: 32px; border: 1px solid #4b5563; background: #1f2937; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; color: #e5e7eb; transition: all 0.2s ease; }
.zoom-btn:hover { background: #374151; border-color: #6b7280; color: white; transform: scale(1.05); }
.zoom-btn:active { transform: scale(0.95); }
.zoom-level { min-width: 50px; text-align: center; font-weight: 600; color: #d1d5db; font-size: 13px; }
.drawing-area { flex: 1; width: 100%; position: relative; overflow: auto; background: transparent; }
.elements-container { width: 5000px; height: 5000px; position: absolute; top: 0; left: 0; background: transparent; overflow: visible; }
.element-draggable-wrapper { will-change: transform; transition: none; }
.conn-edit-anchor { position: absolute; transform: translate(-50%, -50%); z-index: 5; }
.conn-dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #4f46e5; background: #1f2937; color: #e5e7eb; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.conn-editor { position: absolute; transform: translate(-50%, calc(-100% - 10px)); background: #1a1a1e; border: 1px solid #374151; border-radius: 10px; padding: 6px 8px; display: flex; gap: 6px; z-index: 6; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
.conn-select { background: #26262b; border: 1px solid #4b5563; border-radius: 8px; padding: 4px 8px; color: #e5e7eb; font-size: 12px; }
.selection-box { position: absolute; border: 1px dashed #6366f1; background: rgba(99, 102, 241, 0.1); pointer-events: none; z-index: 1000; }
</style>