<template>
  <div class="canvas">
    <button @click="addActor">Add Actor</button>
    <button @click="addUseCase">Add Use Case</button>

    <div
      v-for="element in elements"
      :key="element.id"
      :class="['uml-element', element.type]"
      :style="{ left: element.x + 'px', top: element.y + 'px' }"
      @mousedown="startDrag($event, element)"
    >
      {{ element.label }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

let dragging = null

function startDrag(event, element) {
   dragging = element ; 

  //see the position of our cursor  
  const StartX = event.clientX ; 
  const StartY = event.clientY ; 
  const initialX = element.x ; 
  const initialY = element.y ; 
  const move = (e)=>{
    const dx = e.clientX -StartX ; 
    const dy = e.clientY - StartY ; 
    
    element.x = initialX + dx ; 
    element.y = initialY + dy; 
  }

  

  const stop = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', stop)
    dragging = null
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stop)
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