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
    
    <div class="canvas">

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
            :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
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
            :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
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
            :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
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
        v-for="(conn, index) in connections"
        :key="`${conn.from?.id || 'f'}-${conn.to?.id || 't'}-${index}`"
        :from="getConnectionPoint(conn.from, conn.fromSide)"
        :to="getConnectionPoint(conn.to, conn.toSide)"
        :type="conn.type"
      />
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

function toggleConnectMode() {
  connectMode.value = !connectMode.value
  connectFrom.value = null
  connectFromSide.value = null
  selectedElements.value = []
  console.log('connectMode set to', connectMode.value)
}
function addActor() {
  let ActorTxt =  'Actor'
  elements.value.push({
    id: Date.now(),
    type: 'actor',
    label: 'Actor',
    x: 400,
    y: 100

  })
}
function AddSystem() {
  elements.value.push({
    id: Date.now(),
    type: 'System',
    label: 'System',
    x: 500,
    y: 200
  })
}

function addUseCase() {
  let UseCaseTxt = 'useCase' ; 
  elements.value.push({
    id: Date.now(),
    type: 'usecase',
    label: UseCaseTxt,
    x: 500,
    y: 200
  })
}
function updatePosition(id, newX, newY) {
  const el = elements.value.find(e => e.id === id)
  if (el) {
    el.x = newX
    el.y = newY
  }
}

function updateSize(id, newWidth, newHeight) {
  const el = elements.value.find(e => e.id === id)
  if (el) {
    el.width = newWidth
    el.height = newHeight
  }
}

function updateLabel(id, newLabel) {
  const el = elements.value.find(e => e.id === id)
  if (el) {
    el.label = newLabel
  }
}
const connections = ref([])

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


function connectElements(id1, id2, side1, side2) {
  console.log('connectElements called with', id1, id2, side1, side2)
  // match by string to avoid number/string mismatch
  const from = elements.value.find(e => String(e.id) === String(id1))
  const to = elements.value.find(e => String(e.id) === String(id2))
  console.log('found from, to:', from, to)
  if (from && to) {
    connections.value.push({
      from,
      to,
      fromSide: side1,
      toSide: side2,
      type: selectedType.value
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

  // non-connect mode selection
  if (selectedElements.value.includes(idStr)) {
    selectedElements.value = selectedElements.value.filter(e => e !== idStr)
  } else {
    selectedElements.value.push(idStr)
    // In non-connect mode we only toggle selection. Connections are
    // created explicitly via Connect Mode to avoid accidental links.
  }
}

// Delete logic
function deleteElement(id) {
  const idStr = String(id)
  // Remove element
  elements.value = elements.value.filter(e => String(e.id) !== idStr)
  // Remove any connections touching this element
  connections.value = connections.value.filter(c => String(c.from?.id) !== idStr && String(c.to?.id) !== idStr)
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
  if (isTyping) return
  if (e.key === 'Delete' || e.key === 'Backspace') {
    const toDelete = [...selectedElements.value]
    toDelete.forEach(id => deleteElement(id))
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
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
        const fromExists = elements.value.some(e => e.id === c.from)
        const toExists = elements.value.some(e => e.id === c.to)
        return fromExists && toExists
      })
      .map(c => {
        const from = elements.value.find(e => e.id === c.from)
        const to = elements.value.find(e => e.id === c.to)
        return {
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
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background:var(--c-teal);

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
</style>