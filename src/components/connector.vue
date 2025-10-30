<template>
  <svg class="connector">
    <line
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      stroke="black"
      stroke-width="2"
    />
    <text
      :x="(from.x + to.x) / 2"
      :y="(from.y + to.y) / 2 - 10"
      font-size="12"
      fill="black"
      text-anchor="middle"
    >
      {{ type }}
    </text>
  </svg>
</template>

<script setup>
const props = defineProps({
  from: Object,
  to: Object,
  type: String
})
</script>

<style scoped>
.connector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* let mouse events through to elements */
}
</style>