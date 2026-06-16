<template>
  <div 
    id="uml-canvas" 
    class="w-full h-full relative overflow-hidden bg-[#fafafa] flex flex-col select-none" 
    :class="{'pencil-cursor': connectMode}"
    @dragover.prevent="handleDragOver"
    @drop="handleDrop"
  >
    <!-- Zoom Controls -->
    <div class="absolute top-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-zinc-200/80 p-1.5 rounded-xl shadow-sm z-30">
      <button @click="zoomIn" class="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 rounded-lg text-zinc-600 transition-all active:scale-95 cursor-pointer text-sm font-bold" title="Zoom In"><span>+</span></button>
      <span class="min-w-[48px] text-center text-[11px] font-bold text-zinc-500 font-mono">{{ Math.round(zoomLevel * 100) }}%</span>
      <button @click="zoomOut" class="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 rounded-lg text-zinc-600 transition-all active:scale-95 cursor-pointer text-sm font-bold" title="Zoom Out"><span>−</span></button>
      <button @click="resetZoom" class="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 rounded-lg text-zinc-400 transition-all active:scale-95 cursor-pointer text-xs" title="Reset Zoom"><span>⟲</span></button>
    </div>
    
    <div 
      class="flex-1 w-full relative overflow-auto bg-transparent" 
      @click.self="clearSelectedConnection" 
      @mousedown="handleCanvasMouseDown"
    >
      <div 
        class="absolute top-0 left-0 w-[5000px] h-[5000px] bg-transparent overflow-visible sheet-grid" 
        :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }"
      >
        <!-- Selection Marquee (During Dragging) -->
        <div 
          v-if="isSelecting"
          class="absolute border border-dashed border-blue-400 bg-blue-50/20 pointer-events-none z-[1000]"
          :style="{
            left: boxLeft + 'px',
            top: boxTop + 'px',
            width: boxWidth + 'px',
            height: boxHeight + 'px'
          }"
        />

        <!-- Element Renderers -->
        <div 
          v-for="element in elements" 
          :key="element.id" 
          :data-element-id="element.id"
          class="absolute element-draggable-wrapper select-none will-change-transform"
          :style="getElementStyle(element)"
          @mousedown.stop="initiateElementsDrag($event, element)"
        >
          <!-- Task 1: Premium Hairline Selection Highlight -->
          <div v-if="selectedElements.includes(String(element.id))" class="absolute inset-0 pointer-events-none border border-blue-500 rounded-xl ring-1 ring-blue-500/20 z-20"></div>

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

      <!-- Relational Connectors -->
      <Connector
        v-for="conn in connections"
        :key="conn.id || `${conn.from?.id}-${conn.to?.id}`"
        :from="getConnectionPoint(conn.from, conn.fromSide)"
        :to="getConnectionPoint(conn.to, conn.toSide)"
        :type="conn.type"
      />

      <!-- Connection Edit Anchors (Task 2: High-fidelity micro-targets) -->
      <div
        v-for="conn in connections"
        :key="`anchor-${conn.id || `${conn.from?.id}-${conn.to?.id}`}`"
        class="absolute -translate-x-1/2 -translate-y-1/2 z-10"
        :style="getMidpointStyle(conn)"
      >
        <button 
          class="w-3 h-3 rounded-full border border-zinc-300 bg-white hover:border-blue-500 hover:bg-blue-50 shadow-xs flex items-center justify-center text-[8px] text-zinc-400 hover:text-blue-600 transition-all cursor-crosshair z-20 active:scale-90" 
          title="Edit connection type" 
          @click.stop="selectConnection(conn.id)"
        >•</button>
      </div>

      <!-- Contextual Connection Editor Overlay -->
      <div 
        v-if="selectedConnection" 
        class="absolute bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-lg shadow-zinc-200/40 rounded-xl p-2 flex items-center gap-1.5 z-40 transform -translate-x-1/2 -translate-y-[calc(100%+10px)]" 
        :style="getMidpointStyle(selectedConnection)" 
        @click.stop
      >
        <select 
          class="bg-zinc-50 border border-zinc-200 text-[11px] font-medium text-zinc-800 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer transition-all" 
          :value="selectedConnection.type" 
          @change="e => changeSelectedConnectionType(e.target.value)"
        >
          <option v-for="t in connectionTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <button 
          class="w-5 h-5 flex items-center justify-center bg-transparent hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 rounded-md text-[10px] transition-all cursor-pointer" 
          @click="clearSelectedConnection" 
          title="Close"
        >✕</button>
      </div>
    </div>

    <!-- Toolbar Entry Point -->
    <div 
      class="transition-all duration-300 ease-in-out"
      :class="isSidebarDrawerOpen ? '-translate-x-24 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'"
    >
      <Toolbar
        v-model="selectedType"
        @local-export="exportDiagram"
        @local-import="importDiagram"
        @local-snapshot="exportAsImage"
      />
    </div>

    <!-- Element Property Inspector Sidebar -->
    <transition name="fade">
      <div v-if="inspectorElement" class="absolute right-6 top-24 w-64 bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-xl shadow-zinc-200/30 rounded-2xl p-4 flex flex-col gap-4 z-40" @mousedown.stop>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">Element Label</label>
          <input 
            v-model="inspectorElement.label"
            type="text"
            class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
            placeholder="Node Name"
          />
          <div class="text-[11px] font-mono font-medium text-zinc-400 mt-1 select-none flex items-center gap-1">
            <span>ID:</span>
            <span class="truncate uppercase">{{ inspectorElement.id.split('_')[1] || inspectorElement.id.slice(-6) }}</span>
          </div>
        </div>

        <div class="h-px bg-zinc-100 w-full" />

        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">Geometric Parameters</label>
          
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Position X</span>
              <input 
                v-model.number="inspectorElement.x"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Position Y</span>
              <input 
                v-model.number="inspectorElement.y"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] mt-1">
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Width</span>
              <input 
                v-model.number="inspectorElement.width"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Height</span>
              <input 
                v-model.number="inspectorElement.height"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
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

const props = defineProps({ 
  onLogout: Function,
  isSidebarDrawerOpen: Boolean
});

const diagramStore = useDiagramStore();
const { elements, connections, selectedElements, selectedConnectionId, zoomLevel, connectMode } = storeToRefs(diagramStore);
const { updateSize, updateLabel, deleteElement, connectElements, undo, redo, saveToHistory } = diagramStore;

const selectedType = ref('association');
const connectFrom = ref(null);
const connectFromSide = ref(null);

const isSelecting = ref(false);
const selectionBox = ref({ startX: 0, startY: 0, currentX: 0, currentY: 0 });
const boxLeft = ref(0);
const boxTop = ref(0);
const boxWidth = ref(0);
const boxHeight = ref(0);

const connectionTypes = ['association', 'include', 'extend', 'generalization', 'dependency'];
const selectedConnection = computed(() => connections.value.find(c => c.id === selectedConnectionId.value) || null);

const inspectorElement = computed(() => {
  if (selectedElements.value.length === 1) {
    return elements.value.find(e => String(e.id) === String(selectedElements.value[0])) || null;
  }
  return null;
});

// ==========================================
// 🚀 OPTIMIZED MULTI-ELEMENT DRAGGING PHYSICS
// ==========================================
const isDraggingElements = ref(false);
const activeTrackedElements = ref([]); 
let dragStartMouseX = 0;
let dragStartMouseY = 0;
let animationFrameId = null;

const initiateElementsDrag = (event, element) => {
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

  const deltaX = (event.clientX - dragStartMouseX) / zoomLevel.value;
  const deltaY = (event.clientY - dragStartMouseY) / zoomLevel.value;

  activeTrackedElements.value.forEach(item => {
    item.currentX = item.baseX + deltaX;
    item.currentY = item.baseY + deltaY;
  });

  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(() => {
      activeTrackedElements.value.forEach(item => {
        const domWrapper = document.querySelector(`[data-element-id="${item.id}"]`);
        if (domWrapper) {
          domWrapper.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0)`;
        }
      });
      animationFrameId = null;
    });
  }
};

const handleElementDragMouseUp = () => {
  if (!isDraggingElements.value) return;
  isDraggingElements.value = false;

  window.removeEventListener('mousemove', handleElementDragMove);
  window.removeEventListener('mouseup', handleElementDragMouseUp);
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (typeof diagramStore.saveToHistory === 'function') {
    diagramStore.saveToHistory();
  }

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
// 🔍 DRIFT-FREE MULTI-SELECTION MARQUEE MATH
// ==========================================
function handleCanvasMouseDown(e) {
  if (e.button !== 0 || e.target.closest('.element, .ConectingPoint, .conn-edit-anchor, .conn-editor')) return;
  
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();
  
  const x = (e.clientX - rect.left + canvas.scrollLeft) / zoomLevel.value;
  const y = (e.clientY - rect.top + canvas.scrollTop) / zoomLevel.value;
  
  isSelecting.value = true;
  selectionBox.value = { startX: x, startY: y, currentX: x, currentY: y };
  boxLeft.value = x;
  boxTop.value = y;
  boxWidth.value = 0;
  boxHeight.value = 0;
  
  if (!e.ctrlKey) {
    selectedElements.value = [];
  }
}
function handleCanvasMouseMove(e) {
  if (!isSelecting.value || isDraggingElements.value) return;
  
  const canvas = document.querySelector('.drawing-area') || document.querySelector('#uml-canvas div[class*="overflow-auto"]');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  
  const currentX = (e.clientX - rect.left + canvas.scrollLeft) / zoomLevel.value;
  const currentY = (e.clientY - rect.top + canvas.scrollTop) / zoomLevel.value;
  
  selectionBox.value.currentX = currentX;
  selectionBox.value.currentY = currentY;
  
  boxWidth.value = Math.abs(currentX - selectionBox.value.startX);
  boxHeight.value = Math.abs(currentY - selectionBox.value.startY);
  
  boxLeft.value = Math.min(selectionBox.value.startX, currentX);
  boxTop.value = Math.min(selectionBox.value.startY, currentY);
  
  updateSelectionFromBox();
}

function handleCanvasMouseUp() { 
  isSelecting.value = false; 
}

function updateSelectionFromBox() {
  const minX = boxLeft.value;
  const maxX = boxLeft.value + boxWidth.value;
  const minY = boxTop.value;
  const maxY = boxTop.value + boxHeight.value;
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

const handleDragOver = (event) => {
  event.dataTransfer.dropEffect = 'move';
};

const handleDrop = (event) => {
  const elementType = event.dataTransfer.getData('text/plain');
  if (!['actor', 'usecase', 'System'].includes(elementType)) return;

  const canvasArea = document.querySelector('.drawing-area') || document.querySelector('#uml-canvas div[class*="overflow-auto"]');
  if (!canvasArea) return;

  const rect = canvasArea.getBoundingClientRect();
  
  const droppedX = (event.clientX - rect.left + canvasArea.scrollLeft) / zoomLevel.value;
  const droppedY = (event.clientY - rect.top + canvasArea.scrollTop) / zoomLevel.value;

  if (typeof diagramStore.saveToHistory === 'function') {
    diagramStore.saveToHistory();
  }
  
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

function changeSelectedConnectionType(newType) {
  if (selectedConnection.value) selectedConnection.value.type = newType;
}

function getConnectionPoint(element, side = 'right') {
  if (!element) return { x: 0, y: 0 };
  const elementContainer = document.querySelector(`[data-element-id="${element.id}"]`);
  if (elementContainer) {
    const connectionPoint = elementContainer.querySelector(`.ConectingPoint.${side}`);
    if (connectionPoint) {
      const rect = connectionPoint.getBoundingClientRect();
      const canvasArea = document.querySelector('.drawing-area') || document.querySelector('#uml-canvas div[class*="overflow-auto"]');
      const canvasRect = canvasArea.getBoundingClientRect();
      return {
        x: rect.left - canvasRect.left + (rect.width / 2) + canvasArea.scrollLeft,
        y: rect.top - canvasRect.top + (rect.height / 2) + canvasArea.scrollTop,
        side: side
      };
    }
  }
  const width = element.width || (element.type === 'actor' ? 80 : element.type === 'usecase' ? 140 : 300);
  const height = element.height || (element.type === 'actor' ? 120 : element.type === 'usecase' ? 80 : 400);
  const positions = {
    top: { x: element.x + width / 2, y: element.y - 7, side: 'top' },
    bottom: { x: element.x + width / 2, y: element.y + height + 7, side: 'bottom' },
    left: { x: element.x - 7, y: element.y + height / 2, side: 'left' },
    right: { x: element.x + width + 7, y: element.y + height / 2, side: 'right' }
  };
  return positions[side] || { ...positions.right, side: 'right' };
}

function getMidpointStyle(conn) {
  const fromPt = getConnectionPoint(conn.from, conn.fromSide);
  const toPt = getConnectionPoint(conn.to, conn.toSide);
  
  // Align midpoint style with orthogonal logic
  let midX, midY;
  const isFromHorizontal = ['left', 'right'].includes(fromPt.side);
  const isToHorizontal = ['left', 'right'].includes(toPt.side);

  if (isFromHorizontal && isToHorizontal) {
    midX = fromPt.x + (toPt.x - fromPt.x) / 2;
    midY = (fromPt.y + toPt.y) / 2;
  } else if (!isFromHorizontal && !isToHorizontal) {
    midX = (fromPt.x + toPt.x) / 2;
    midY = fromPt.y + (toPt.y - fromPt.y) / 2;
  } else {
    // Mixed edge - approximate middle of the L-shape
    midX = toPt.x;
    midY = fromPt.y;
  }

  return { left: `${midX}px`, top: `${midY}px` };
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

function selectElement(id) {
  const idStr = String(id);
  if (connectMode.value) return;
  const isCtrlClick = window.event && (window.event.ctrlKey || window.event.metaKey);
  if (isCtrlClick) {
    if (selectedElements.value.includes(idStr)) {
      selectedElements.value = selectedElements.value.filter(e => e !== idStr);
    } else {
      selectedElements.value.push(idStr);
    }
  } else {
    selectedElements.value = [idStr];
  }
}

function handleKeydown(e) {
  const active = document.activeElement;
  const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
  if (e.ctrlKey && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
  if (isTyping) return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedElements.value.length > 0) {
      [...selectedElements.value].forEach(id => diagramStore.deleteElement(id));
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
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'uml-diagram.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importDiagram(data) {
  if (typeof diagramStore.saveToHistory === 'function') diagramStore.saveToHistory();
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
  const canvasElement = document.getElementById('uml-canvas');
  if (!canvasElement) return;
  html2canvas(canvasElement).then(canvas => {
    const link = document.createElement('a');
    link.download = 'uml-diagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}
</script>

<style scoped>
.pencil-cursor, .pencil-cursor * {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='%23000' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/></svg>") 8 24, auto !important;
}

.sheet-grid {
  background-image: radial-gradient(#d4d4d8 1px, transparent 1px);
  background-size: 16px 16px;
}
</style>
