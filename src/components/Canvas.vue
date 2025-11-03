<template>
  <div id="uml-canvas" class="canvas">


    <!-- Elements -->
    <div v-for="element in elements"  :key="element.id">
      <Actor
        v-if="element.type === 'actor'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
        :selected="selectedElements.includes(String(element.id))"
        @click="selectElement(element.id)"
      />
      <UseCase 
        v-else-if="element.type === 'usecase'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"  
        :selected="selectedElements.includes(String(element.id))"
        @click="selectElement(element.id)"
      />
    </div>
  <!-- connection button removed; connections are created by selecting two elements -->

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
    
    <!-- Connectors -->
    <Connector
      v-for="(conn, index) in connections"
      :key="`${conn.from?.id || 'f'}-${conn.to?.id || 't'}-${index}`"
      :from="getConnectionPoint(conn.from)"
      :to="getConnectionPoint(conn.to)"
      :type="conn.type"
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

function toggleConnectMode() {
  connectMode.value = !connectMode.value
  connectFrom.value = null
  selectedElements.value = []
  console.log('connectMode set to', connectMode.value)
}
function addActor() {
  elements.value.push({
    id: Date.now(),
    type: 'actor',
    label: 'New Actor',
    x: 100,
    y: 100
  })
}

function addUseCase() {
  elements.value.push({
    id: Date.now(),
    type: 'usecase',
    label: 'New Use Case',
    x: 200,
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
const connections = ref([])

function getConnectionPoint(element) {
  const padding = 8  // padding from CSS
  const borderWidth = 2  // border width from CSS
  
  if (element.type === 'actor') {
    // Get the center of the actor element
    // Assuming average actor width is about 60px
    const width = 60 + (padding * 2) + (borderWidth * 2)
    const height = 40 + (padding * 2) + (borderWidth * 2)
    
    return {
      x: element.x + (width / 2),
      y: element.y + (height / 2)
    }
  } else if (element.type === 'usecase') {
    // Get the center of the use case ellipse
    // Assuming average use case width is about 80px
    const width = 80 + (padding * 2) + (borderWidth * 2)
    const height = 30 + (padding * 2) + (borderWidth * 2)
    
    return {
      x: element.x + (width / 2),
      y: element.y + (height / 2)
    }
  }
  return { x: element.x, y: element.y }
}


function connectElements(id1, id2) {
  console.log('connectElements called with', id1, id2)
  // match by string to avoid number/string mismatch
  const from = elements.value.find(e => String(e.id) === String(id1))
  const to = elements.value.find(e => String(e.id) === String(id2))
  console.log('found from, to:', from, to)
  if (from && to) {
    connections.value.push({
      from,
      to,
      type: selectedType.value
    })
    console.log('connection created', connections.value[connections.value.length - 1])
    return true
  }
  console.warn('Could not create connection — missing element(s)')
  return false
}


function selectElement(id) {
  const idStr = String(id)
  console.log('selectElement called with', idStr, 'connectMode=', connectMode.value)

  if (connectMode.value) {
    if (!connectFrom.value) {
      connectFrom.value = idStr
      selectedElements.value = [idStr]
      console.log('connectFrom set to', idStr)
      return
    }

    if (connectFrom.value === idStr) {
      connectFrom.value = null
      selectedElements.value = []
      console.log('connectFrom cleared')
      return
    }

    // attempt to create connection
    connectElements(connectFrom.value, idStr)
    connectFrom.value = null
    selectedElements.value = []
    console.log('connection attempt finished; connectFrom cleared')
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
.canvas {
  position: relative;
  width: 100%;
  height: 600px;
  border: 2px dashed #ccc;
  margin-top: 1rem;
  overflow: hidden;
}

.uml-element {
  position: absolute;
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 6px;
  cursor: grab;
  user-select: none;
}

.actor {
  border: 2px solid #007bff;
}

.usecase {
  border: 2px solid #28a745;
  border-radius: 50%;
}

/* highlight selected elements */
.selected {
  box-shadow: 0 0 10px rgba(0,123,255,0.65);
  transform: translateZ(0) scale(1.02);
  transition: box-shadow 0.12s ease, transform 0.12s ease;
}
</style>