<template>
  <div class="canvas" @click="handleCanvasClick">
    <Actor v-for="actor in actors" 
          :key="actor.id" 
          :position="actor.position" />
    <UseCase v-for="useCase in useCases" 
            :key="useCase.id" 
            :position="useCase.position" />
    <connector v-for="connection in connections" 
              :key="connection.id" 
              :start="connection.start" 
              :end="connection.end" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDiagramStore } from '../composables/useDiagramStore'
import Actor from './Actor.vue'
import UseCase from './UseCase.vue'
import connector from './connector.vue'

const store = useDiagramStore()
const actors = ref([])
const useCases = ref([])
const connections = ref([])

const handleCanvasClick = (event) => {
  // Handle canvas click events
  console.log('Canvas clicked', event)
}
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  background: #fafafa;
  position: relative;
}
</style>
