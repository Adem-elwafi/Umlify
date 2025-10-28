<template>
  <div class="canvas">
    <button @click="addActor">Add Actor</button>
    <button @click="addUseCase">Add Use Case</button>

    <template v-for="element in elements" :key="element.id">
      <Actor
        v-if="element.type === 'actor'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
      />
      <UseCase
        v-else-if="element.type === 'usecase'"
        :label="element.label"
        :x="element.x"
        :y="element.y"
        :onDrag="(newX, newY) => updatePosition(element.id, newX, newY)"
      />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Actor from './Actor.vue'
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