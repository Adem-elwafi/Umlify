<template>
  <svg class="connector" :width="width" :height="height" :style="positionStyle">
    <line :x1="startPoint.x" :y1="startPoint.y"
          :x2="endPoint.x" :y2="endPoint.y"
          stroke="#333"
          stroke-width="2" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  start: {
    type: Object,
    required: true
  },
  end: {
    type: Object,
    required: true
  }
})

const width = computed(() => Math.abs(props.end.x - props.start.x))
const height = computed(() => Math.abs(props.end.y - props.start.y))

const startPoint = computed(() => ({
  x: props.start.x < props.end.x ? 0 : width.value,
  y: props.start.y < props.end.y ? 0 : height.value
}))

const endPoint = computed(() => ({
  x: props.end.x > props.start.x ? width.value : 0,
  y: props.end.y > props.start.y ? height.value : 0
}))

const positionStyle = computed(() => ({
  left: `${Math.min(props.start.x, props.end.x)}px`,
  top: `${Math.min(props.start.y, props.end.y)}px`
}))
</script>

<style scoped>
.connector {
  position: absolute;
  pointer-events: none;
}
</style>
