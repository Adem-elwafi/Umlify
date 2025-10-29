<template>
  <div class="canvas">
    <button @click="addActor">Add Actor</button>
    <button @click="addUseCase">Add Use Case</button>

    <!-- Elements -->
    <template v-for="element in elements" :key="element.id">
      <Actor
        v-if="element.type === 'actor'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
        ref="elementRefs"
      />
      <UseCase
        v-else-if="element.type === 'usecase'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
        ref="elementRefs"
      />
    </template>

    <!-- Connectors -->
    <Connector
      v-for="(conn, index) in connections"
      :key="index"
      :from="getConnectionPoint(conn.from)"
      :to="getConnectionPoint(conn.to)"
    />

    <button @click="connectElements(elements[0]?.id, elements[1]?.id)" class="connect-btn">
      Connect First Two
    </button>
  </div>
</template>  

<script setup>
import { ref } from 'vue'
import Actor from './Actor.vue'
import Connector from './Connector.vue'
import UseCase from './UseCase.vue'
const elements = ref([])

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
    connections.value.push({ from, to })
  }
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
</style>