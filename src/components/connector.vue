<template>
  <svg class="connector">
    <line
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      stroke="black"
      stroke-width="2"
      stroke-dasharray="4"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  from: Object, // { x, y }
  to: Object    // { x, y }
})
</script>

<style scoped>
.connector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1; /* Place lines behind elements */
}
</style>