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
    
    <div class="canvas" @click.self="clearSelectedConnection" @mousedown="handleCanvasMouseDown">

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
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, toRaw } from 'vue'
import Actor from './Actor.vue'
import Connector from './connector.vue'
import UseCase from './UseCase.vue'
import Toolbar from './Toolbar.vue'
import html2canvas from 'html2canvas' 
import System from './System.vue' 

const elements = ref([])
const selectedType = ref('association')
const selectedElements = ref([])
const connectMode = ref(false)
const connectFrom = ref(null)
const connectFromSide = ref(null)
const zoomLevel = ref(1)

// Multi-selection with drag box
const isSelecting = ref(false)
const selectionBox = ref({
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0
})

// Helper to generate ids (string ids to avoid type mismatch)
const makeId = () => (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`)

// Connection types available for editing
const connectionTypes = ['association', 'include', 'extend', 'generalization', 'dependency']

// Selected connection for inline type editor
const selectedConnectionId = ref(null)
const selectedConnection = computed(() => connections.value.find(c => c.id === selectedConnectionId.value) || null)
function selectConnection(id) {
  selectedConnectionId.value = id
}
function clearSelectedConnection() {
  selectedConnectionId.value = null
}

function zoomIn() {
  if (zoomLevel.value < 2) {
    zoomLevel.value = Math.min(2, zoomLevel.value + 0.1)
  }
}

function zoomOut() {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1)
  }
}

function resetZoom() {
  zoomLevel.value = 1
}

// Selection box drag handlers
function handleCanvasMouseDown(e) {
  // Only start selection box on left click on canvas background
  if (e.button !== 0 || e.target.closest('.element, .ConectingPoint, .conn-edit-anchor, .conn-editor')) {
    return
  }
  
  const canvas = e.currentTarget
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left) / zoomLevel.value
  const y = (e.clientY - rect.top) / zoomLevel.value
  
  isSelecting.value = true
  selectionBox.value = { startX: x, startY: y, currentX: x, currentY: y }
  
  // Clear selection if not holding Ctrl
  if (!e.ctrlKey) {
    selectedElements.value = []
  }
}

function handleCanvasMouseMove(e) {
  if (!isSelecting.value) return
  
  const canvas = document.querySelector('.canvas')
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left) / zoomLevel.value
  const y = (e.clientY - rect.top) / zoomLevel.value
  
  selectionBox.value.currentX = x
  selectionBox.value.currentY = y
  
  updateSelectionFromBox()
}

function handleCanvasMouseUp() {
  isSelecting.value = false
  // Commit any pending move/resize as a single undo step
  commitTransform()
}

function updateSelectionFromBox() {
  const { startX, startY, currentX, currentY } = selectionBox.value
  const minX = Math.min(startX, currentX)
  const maxX = Math.max(startX, currentX)
  const minY = Math.min(startY, currentY)
  const maxY = Math.max(startY, currentY)
  
  const newSelection = []
  
  elements.value.forEach(el => {
    let width = el.width || 200
    let height = el.height || 100
    
    if (el.type === 'actor') {
      width = el.width || 98
      height = el.height || 50
    } else if (el.type === 'usecase') {
      width = el.width || 166
      height = el.height || 60
    } else if (el.type === 'System') {
      width = el.width || 380
      height = el.height || 560
    }
    
    const right = el.x + width
    const bottom = el.y + height
    
    // Check if element intersects with selection box
    if (el.x < maxX && right > minX && el.y < maxY && bottom > minY) {
      newSelection.push(String(el.id))
    }
  })
  
  selectedElements.value = newSelection
}

function toggleConnectMode() {
  connectMode.value = !connectMode.value
  connectFrom.value = null
  connectFromSide.value = null
  selectedElements.value = []
  console.log('connectMode set to', connectMode.value)
}
function addActor() {
  withUndo(() => {
    elements.value.push({
      id: Date.now(),
      type: 'actor',
      label: 'Actor',
      x: 400,
      y: 100
    })
  })
}
function AddSystem() {
  withUndo(() => {
    elements.value.push({
      id: Date.now(),
      type: 'System',
      label: 'System',
      x: 500,
      y: 200
    })
  })
}

function addUseCase() {
  withUndo(() => {
    elements.value.push({
      id: Date.now(),
      type: 'usecase',
      label: 'useCase',
      x: 500,
      y: 200
    })
  })
}
function updatePosition(id, newX, newY) {
  beginTransform('move')
  const el = elements.value.find(e => e.id === id)
  if (el) {
    el.x = newX
    el.y = newY
  }
}

// Group drag: move all selected elements together
function updatePositionWithGroup(id, newX, newY) {
  beginTransform('move')
  const idStr = String(id)
  const el = elements.value.find(e => String(e.id) === idStr)
  if (!el) return
  
  const deltaX = newX - el.x
  const deltaY = newY - el.y
  
  // If this element is part of a multi-selection, move all selected elements
  if (selectedElements.value.includes(idStr) && selectedElements.value.length > 1) {
    selectedElements.value.forEach(selectedId => {
      const selectedEl = elements.value.find(e => String(e.id) === selectedId)
      if (selectedEl) {
        selectedEl.x += deltaX
        selectedEl.y += deltaY
      }
    })
  } else {
    // Single element move
    el.x = newX
    el.y = newY
  }
}

function updateSize(id, newWidth, newHeight) {
  beginTransform('resize')
  const el = elements.value.find(e => e.id === id)
  if (el) {
    el.width = newWidth
    el.height = newHeight
  }
}

function updateLabel(id, newLabel) {
  withUndo(() => {
    const el = elements.value.find(e => e.id === id)
    if (el) {
      el.label = newLabel
    }
  })
}
const connections = ref([])

// -------------------------
// History (Undo/Redo)
// -------------------------
const undoStack = ref([])
const redoStack = ref([])
const transformTx = ref(null) // { kind: 'move'|'resize', before: Snapshot }

// A compact snapshot that normalizes connection references by element id.
function createSnapshot() {
  const elCopy = JSON.parse(JSON.stringify(toRaw(elements.value)))
  const conns = connections.value.map(c => ({
    id: c.id,
    fromId: c.from?.id,
    toId: c.to?.id,
    fromSide: c.fromSide,
    toSide: c.toSide,
    type: c.type
  }))
  return { elements: elCopy, connections: conns }
}

function restoreSnapshot(snap) {
  const elCopy = JSON.parse(JSON.stringify(snap.elements))
  elements.value = elCopy
  connections.value = snap.connections.map(cs => {
    const from = elements.value.find(e => String(e.id) === String(cs.fromId))
    const to = elements.value.find(e => String(e.id) === String(cs.toId))
    return {
      id: cs.id,
      from,
      to,
      fromSide: cs.fromSide,
      toSide: cs.toSide,
      type: cs.type
    }
  })
  // Clear ephemeral UI state
  selectedElements.value = []
  selectedConnectionId.value = null
  connectFrom.value = null
  connectFromSide.value = null
}

function withUndo(mutator) {
  const before = createSnapshot()
  mutator()
  undoStack.value.push(before)
  redoStack.value = []
}

function beginTransform(kind) {
  if (!transformTx.value) {
    transformTx.value = { kind, before: createSnapshot() }
  }
}
function commitTransform() {
  if (!transformTx.value) return
  undoStack.value.push(transformTx.value.before)
  redoStack.value = []
  transformTx.value = null
}
function cancelTransform() {
  transformTx.value = null
}

function undo() {
  if (transformTx.value) commitTransform()
  if (undoStack.value.length === 0) return
  const current = createSnapshot()
  const prev = undoStack.value.pop()
  redoStack.value.push(current)
  restoreSnapshot(prev)
}

function redo() {
  if (redoStack.value.length === 0) return
  const current = createSnapshot()
  const next = redoStack.value.pop()
  undoStack.value.push(current)
  restoreSnapshot(next)
}

function getConnectionPoint(element, side = 'right') {
  // Try to find the actual DOM element and its connection point
  const elementContainer = document.querySelector(`[data-element-id="${element.id}"]`)
  if (elementContainer) {
    const connectionPoint = elementContainer.querySelector(`.ConectingPoint.${side}`)
    if (connectionPoint) {
      const rect = connectionPoint.getBoundingClientRect()
      const canvasRect = document.querySelector('.canvas').getBoundingClientRect()
      
      // Get the center of the connection point relative to the canvas
      return {
        x: rect.left - canvasRect.left + (rect.width / 2),
        y: rect.top - canvasRect.top + (rect.height / 2)
      }
    }
  }
  
  // Fallback to estimated position if DOM query fails
  if (element.type === 'actor') {
    const width = element.width || 98
    const height = element.height || 50
    const positions = {
      top: { x: element.x + width / 2, y: element.y - 7 },
      bottom: { x: element.x + width / 2, y: element.y + height + 7 },
      left: { x: element.x - 7, y: element.y + height / 2 },
      right: { x: element.x + width + 7, y: element.y + height / 2 }
    }
    return positions[side] || positions.right
  } else if (element.type === 'usecase') {
    const width = element.width || 166
    const height = element.height || 60
    const positions = {
      top: { x: element.x + width / 2, y: element.y - 7 },
      bottom: { x: element.x + width / 2, y: element.y + height + 7 },
      left: { x: element.x - 7, y: element.y + height / 2 },
      right: { x: element.x + width + 7, y: element.y + height / 2 }
    }
    return positions[side] || positions.left
  }
  return { x: element.x, y: element.y }
}

// Compute midpoint style for connection overlays
function getMidpointStyle(conn) {
  const fromPt = getConnectionPoint(conn.from, conn.fromSide)
  const toPt = getConnectionPoint(conn.to, conn.toSide)
  const midX = (fromPt.x + toPt.x) / 2
  const midY = (fromPt.y + toPt.y) / 2
  return { left: `${midX}px`, top: `${midY}px` }
}

function changeSelectedConnectionType(newType) {
  if (!selectedConnection.value) return
  selectedConnection.value.type = newType
}


function connectElements(id1, id2, side1, side2) {
  console.log('connectElements called with', id1, id2, side1, side2)
  // match by string to avoid number/string mismatch
  const from = elements.value.find(e => String(e.id) === String(id1))
  const to = elements.value.find(e => String(e.id) === String(id2))
  console.log('found from, to:', from, to)
  if (from && to) {
    withUndo(() => {
      connections.value.push({
        id: makeId(),
        from,
        to,
        fromSide: side1,
        toSide: side2,
        type: selectedType.value
      })
    })
    console.log('connection created', connections.value[connections.value.length - 1])
    return true
  }
  console.warn('Could not create connection — missing element(s)')
  return false
}


function handleConnectionPointClick(id, side) {
  const idStr = String(id)
  console.log('handleConnectionPointClick called with', idStr, side, 'connectMode=', connectMode.value)

  if (connectMode.value) {
    if (!connectFrom.value) {
      connectFrom.value = idStr
      connectFromSide.value = side
      selectedElements.value = [idStr]
      console.log('connectFrom set to', idStr, 'side:', side)
      return
    }

    if (connectFrom.value === idStr) {
      connectFrom.value = null
      connectFromSide.value = null
      selectedElements.value = []
      console.log('connectFrom cleared')
      return
    }

    // attempt to create connection
    connectElements(connectFrom.value, idStr, connectFromSide.value, side)
    connectFrom.value = null
    connectFromSide.value = null
    selectedElements.value = []
    console.log('connection attempt finished; connectFrom cleared')
    return
  }
}

function selectElement(id) {
  const idStr = String(id)
  console.log('selectElement called with', idStr, 'connectMode=', connectMode.value)

  if (connectMode.value) {
    // In connect mode, only connection points should work
    return
  }

  // Check if this is a Ctrl+Click (multi-select)
  const isCtrlClick = window.event && (window.event.ctrlKey || window.event.metaKey)
  
  if (isCtrlClick) {
    // Toggle selection
    if (selectedElements.value.includes(idStr)) {
      selectedElements.value = selectedElements.value.filter(e => e !== idStr)
    } else {
      selectedElements.value.push(idStr)
    }
  } else {
    // Single select (replace selection)
    if (selectedElements.value.includes(idStr) && selectedElements.value.length === 1) {
      // Already selected, do nothing
    } else {
      selectedElements.value = [idStr]
    }
  }
}

// Delete logic
function deleteElement(id) {
  withUndo(() => rawDeleteElement(id))
}

// Raw delete used for batching and undo wrapping
function rawDeleteElement(id) {
  const idStr = String(id)
  // Remove element
  elements.value = elements.value.filter(e => String(e.id) !== idStr)
  // Remove any connections touching this element
  connections.value = connections.value.filter(c => String(c.from?.id) !== idStr && String(c.to?.id) !== idStr)
  // If the selected connection was removed, clear selection
  if (selectedConnectionId.value && !connections.value.some(c => c.id === selectedConnectionId.value)) {
    selectedConnectionId.value = null
  }
  // Clear selection and pending connect state if affected
  selectedElements.value = selectedElements.value.filter(e => e !== idStr)
  if (connectFrom.value === idStr) {
    connectFrom.value = null
    connectFromSide.value = null
  }
}

// Optional: keyboard Delete/Backspace to remove selected elements (unless typing)
function handleKeydown(e) {
  const active = document.activeElement
  const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)
  // Undo/Redo shortcuts
  if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    undo()
    return
  }
  if (e.ctrlKey && e.key.toLowerCase() === 'y') {
    e.preventDefault()
    redo()
    return
  }
  if (isTyping) return
  if (e.key === 'Delete' || e.key === 'Backspace') {
    // Delete all selected elements
    if (selectedElements.value.length > 0) {
      const toDelete = [...selectedElements.value]
      withUndo(() => {
        toDelete.forEach(id => rawDeleteElement(id))
        selectedElements.value = []
      })
    }
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
    elements: elements.value.map(e => ({
      id: e.id,
      type: e.type,
      label: e.label,
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    })),
    connections: connections.value.map(c => ({
      id: c.id,
      from: c.from.id,
      to: c.to.id,
      fromSide: c.fromSide,
      toSide: c.toSide,
      type: c.type
    }))
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'uml-diagram.json'
  link.click()

  URL.revokeObjectURL(url)
}

function importDiagram(data) {
  withUndo(() => {
    try {
      // Clear existing elements and connections
      elements.value = []
      connections.value = []
      
      // Import elements first
      elements.value = data.elements.map(e => ({
        id: e.id || Date.now(), // Ensure we have an ID
        type: e.type,
        label: e.label || (e.type === 'actor' ? 'New Actor' : 'New Use Case'),
        x: e.x || 100,
        y: e.y || 100,
        width: e.width,
        height: e.height
      }))

      // Import connections after elements are loaded
      // This ensures we can properly link the connections
      connections.value = data.connections
        .filter(c => {
          // Only import connections where both elements exist
          const fromExists = elements.value.some(e => String(e.id) === String(c.from))
          const toExists = elements.value.some(e => String(e.id) === String(c.to))
          return fromExists && toExists
        })
        .map(c => {
          const from = elements.value.find(e => String(e.id) === String(c.from))
          const to = elements.value.find(e => String(e.id) === String(c.to))
          return {
            id: String(c.id || makeId()),
            from,
            to,
            fromSide: c.fromSide || 'right',
            toSide: c.toSide || 'left',
            type: c.type || 'association'
          }
        })
    } catch (error) {
      console.error('Error importing diagram:', error)
      alert('Error importing diagram. Please check the file format.')
    }
  })
}

function exportAsImage() {
  const canvasElement = document.getElementById('uml-canvas')
  if (!canvasElement) return

  html2canvas(canvasElement).then(canvas => {
    const link = document.createElement('a')
    link.download = 'uml-diagram.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  })
}
</script>

<style scoped>
.canvas-container {
  width: calc(100% - 350px);
  float: right;
  margin: 1.5rem;
  margin-right: clamp(70px ,70px,30px);
  position: relative;

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

.canvas {
  width: 100%;
  height: calc(100vh - 3rem);
  border: 4px dashed white ;
  border-radius: 20px;
  position: relative;
  overflow: auto;
  background: var(--c-teal);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 20px 60px rgba(23, 65, 67, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 0 40px rgba(249, 180, 135, 0.1);
  /* Custom Scrollbar Styles */
  scrollbar-width: thin;
  scrollbar-color: var(--c-teal) #fef3e5;
  /* Webkit Scrollbar Customization inside .canvas selector for scoped CSS */
}

/* Webkit Scrollbar Customization */
.canvas::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
.canvas::-webkit-scrollbar-track {
  background: #fef3e5;
  border-radius: 10px;
}
.canvas::-webkit-scrollbar-thumb {
  background: var(--c-teal);
  border-radius: 10px;
  border: 2px solid #fef3e5;
}
.canvas::-webkit-scrollbar-thumb:hover {
  background: var(--c-teal-light);
}

.elements-container {
  width: 100%;
  height: 100%;
  background:var(--c-peach);
  overflow: visible;
}

.uml-element {
  position: absolute;
  padding: 12px 16px;
  background: rgba(245, 229, 225, 0.9);
  border-radius: 12px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;
}

.actor {
  border: 3px solid var(--c-teal);
}

.usecase {
  border: 3px solid var(--c-teal);
  border-radius: 50%;
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