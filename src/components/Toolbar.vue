<script setup>
import { computed } from 'vue'

const {
  selectedType,
  onUpdateType,
  onAddActor,
  onAddUseCase,
  onExport,
  onImport,
  onExportImage,
  connectMode,
  onToggleConnect
} = defineProps({
  selectedType: String,
  onUpdateType: Function,
  onAddActor: Function,
  onAddUseCase: Function,
  onExport: Function, 
  onImport: Function , 
  onExportImage : Function,
  connectMode: Boolean,
  onToggleConnect: Function
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
      
      if (onImport) {
        onImport(parsed)
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
  <div class="toolbar" >
    <div class="toolbar-group">
      <button class="action" @click="onAddActor">Add Actor</button>
      <button class="action" @click="onAddUseCase">Add Use Case</button>
    </div>

    <div class="toolbar-group">
      <label class="select-label">Relation</label>
      <select 
        class="select"
        :value="selectedType"
        @change="$emit('update:selectedType', $event.target.value)"
      >
        <option value="association">Association</option>
        <option value="include">Include</option>
        <option value="extend">Extend</option>
      </select>
    </div>

    <div class="toolbar-group">
      <button class="action" @click="onExport">Export Diagram</button>
      <button class="action" @click="onExportImage">Export as Image</button>
      <button
        class="action connect-button"
        :class="{ active: connectMode }"
        @click="onToggleConnect && onToggleConnect()"
      >
        {{ connectMode ? 'Connect: ON' : 'Connect Mode' }}
      </button>

      <!-- styled file input -->
      <label class="file-btn">
        <input id="import-file" type="file" @change="handleImport" accept=".json" />
        Import
      </label>
    </div>
  </div>
</template>


<style scoped>
.toolbar {
  position: fixed;
  left: 12px;
  top: 12px;
  height: calc(100vh - 24px);
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  align-items: stretch;
  background: var(--c-dark-teal-transparent);
  color: var(--text-on-dark);
  border-radius: 16px;
  border: 2px solid rgba(66, 122, 118, 0.3);
  box-shadow: 
    0 20px 50px rgba(23, 65, 67, 0.4),
    inset 0 1px 0 rgba(249, 180, 135, 0.15);
  backdrop-filter: blur(12px);
  z-index: 30;
}

.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toolbar .action {
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 2px solid rgba(66, 122, 118, 0.4);
  background: var(--c-peach);
  color: var(--c-dark-teal);
  font-weight: 700;
  font-size: 13px;
  transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease;
  box-shadow: 0 4px 12px rgba(249, 180, 135, 0.3);
}

.toolbar .action:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(249, 180, 135, 0.5);
  background: #fac49d;
}

.toolbar .action:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(249, 180, 135, 0.4);
}

.toolbar .connect-button.active {
  border-color: var(--c-teal);
  box-shadow: 
    0 8px 24px rgba(66, 122, 118, 0.5),
    inset 0 0 20px rgba(66, 122, 118, 0.2);
  background: var(--c-teal);
  color: var(--text-on-dark);
}

.select-label {
  font-size: 13px;
  color: var(--c-beige);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select {
  padding: 10px 14px;
  border-radius: 12px;
  border: 2px solid rgba(66, 122, 118, 0.4);
  background: var(--c-teal);
  color: var(--text-on-dark);
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23F5E5E1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px auto;
  padding-right: 36px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(66, 122, 118, 0.3);
}

.select:hover {
  background-color: #4d918c;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(66, 122, 118, 0.4);
}

.select:focus {
  outline: none;
  border-color: var(--c-peach);
  box-shadow: 0 0 0 3px rgba(249, 180, 135, 0.3);
}

.select option {
  background-color: var(--c-dark-teal);
  color: var(--text-on-dark);
  padding: 10px;
  font-weight: 600;
}

.file-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(249, 180, 135, 0.2);
  border: 2px dashed var(--c-peach);
  color: var(--c-peach);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-btn:hover {
  background: var(--c-peach);
  color: var(--c-dark-teal);
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(249, 180, 135, 0.4);
}

.file-btn input[type="file"] {
  display: none;
}

/* Accessibility */
.toolbar .action:focus-visible,
.file-btn:focus-visible,
.select:focus-visible {
  outline: 3px solid rgba(249, 180, 135, 0.5);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .toolbar {
    left: 8px;
    top: 8px;
    width: 160px;
    padding: 10px;
  }
}
</style>
