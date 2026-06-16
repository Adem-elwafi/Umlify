<template>
  <svg class="connector">
    <!-- Task: Render strictly as high-visibility dark zinc profiles (#18181b) -->
    <line
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      class="stroke-[#18181b]"
      stroke-width="2"
      stroke-dasharray="6,4"
    />
    
    <text
      :x="(from.x + to.x) / 2"
      :y="(from.y + to.y) / 2 - 12"
      font-size="11"
      font-weight="700"
      text-anchor="middle"
      class="connector-label fill-[#18181b] tracking-tight"
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

.connector-label {
  paint-order: stroke;
  /* Using background color for halo to maintain visibility over lines */
  stroke: #fafafa;
  stroke-width: 4px;
  stroke-linejoin: round;
}
</style>
