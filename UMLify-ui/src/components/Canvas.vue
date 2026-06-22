<template>
  <div 
    id="uml-canvas" 
    class="w-full h-full relative overflow-hidden bg-[#fafafa] flex flex-col select-none" 
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
          class="absolute border border-dashed border-accent-blue bg-accent-blue/10 pointer-events-none z-[1000]"
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
          <div v-if="selectedElements.includes(String(element.id))" class="absolute inset-0 pointer-events-none border border-accent-blue rounded-xl ring-1 ring-accent-blue/20 z-20"></div>

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
            v-else-if="element.type === 'actor'"
            :label="element.label"
            :x="0"
            :y="0"
            :width="element.width || 80"
            :height="element.height || 120"
            :onDrag="null"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click.stop="selectElement(element.id)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
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
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            @delete="deleteElement(element.id)"
          />
          <Package
            v-else-if="element.type === 'package'"
            :label="element.label"
            :x="0"
            :y="0"
            :width="element.width || 200"
            :height="element.height || 150"
            :onDrag="null"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click.stop="selectElement(element.id)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            @delete="deleteElement(element.id)"
          />
          <Note
            v-else-if="element.type === 'note'"
            :label="element.label"
            :x="0"
            :y="0"
            :width="element.width || 120"
            :height="element.height || 120"
            :onDrag="null"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click.stop="selectElement(element.id)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            @delete="deleteElement(element.id)"
          />

          <!-- Interactive Connection Anchors (Task 2: Hover perimeter handles) -->
          <div class="absolute inset-0 pointer-events-none group">
            <div 
              v-for="side in ['top', 'right', 'bottom', 'left']" 
              :key="side"
              :data-anchor-side="side"
              class="absolute w-3 h-3 rounded-full border border-zinc-300 bg-white shadow-xs flex items-center justify-center text-[9px] font-bold text-zinc-400 hover:text-accent-blue hover:border-accent-blue active:scale-75 transform opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-auto cursor-crosshair z-30"
              :class="{
                'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2': side === 'top',
                'top-1/2 right-0 translate-x-1/2 -translate-y-1/2': side === 'right',
                'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2': side === 'bottom',
                'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2': side === 'left'
              }"
              @mousedown.stop="initiateConnectionDrag($event, element, side)"
            >
              <span class="pointer-events-none">+</span>
            </div>
          </div>
        </div>

        <!-- Real-time Temp Orthogonal Vector Path -->
        <svg v-if="activeDraggingLink" class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1000] overflow-visible">
          <path 
            :d="draggingPath" 
            fill="none" 
            stroke="var(--color-accent-blue)" 
            stroke-width="1.5" 
            stroke-dasharray="4,4"
            class="drop-shadow-sm"
          />
        </svg>

        <!-- Smart Alignment Guides -->
        <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-[999] overflow-visible">
          <line 
            v-if="alignmentGuides.vertical" 
            :x1="alignmentGuides.vertical" 
            y1="0" 
            :x2="alignmentGuides.vertical" 
            y2="5000" 
            stroke="var(--color-accent-blue)" 
            stroke-width="1" 
            stroke-dasharray="5,5" 
            class="opacity-60"
          />
          <line 
            v-if="alignmentGuides.horizontal" 
            x1="0" 
            :y1="alignmentGuides.horizontal" 
            x2="5000" 
            :y2="alignmentGuides.horizontal" 
            stroke="var(--color-accent-blue)" 
            stroke-width="1" 
            stroke-dasharray="5,5" 
            class="opacity-60"
          />
        </svg>

        <!-- Relational Connectors -->
        <Connector
          v-for="conn in connections"
          :key="conn.id || `${conn.from?.id}-${conn.to?.id}`"
          :id="conn.id"
          :from="getConnectionPoint(conn.from, conn.fromSide)"
          :to="getConnectionPoint(conn.to, conn.toSide)"
          :from-element="conn.from"
          :to-element="conn.to"
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
            class="w-3 h-3 rounded-full border border-zinc-300 bg-white hover:border-accent-blue hover:bg-accent-blue/10 shadow-xs flex items-center justify-center text-[8px] text-zinc-400 hover:text-accent-blue transition-all cursor-crosshair z-20 active:scale-90" 
            title="Edit connection type" 
            @click.stop="selectConnection(conn.id)"
          >•</button>
        </div>
      </div>

      <!-- Contextual Connection Editor Overlay -->
      <div 
        v-if="selectedConnection" 
        class="absolute bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-lg shadow-zinc-200/40 rounded-xl p-2 flex items-center gap-1.5 z-40 transform -translate-x-1/2 -translate-y-[calc(100%+10px)]" 
        :style="getEditorStyle(selectedConnection)" 
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

          <div class="grid grid-cols-3 gap-2 text-[11px] mt-1">
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Width</span>
              <input 
                v-model.number="inspectorElement.width"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Height</span>
              <input 
                v-model.number="inspectorElement.height"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-zinc-400 text-[9px] uppercase font-bold">Layer (Z)</span>
              <input 
                v-model.number="inspectorElement.zIndex"
                type="number"
                class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
                placeholder="Auto"
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
import System from './System.vue'; 
import Package from './Package.vue';
import Note from './Note.vue';

const props = defineProps({ 
  onLogout: Function
});

const diagramStore = useDiagramStore();
const { elements, connections, selectedElements, selectedConnectionId, zoomLevel } = storeToRefs(diagramStore);
const { updateSize, updateLabel, deleteElement, connectElements, undo, redo, saveToHistory } = diagramStore;

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
// 🎯 SMART ALIGNMENT GUIDES & SNAP SYSTEM
// ==========================================
const alignmentGuides = ref({ vertical: null, horizontal: null });

function getElementDimensions(el) {
  if (!el) return { width: 0, height: 0 };
  let defaultW = 140;
  let defaultH = 80;
  if (el.type === 'actor') { defaultW = 80; defaultH = 120; }
  else if (el.type === 'System') { defaultW = 300; defaultH = 400; }
  else if (el.type === 'package') { defaultW = 200; defaultH = 150; }
  else if (el.type === 'note') { defaultW = 120; defaultH = 120; }
  return {
    width: el.width || defaultW,
    height: el.height || defaultH
  };
}

function getElementBounds(el) {
  const { width: w, height: h } = getElementDimensions(el);
  return {
    left: el.x,
    right: el.x + w,
    top: el.y,
    bottom: el.y + h,
    centerX: el.x + w / 2,
    centerY: el.y + h / 2
  };
}

// ==========================================
// 🔗 INTERACTIVE CONNECTION ENGINE (Task 3)
// ==========================================
const activeDraggingLink = ref(null);

const initiateConnectionDrag = (event, element, side) => {
  const fromPt = getConnectionPoint(element, side);
  const startX = fromPt.x;
  const startY = fromPt.y;

  activeDraggingLink.value = {
    sourceId: element.id,
    sourceSide: side,
    startX,
    startY,
    currentX: startX,
    currentY: startY,
    targetId: null,
    targetSide: null
  };

  window.addEventListener('mousemove', handleConnectionMouseMove);
  window.addEventListener('mouseup', handleConnectionMouseUp);
};

const handleConnectionMouseMove = (event) => {
  if (!activeDraggingLink.value) return;
  const canvasArea = document.querySelector('#uml-canvas div[class*="overflow-auto"]');
  const rect = canvasArea.getBoundingClientRect();
  
  activeDraggingLink.value.currentX = (event.clientX - rect.left + canvasArea.scrollLeft) / zoomLevel.value;
  activeDraggingLink.value.currentY = (event.clientY - rect.top + canvasArea.scrollTop) / zoomLevel.value;

  const elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY);
  const target = elementUnderCursor ? elementUnderCursor.closest('[data-anchor-side]') : null;
  if (target) {
    const targetWrapper = target.closest('[data-element-id]');
    const targetElementId = targetWrapper ? targetWrapper.dataset.elementId : null;
    const targetSide = target.dataset.anchorSide;
    
    if (targetElementId && targetElementId !== String(activeDraggingLink.value.sourceId)) {
      activeDraggingLink.value.targetId = targetElementId;
      activeDraggingLink.value.targetSide = targetSide;
    } else {
      activeDraggingLink.value.targetId = null;
      activeDraggingLink.value.targetSide = null;
    }
  } else {
    activeDraggingLink.value.targetId = null;
    activeDraggingLink.value.targetSide = null;
  }
};

const handleConnectionMouseUp = (event) => {
  if (!activeDraggingLink.value) return;

  const elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY);
  const target = elementUnderCursor ? elementUnderCursor.closest('[data-anchor-side]') : null;
  if (target) {
    const targetWrapper = target.closest('[data-element-id]');
    const targetElementId = targetWrapper ? targetWrapper.dataset.elementId : null;
    const targetSide = target.dataset.anchorSide;
    
    if (targetElementId && targetElementId !== String(activeDraggingLink.value.sourceId)) {
      diagramStore.connectElements(
        activeDraggingLink.value.sourceId,
        targetElementId,
        activeDraggingLink.value.sourceSide,
        targetSide,
        'association'
      );
    }
  }

  activeDraggingLink.value = null;
  window.removeEventListener('mousemove', handleConnectionMouseMove);
  window.removeEventListener('mouseup', handleConnectionMouseUp);
};

const draggingPath = computed(() => {
  if (!activeDraggingLink.value) return '';
  const { sourceId, sourceSide, startX, startY, currentX, currentY, targetId, targetSide } = activeDraggingLink.value;
  
  const sourceEl = elements.value.find(e => String(e.id) === String(sourceId));
  const targetEl = targetId ? elements.value.find(e => String(e.id) === String(targetId)) : null;

  if (sourceEl && targetEl && targetSide) {
    const fromPt = getConnectionPoint(sourceEl, sourceSide);
    const toPt = getConnectionPoint(targetEl, targetSide);
    
    const x1 = fromPt.x;
    const y1 = fromPt.y;
    const x2 = toPt.x;
    const y2 = toPt.y;
    
    const fromBounds = getElementBounds(sourceEl);
    const toBounds = getElementBounds(targetEl);

    let px1 = x1;
    let py1 = y1;
    if (sourceSide === 'right') px1 = fromBounds.right + 24;
    else if (sourceSide === 'left') px1 = fromBounds.left - 24;
    else if (sourceSide === 'top') py1 = fromBounds.top - 24;
    else if (sourceSide === 'bottom') py1 = fromBounds.bottom + 24;

    let px2 = x2;
    let py2 = y2;
    if (targetSide === 'right') px2 = toBounds.right + 24;
    else if (targetSide === 'left') px2 = toBounds.left - 24;
    else if (targetSide === 'top') py2 = toBounds.top - 24;
    else if (targetSide === 'bottom') py2 = toBounds.bottom + 24;

    const isFromHorizontal = ['left', 'right'].includes(sourceSide);
    const isToHorizontal = ['left', 'right'].includes(targetSide);

    // Case A: Horizontal Exit -> Horizontal Entry
    if (isFromHorizontal && isToHorizontal) {
      if (sourceSide === 'right' && targetSide === 'left') {
        if (x2 >= x1) {
          const midX = px1 + (px2 - px1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
        } else {
          const midY = py1 + (y2 - y1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
        }
      }
      if (sourceSide === 'left' && targetSide === 'right') {
        if (x2 <= x1) {
          const midX = px1 + (px2 - px1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
        } else {
          const midY = py1 + (y2 - y1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
        }
      }
      const escapeY = y2 >= y1 
        ? Math.max(fromBounds.bottom, toBounds.bottom) + 24 
        : Math.min(fromBounds.top, toBounds.top) - 24;
      return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${escapeY} L ${px2} ${escapeY} L ${px2} ${py2} L ${x2} ${y2}`;
    }

    // Case B: Vertical Exit -> Vertical Entry
    if (!isFromHorizontal && !isToHorizontal) {
      if (sourceSide === 'bottom' && targetSide === 'top') {
        if (y2 >= y1) {
          const midY = py1 + (py2 - py1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
        } else {
          const midX = px1 + (x2 - x1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
        }
      }
      if (sourceSide === 'top' && targetSide === 'bottom') {
        if (y2 <= y1) {
          const midY = py1 + (py2 - py1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
        } else {
          const midX = px1 + (x2 - x1) / 2;
          return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
        }
      }
      const escapeX = x2 >= x1 
        ? Math.max(fromBounds.right, toBounds.right) + 24 
        : Math.min(fromBounds.left, toBounds.left) - 24;
      return `M ${x1} ${y1} L ${px1} ${py1} L ${escapeX} ${py1} L ${escapeX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
    }

    // Case C: Horizontal Exit -> Vertical Entry
    if (isFromHorizontal && !isToHorizontal) {
      if ((sourceSide === 'right' && px2 < px1) || 
          (sourceSide === 'left' && px2 > px1) ||
          (targetSide === 'bottom' && py1 < py2) ||
          (targetSide === 'top' && py1 > py2)) {
        return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
      }
      return `M ${x1} ${y1} L ${px1} ${py1} L ${px2} ${py1} L ${px2} ${py2} L ${x2} ${y2}`;
    }

    // Case D: Vertical Exit -> Horizontal Entry
    if (!isFromHorizontal && isToHorizontal) {
      if ((sourceSide === 'bottom' && py2 < py1) || 
          (sourceSide === 'top' && py2 > py1) ||
          (targetSide === 'left' && px1 > px2) ||
          (targetSide === 'right' && px1 < px2)) {
        return `M ${x1} ${y1} L ${px1} ${py1} L ${px2} ${py1} L ${px2} ${py2} L ${x2} ${y2}`;
      }
      return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
    }
  }

  // 2. Fallback: Dragging in empty space
  let px1 = startX;
  let py1 = startY;
  if (sourceSide === 'right') px1 = startX + 24;
  else if (sourceSide === 'left') px1 = startX - 24;
  else if (sourceSide === 'top') py1 = startY - 24;
  else if (sourceSide === 'bottom') py1 = startY + 24;

  const isHorizontal = ['left', 'right'].includes(sourceSide);

  if (isHorizontal) {
    if ((sourceSide === 'right' && currentX < px1) || (sourceSide === 'left' && currentX > px1)) {
      return `M ${startX} ${startY} L ${px1} ${startY} L ${px1} ${currentY} L ${currentX} ${currentY}`;
    }
    const midX = px1 + (currentX - px1) / 2;
    return `M ${startX} ${startY} L ${px1} ${startY} L ${midX} ${startY} L ${midX} ${currentY} L ${currentX} ${currentY}`;
  } else {
    if ((sourceSide === 'bottom' && currentY < py1) || (sourceSide === 'top' && currentY > py1)) {
      return `M ${startX} ${startY} L ${startX} ${py1} L ${currentX} ${py1} L ${currentX} ${currentY}`;
    }
    const midY = py1 + (currentY - py1) / 2;
    return `M ${startX} ${startY} L ${startX} ${py1} L ${startX} ${midY} L ${currentX} ${midY} L ${currentX} ${currentY}`;
  }
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
  if (event.button !== 0) return;
  
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

  // Reset alignment guides for this frame
  alignmentGuides.value = { vertical: null, horizontal: null };
  const SNAP_THRESHOLD = 8;

  activeTrackedElements.value.forEach(item => {
    // Quantize absolute positions to a structured 16px grid matrix
    let nextX = Math.round((item.baseX + deltaX) / 16) * 16;
    let nextY = Math.round((item.baseY + deltaY) / 16) * 16;

    // Smart Snapping Logic
    const staticElements = elements.value.filter(el => !selectedElements.value.includes(String(el.id)));
    const movingBounds = getElementBounds({ ...item, x: nextX, y: nextY });

    staticElements.forEach(staticEl => {
      const staticBounds = getElementBounds(staticEl);

      // Vertical Snapping (X-axis)
      const vSnapPoints = [
        { moving: movingBounds.left, static: staticBounds.left, offset: 0 },
        { moving: movingBounds.left, static: staticBounds.right, offset: 0 },
        { moving: movingBounds.right, static: staticBounds.left, offset: -(movingBounds.right - movingBounds.left) },
        { moving: movingBounds.right, static: staticBounds.right, offset: -(movingBounds.right - movingBounds.left) },
        { moving: movingBounds.centerX, static: staticBounds.centerX, offset: -(movingBounds.centerX - movingBounds.left) }
      ];

      vSnapPoints.forEach(pt => {
        if (Math.abs(pt.moving - pt.static) < SNAP_THRESHOLD) {
          nextX = pt.static + pt.offset;
          alignmentGuides.value.vertical = pt.static;
        }
      });

      // Horizontal Snapping (Y-axis)
      const hSnapPoints = [
        { moving: movingBounds.top, static: staticBounds.top, offset: 0 },
        { moving: movingBounds.top, static: staticBounds.bottom, offset: 0 },
        { moving: movingBounds.bottom, static: staticBounds.top, offset: -(movingBounds.bottom - movingBounds.top) },
        { moving: movingBounds.bottom, static: staticBounds.bottom, offset: -(movingBounds.bottom - movingBounds.top) },
        { moving: movingBounds.centerY, static: staticBounds.centerY, offset: -(movingBounds.centerY - movingBounds.top) }
      ];

      hSnapPoints.forEach(pt => {
        if (Math.abs(pt.moving - pt.static) < SNAP_THRESHOLD) {
          nextY = pt.static + pt.offset;
          alignmentGuides.value.horizontal = pt.static;
        }
      });
    });

    item.currentX = nextX;
    item.currentY = nextY;
  });

  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(() => {
      activeTrackedElements.value.forEach(item => {
        const domWrapper = document.querySelector(`[data-element-id="${item.id}"]`);
        if (domWrapper) {
          domWrapper.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0)`;
        }

        // REACTIVE PATCH: Synchronize store state for real-time connector re-calculation
        const el = elements.value.find(e => String(e.id) === String(item.id));
        if (el) {
          el.x = item.currentX;
          el.y = item.currentY;
        }
      });
      animationFrameId = null;
    });
  }
};

const handleElementDragMouseUp = () => {
  if (!isDraggingElements.value) return;
  isDraggingElements.value = false;

  // Clear alignment guides
  alignmentGuides.value = { vertical: null, horizontal: null };

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
  const { width, height } = getElementDimensions(element);
  
  let baseZIndex = 10;
  if (element.type === 'System' || element.type === 'package') {
    baseZIndex = 5;
  } else if (element.type === 'actor' || element.type === 'usecase' || element.type === 'note') {
    baseZIndex = 10;
  }

  // Support manual z-index overrides from inspector
  let zIndex = typeof element.zIndex === 'number' ? element.zIndex : baseZIndex;

  if (selectedElements.value.includes(String(element.id))) {
    zIndex = Math.max(zIndex, 20);
  }

  return {
    transform: `translate3d(${element.x}px, ${element.y}px, 0)`,
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${width}px`,
    height: `${height}px`,
    'z-index': zIndex
  };
};

// ==========================================
// 🔍 DRIFT-FREE MULTI-SELECTION MARQUEE MATH
// ==========================================
function handleCanvasMouseDown(e) {
  if (e.button !== 0 || e.target.closest('.element, [data-anchor-side], .conn-edit-anchor, .conn-editor')) return;
  
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
  if (!isSelecting.value || isDraggingElements.value || activeDraggingLink.value) return;
  
  const canvas = document.querySelector('#uml-canvas div[class*="overflow-auto"]');
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
    const { width: w, height: h } = getElementDimensions(el);
    
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
  if (!['actor', 'usecase', 'System', 'package', 'note'].includes(elementType)) return;

  const canvasArea = document.querySelector('#uml-canvas div[class*="overflow-auto"]');
  if (!canvasArea) return;

  const rect = canvasArea.getBoundingClientRect();
  
  const droppedX = (event.clientX - rect.left + canvasArea.scrollLeft) / zoomLevel.value;
  const droppedY = (event.clientY - rect.top + canvasArea.scrollTop) / zoomLevel.value;

  if (typeof diagramStore.saveToHistory === 'function') {
    diagramStore.saveToHistory();
  }
  
  const generatedId = `${elementType.toLowerCase()}_${Date.now()}`;
  const { width: defaultWidth, height: defaultHeight } = getElementDimensions({ type: elementType });
  
  const elementPayload = {
    id: generatedId,
    type: elementType,
    label: elementType === 'System' ? 'System Boundary' : elementType === 'package' ? 'New Package' : elementType === 'note' ? 'New Note' : `New ${elementType}`,
    x: droppedX - (defaultWidth / 2),
    y: droppedY - (defaultHeight / 2),
    width: defaultWidth,
    height: defaultHeight
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
  const { width, height } = getElementDimensions(element);
  const positions = {
    top: { x: element.x + width / 2, y: element.y, side: 'top' },
    bottom: { x: element.x + width / 2, y: element.y + height, side: 'bottom' },
    left: { x: element.x, y: element.y + height / 2, side: 'left' },
    right: { x: element.x + width, y: element.y + height / 2, side: 'right' }
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
    midX = toPt.x;
    midY = fromPt.y;
  }

  return { left: `${midX}px`, top: `${midY}px` };
}

function getEditorStyle(conn) {
  const style = getMidpointStyle(conn);
  const left = parseFloat(style.left) * zoomLevel.value;
  const top = parseFloat(style.top) * zoomLevel.value;
  return { left: `${left}px`, top: `${top}px` };
}

function selectElement(id) {
  const idStr = String(id);
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
    } else if (selectedConnectionId.value) {
      diagramStore.deleteConnection(selectedConnectionId.value);
      selectedConnectionId.value = null;
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

</script>

<style scoped>
.pencil-cursor, .pencil-cursor * {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='%23000' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/></svg>") 8 24, auto !important;
}

.sheet-grid {
  background-image: radial-gradient(var(--color-secondary-gray) 1px, transparent 1px);
  background-size: 16px 16px;
}
</style>
