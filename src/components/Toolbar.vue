<template>
  <div class="toolbar">
    <div class="tool-group">
      <button @click="selectTool('actor')" :class="{ active: currentTool === 'actor' }">
        Actor
      </button>
      <button @click="selectTool('useCase')" :class="{ active: currentTool === 'useCase' }">
        Use Case
      </button>
      <button @click="selectTool('connector')" :class="{ active: currentTool === 'connector' }">
        Connector
      </button>
    </div>
    <div class="tool-group">
      <button @click="exportDiagram">Export</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDiagramStore } from '../composables/useDiagramStore'

const store = useDiagramStore()
const currentTool = ref('select')

const selectTool = (tool) => {
  currentTool.value = tool
  // Update store with selected tool
}

const exportDiagram = () => {
  // Trigger export panel
}
</script>

<style scoped>
.toolbar {
  padding: 1rem;
  background: #f5f5f5;
  width: 200px;
  height: 100%;
}

.tool-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

button {
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

button.active {
  background: #e0e0e0;
}

button:hover {
  background: #f0f0f0;
}
</style>
