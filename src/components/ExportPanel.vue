<template>
  <div class="export-panel">
    <div class="header">
      <h3>Export Diagram</h3>
      <button @click="$emit('close')" class="close-btn">×</button>
    </div>
    <div class="content">
      <button @click="exportAsImage">Export as Image</button>
      <button @click="exportAsJSON">Export as JSON</button>
    </div>
  </div>
</template>

<script setup>
const exportAsImage = () => {
  // TODO: Implement image export
  console.log('Export as image')
}

const exportAsJSON = () => {
  // TODO: Implement JSON export
  console.log('Export as JSON')
}
</script>

<style scoped>
.export-panel {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.content {
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

button:hover {
  background: #f0f0f0;
}
</style>
