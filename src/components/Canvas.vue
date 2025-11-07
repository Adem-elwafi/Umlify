<template>
  <div id="uml-canvas" class="canvas-container" :class="{'pencil-cursor': connectMode}">
    <div class="canvas">
      <!-- Elements -->
      <div class="elements-container">
        <div v-for="element in elements" :key="element.id" :data-element-id="element.id">
          <Actor
            v-if="element.type === 'actor'"
            :label="element.label"
            :x="element.x"
            :y="element.y"
            :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
            :selected="selectedElements.includes(String(element.id))"
            @click="selectElement(element.id)"
            @connection-point-click="(side) => handleConnectionPointClick(element.id, side)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
            :class="{'pencil-cursor': connectMode}"
          />
          <UseCase 
            v-else-if="element.type === 'usecase'"
            :label="element.label"
            :x="element.x"
            :y="element.y"
            :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"  
            :selected="selectedElements.includes(String(element.id))"
            @click="selectElement(element.id)"
            @connection-point-click="(side) => handleConnectionPointClick(element.id, side)"
            @update:label="(newLabel) => updateLabel(element.id, newLabel)"
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
      :onExport="exportDiagram"
      :onImport="importDiagram"
      :onExportImage="exportAsImage"
      :connectMode="connectMode"
      :onToggleConnect="toggleConnectMode"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Actor from './Actor.vue'
import Connector from './Connector.vue'
import UseCase from './UseCase.vue'
import Toolbar from './Toolbar.vue'
import html2canvas from 'html2canvas' 

const elements = ref([])
const selectedType = ref('association')
const selectedElements = ref([])
const connectMode = ref(false)
const connectFrom = ref(null)
const connectFromSide = ref(null)

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
    const width = 98
    const height = 50
    const positions = {
      top: { x: element.x + width / 2, y: element.y - 7 },
      bottom: { x: element.x + width / 2, y: element.y + height + 7 },
      left: { x: element.x - 7, y: element.y + height / 2 },
      right: { x: element.x + width + 7, y: element.y + height / 2 }
    }
    return positions[side] || positions.right
  } else if (element.type === 'usecase') {
    const width = 166
    const height = 60
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
function exportDiagram() {
  const data = {
    elements: elements.value.map(e => ({
      id: e.id,
      type: e.type,
      label: e.label,
      x: e.x,
      y: e.y
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
      y: e.y || 100
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
  width: calc(100% - 260px);
  float: right;
  margin: 1.5rem;
  margin-left: 0;
  position: relative;
}

.canvas {
  width: 100%;
  height: calc(100vh - 3rem);
  border: 3px dashed var(--c-teal-light);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(245, 229, 225, 0.7) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 20px 60px rgba(23, 65, 67, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 0 40px rgba(249, 180, 135, 0.1);
}

.elements-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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