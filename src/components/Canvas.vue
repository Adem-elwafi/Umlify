<template>
  <div class="canvas">


    <!-- Elements -->
    <div v-for="element in elements" :key="element.id">
      <Actor
        v-if="element.type === 'actor'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
        :selected="selectedElements.includes(element.id)"
        @click="selectElement(element.id)"
      />
      <UseCase 
        v-else-if="element.type === 'usecase'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
        :selected="selectedElements.includes(element.id)"
        @click="selectElement(element.id)"
      />
    </div>

    <Toolbar
      v-model:selectedType="selectedType"
      :onAddActor="addActor"
      :onAddUseCase="addUseCase"
      :onExport="exportDiagram"
    />
    
    <!-- Connectors -->
    <Connector
      v-for="(conn, index) in connections"
      :key="index"
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

const elements = ref([])
const selectedType = ref('association')
const selectedElements = ref([])
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
  const from = elements.value.find(e => e.id === id1)
  const to = elements.value.find(e => e.id === id2)
  if (from && to) {
    connections.value.push({
      from,
      to,
      type: selectedType.value
    })
  }
}


function selectElement(id) {
  if (selectedElements.value.includes(id)) {
    selectedElements.value = selectedElements.value.filter(e => e !== id)
  } else {
    selectedElements.value.push(id)
    if (selectedElements.value.length === 2) {
      connectElements(selectedElements.value[0], selectedElements.value[1])
      selectedElements.value = []
    }
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