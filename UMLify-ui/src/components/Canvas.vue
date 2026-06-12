<template>
  <div id="uml-canvas" class="canvas-container" :class="{'pencil-cursor': connectMode}">
    <!-- Zoom Controls -->
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn" title="Zoom In">
        <span>+</span>
      </button>
      <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
      <button @click="zoomOut" class="zoom-btn" title="Zoom Out">
        <span>−</span>
      </button>
      <button @click="resetZoom" class="zoom-btn reset-btn" title="Reset Zoom">
        <span>⟲</span>
      </button>
    </div>
    
    <div class="drawing-area" @click.self="clearSelectedConnection" @mousedown="handleCanvasMouseDown">

      <!-- Selection box visualization -->
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

      <!-- Elements -->
      <div class="elements-container" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }">
        <div v-for="element in elements" :key="element.id" :data-element-id="element.id">
          <System
            v-if="element.type === 'System'"
            :label="element.label"
            :x="element.x"
            :y="element.y"
            :width="element.width"
            :height="element.height"
            :onDrag="(newX, newY) => updatePositionWithGroup(element.id, newX, newY)"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click="selectElement(element.id)"
            @delete="deleteElement(element.id)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
          />
          <Actor
            v-if="element.type === 'actor'"
            :label="element.label"
            :x="element.x"
            :y="element.y"
            :width="element.width"
            :height="element.height"
            :onDrag="(newX, newY) => updatePositionWithGroup(element.id, newX, newY)"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click="selectElement(element.id)"
            @connection-point-click="(side) => handleConnectionPointClick(element.id, side)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            :class="{'pencil-cursor': connectMode}"
            @delete="deleteElement(element.id)"
          />
          <UseCase 
            v-else-if="element.type === 'usecase'"
            :label="element.label"
            :x="element.x"
            :y="element.y"
            :width="element.width"
            :height="element.height"
            :onDrag="(newX, newY) => updatePositionWithGroup(element.id, newX, newY)"
            :onResize="(newWidth, newHeight) => updateSize(element.id, newWidth, newHeight)"
            :selected="selectedElements.includes(String(element.id))"
            @click="selectElement(element.id)"
            @connection-point-click="(side) => handleConnectionPointClick(element.id, side)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            @delete="deleteElement(element.id)"
          />
        </div>
      </div>
      <!-- Connectors -->
      <Connector
        v-for="conn in connections"
        :key="conn.id || `${conn.from?.id}-${conn.to?.id}`"
        :from="getConnectionPoint(conn.from, conn.fromSide)"
        :to="getConnectionPoint(conn.to, conn.toSide)"
        :type="conn.type"
      />

      <!-- Connection edit anchors at midpoints -->
      <div
        v-for="conn in connections"
        :key="`anchor-${conn.id || `${conn.from?.id}-${conn.to?.id}`}`"
        class="conn-edit-anchor"
        :style="getMidpointStyle(conn)"
      >
        <button class="conn-dot" title="Edit connection type" @click.stop="selectConnection(conn.id)">•</button>
      </div>

      <!-- Connection type editor (appears at selected connection midpoint) -->
      <div v-if="selectedConnection" class="conn-editor" :style="getMidpointStyle(selectedConnection)" @click.stop>
        <select class="conn-select" :value="selectedConnection.type" @change="e => changeSelectedConnectionType(e.target.value)">
          <option v-for="t in connectionTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <button class="conn-close" @click="clearSelectedConnection" title="Close">✕</button>
      </div>
    </div>

    <Toolbar
      v-model:selectedType="selectedType"
      :onAddActor="addActor"
      :onAddUseCase="addUseCase"
      :onAddSystem="AddSystem"
      :onExport="exportDiagram"
      :onImport="importDiagram"
      :onExportImage="exportAsImage"
      :connectMode="connectMode"
      :onToggleConnect="toggleConnectMode"
      :onLogout="onLogout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, toRaw } from 'vue'
import { useDiagramStore } from '../stores/diagramStore'
import Actor from './Actor.vue'
import Connector from './connector.vue'
import UseCase from './UseCase.vue'
import Toolbar from './Toolbar.vue'
import html2canvas from 'html2canvas' 
import System from './System.vue' 

const props = defineProps({
  onLogout: Function
})

const diagramStore = useDiagramStore()

// Bind to store state
const elements = computed(() => diagramStore.elements)
const connections = computed(() => diagramStore.connections)
const selectedElements = computed({
  get: () => diagramStore.selectedElements,
  set: (val) => diagramStore.selectedElements = val
})
const connectMode = computed(() => diagramStore.connectMode)
const zoomLevel = computed(() => diagramStore.zoomLevel)

const selectedType = ref('association')
const connectFrom = ref(null)
const connectFromSide = ref(null)

// Multi-selection with drag box
const isSelecting = ref(false)
const selectionBox = ref({
  startX: 0, startY: 0, currentX: 0, currentY: 0
})

const connectionTypes = ['association', 'include', 'extend', 'generalization', 'dependency']

const selectedConnectionId = computed({
  get: () => diagramStore.selectedConnectionId,
  set: (val) => diagramStore.selectedConnectionId = val
})
const selectedConnection = computed(() => connections.value.find(c => c.id === selectedConnectionId.value) || null)

function selectConnection(id) {
  selectedConnectionId.value = id
}
function clearSelectedConnection() {
  selectedConnectionId.value = null
}

function zoomIn() {
  if (diagramStore.zoomLevel < 2) {
    diagramStore.zoomLevel = Math.min(2, diagramStore.zoomLevel + 0.1)
  }
}

function zoomOut() {
  if (diagramStore.zoomLevel > 0.5) {
    diagramStore.zoomLevel = Math.max(0.5, diagramStore.zoomLevel - 0.1)
  }
}

function resetZoom() {
  diagramStore.zoomLevel = 1
}

// Store action wrappers
const addActor = () => diagramStore.addActor()
const AddSystem = () => diagramStore.addSystem()
const addUseCase = () => diagramStore.addUseCase()
const updatePositionWithGroup = (id, x, y) => diagramStore.updatePositionWithGroup(id, x, y)
const updateSize = (id, w, h) => diagramStore.updateSize(id, w, h)
const updateLabel = (id, label) => diagramStore.updateLabel(id, label)
const deleteElement = (id) => diagramStore.deleteElement(id)
const undo = () => diagramStore.undo()
const redo = () => diagramStore.redo()

function handleCanvasMouseDown(e) {
  if (e.button !== 0 || e.target.closest('.element, .ConectingPoint, .conn-edit-anchor, .conn-editor')) return
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / zoomLevel.value
  const y = (e.clientY - rect.top) / zoomLevel.value
  isSelecting.value = true
  selectionBox.value = { startX: x, startY: y, currentX: x, currentY: y }
  if (!e.ctrlKey) selectedElements.value = []
}

function handleCanvasMouseMove(e) {
  if (!isSelecting.value) return
  const canvas = document.querySelector('.drawing-area')
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  selectionBox.value.currentX = (e.clientX - rect.left) / zoomLevel.value
  selectionBox.value.currentY = (e.clientY - rect.top) / zoomLevel.value
  updateSelectionFromBox()
}

function handleCanvasMouseUp() {
  isSelecting.value = false
}

function updateSelectionFromBox() {
  const { startX, startY, currentX, currentY } = selectionBox.value
  const minX = Math.min(startX, currentX), maxX = Math.max(startX, currentX)
  const minY = Math.min(startY, currentY), maxY = Math.max(startY, currentY)
  const newSelection = []
  elements.value.forEach(el => {
    const width = el.width || (el.type === 'actor' ? 98 : el.type === 'usecase' ? 166 : 380)
    const height = el.height || (el.type === 'actor' ? 50 : el.type === 'usecase' ? 60 : 560)
    if (el.x < maxX && el.x + width > minX && el.y < maxY && el.y + height > minY) {
      newSelection.push(String(el.id))
    }
  })
  selectedElements.value = newSelection
}

function toggleConnectMode() {
  diagramStore.connectMode = !diagramStore.connectMode
  connectFrom.value = null
  connectFromSide.value = null
  selectedElements.value = []
}

function getConnectionPoint(element, side = 'right') {
  if (!element) return { x: 0, y: 0 }
  const elementContainer = document.querySelector(`[data-element-id="${element.id}"]`)
  if (elementContainer) {
    const point = elementContainer.querySelector(`.ConectingPoint.${side}`)
    if (point) {
      const rect = point.getBoundingClientRect(), canvasRect = document.querySelector('.drawing-area').getBoundingClientRect()
      return { x: rect.left - canvasRect.left + (rect.width / 2), y: rect.top - canvasRect.top + (rect.height / 2) }
    }
  }
  const w = element.width || (element.type === 'actor' ? 80 : 140), h = element.height || (element.type === 'actor' ? 120 : 80)
  const p = {
    top: { x: element.x + w / 2, y: element.y },
    bottom: { x: element.x + w / 2, y: element.y + h },
    left: { x: element.x, y: element.y + h / 2 },
    right: { x: element.x + w, y: element.y + h / 2 }
  }
  return p[side] || p.right
}

function getMidpointStyle(conn) {
  const p1 = getConnectionPoint(conn.from, conn.fromSide), p2 = getConnectionPoint(conn.to, conn.toSide)
  return { left: `${(p1.x + p2.x) / 2}px`, top: `${(p1.y + p2.y) / 2}px` }
}

function changeSelectedConnectionType(newType) {
  if (selectedConnection.value) selectedConnection.value.type = newType
}

function handleConnectionPointClick(id, side) {
  const idStr = String(id)
  if (!connectMode.value) return
  if (!connectFrom.value) {
    connectFrom.value = idStr; connectFromSide.value = side; selectedElements.value = [idStr]
  } else if (connectFrom.value === idStr) {
    connectFrom.value = null; connectFromSide.value = null; selectedElements.value = []
  } else {
    diagramStore.connectElements(connectFrom.value, idStr, connectFromSide.value, side, selectedType.value)
    connectFrom.value = null; connectFromSide.value = null; selectedElements.value = []
  }
}

function selectElement(id) {
  const idStr = String(id)
  if (connectMode.value) return
  const isCtrl = window.event?.ctrlKey || window.event?.metaKey
  if (isCtrl) {
    selectedElements.value = selectedElements.value.includes(idStr) ? selectedElements.value.filter(e => e !== idStr) : [...selectedElements.value, idStr]
  } else {
    selectedElements.value = [idStr]
  }
}

function handleKeydown(e) {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo() }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo() }
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElements.value.length > 0) {
    selectedElements.value.forEach(id => deleteElement(id)); selectedElements.value = []
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mousemove', handleCanvasMouseMove)
  window.addEventListener('mouseup', handleCanvasMouseUp)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mousemove', handleCanvasMouseMove)
  window.removeEventListener('mouseup', handleCanvasMouseUp)
})

function exportDiagram() {
  const data = {
    elements: elements.value.map(e => ({ id: e.id, type: e.type, label: e.label, x: e.x, y: e.y, width: e.width, height: e.height })),
    connections: connections.value.map(c => ({ id: c.id, from: c.from.id, to: c.to.id, fromSide: c.fromSide, toSide: c.toSide, type: c.type }))
  }
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  link.download = 'uml-diagram.json'; link.click()
}

function importDiagram(data) {
  diagramStore.resetDiagram()
  diagramStore.elements = data.elements.map(e => ({ ...e, id: e.id || Date.now() }))
  diagramStore.connections = data.connections.map(c => ({
    ...c, id: String(c.id || Date.now()),
    from: diagramStore.elements.find(e => String(e.id) === String(c.from)),
    to: diagramStore.elements.find(e => String(e.id) === String(c.to))
  })).filter(c => c.from && c.to)
}

function exportAsImage() {
  const el = document.getElementById('uml-canvas')
  if (el) html2canvas(el).then(canvas => {
    const link = document.createElement('a')
    link.download = 'uml-diagram.png'; link.href = canvas.toDataURL(); link.click()
  })
}
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--canvasBg);
}

.zoom-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(23, 65, 67, 0.15);
  z-index: 10;
  backdrop-filter: blur(10px);
}

.zoom-btn {
  width: 32px;
  height: 32px;
  border: 2px solid var(--c-teal);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: var(--c-teal);
  transition: all 0.2s ease;
}

.zoom-btn:hover {
  background: var(--c-teal);
  color: white;
  transform: scale(1.05);
}

.zoom-btn:active {
  transform: scale(0.95);
}

.zoom-btn.reset-btn {
  font-size: 18px;
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  color: var(--c-teal);
  font-size: 14px;
}

.drawing-area {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  background: var(--c-peach);
  /* Custom Scrollbar Styles */
  scrollbar-width: thin;
  scrollbar-color: var(--c-teal) #fef3e5;
}

/* Webkit Scrollbar Customization */
.drawing-area::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
.drawing-area::-webkit-scrollbar-track {
  background: #fef3e5;
}
.drawing-area::-webkit-scrollbar-thumb {
  background: var(--c-teal);
  border-radius: 10px;
  border: 2px solid #fef3e5;
}
.drawing-area::-webkit-scrollbar-thumb:hover {
  background: var(--c-teal-light);
}

.elements-container {
  width: 5000px; /* Large workspace area */
  height: 5000px;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  overflow: visible;
}

/* highlight selected elements */
.selected {
  box-shadow: 
    0 0 30px rgba(249, 180, 135, 0.6),
    0 12px 32px rgba(66, 122, 118, 0.35);
  transform: translateZ(0) scale(1.05);
  transition: all 0.2s ease;
}

/* Connection edit UI */
.conn-edit-anchor {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: auto;
}

.conn-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid white;
  background: var(--c-peach);
  color: white;
  line-height: 12px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(23, 65, 67, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s ease, background .15s ease;
}
.conn-dot:hover {
  background: var(--c-teal);
  transform: scale(1.1);
}

.conn-editor {
  position: absolute;
  transform: translate(-50%, calc(-100% - 10px));
  background: white;
  border: 1px solid rgba(23,65,67,0.15);
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(23,65,67,0.2);
  padding: 6px 8px;
  display: flex;
  gap: 6px;
  align-items: center;
  z-index: 6;
}

.conn-select {
  appearance: none;
  border: 2px solid var(--c-teal);
  border-radius: 8px;
  padding: 4px 8px;
  background: white;
  color: var(--c-teal);
  font-weight: 600;
  cursor: pointer;
}

.conn-close {
  border: none;
  background: transparent;
  color: var(--c-teal);
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
}
.conn-close:hover {
  background: rgba(23,65,67,0.08);
}

/* Selection box styling */
.selection-box {
  position: absolute;
  border: 2px dashed #427a76;
  background: rgba(66, 122, 118, 0.15);
  pointer-events: none;
  z-index: 1000;
  border-radius: 4px;
}
</style>
