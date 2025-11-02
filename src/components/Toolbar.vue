<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedType: String,
  onUpdateType: Function,
  onAddActor: Function,
  onAddUseCase: Function,
  onExport: Function, 
  onImport: Function , 
  onExportImage : Function 
})

const emit = defineEmits(['update:selectedType'])

function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.name.toLowerCase().endsWith('.json')) {
    alert('Please select a JSON file')
    event.target.value = '' // Reset the input
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const content = reader.result
      const parsed = JSON.parse(content)
      
      // Validate the imported data structure
      if (!parsed.elements || !Array.isArray(parsed.elements) || 
          !parsed.connections || !Array.isArray(parsed.connections)) {
        throw new Error('Invalid diagram format')
      }
      
      if (props.onImport) {
        props.onImport(parsed)
      }
    } catch (err) {
      alert('Invalid diagram file: ' + err.message)
      event.target.value = '' // Reset the input
    }
  }
  reader.onerror = () => {
    alert('Error reading file')
    event.target.value = '' // Reset the input
  }
  reader.readAsText(file)
}
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
  <button @click="onExportImage">Export as Image</button>
  <input type="file" @change="handleImport" accept=".jSON">
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
