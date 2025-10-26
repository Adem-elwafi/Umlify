<template>
  <div class="use-case" :style="positionStyle">
    <div class="ellipse">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    required: true,
    default: () => ({ x: 0, y: 0 })
  },
  title: {
    type: String,
    default: 'Use Case'
  }
})

const positionStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`
}))
</script>

<style scoped>
.use-case {
  position: absolute;
  cursor: move;
}

.ellipse {
  width: 120px;
  height: 60px;
  background: white;
  border: 2px solid #333;
  border-radius: 60px / 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
