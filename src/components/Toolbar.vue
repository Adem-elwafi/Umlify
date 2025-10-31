<script setup>
import { computed } from 'vue'

defineProps({
  selectedType: String,
  onUpdateType: Function,
  onAddActor: Function,
  onAddUseCase: Function,
  onExport: Function  
})

defineEmits(['update:selectedType'])
</script>

<template>
  <div class="toolbar">
    <button @click="onAddActor">Add Actor</button>
    <button @click="onAddUseCase">Add Use Case</button>

    <select 
      :value="selectedType"
      @change="$emit('update:selectedType', $event.target.value)"
    >
      <option value="association">Association</option>
      <option value="include">Include</option>
      <option value="extend">Extend</option>
    </select>
  <button @click="onExport">Export Diagram</button>
    
  </div>
</template>


<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
</style>
