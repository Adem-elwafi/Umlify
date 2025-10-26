<template>
  <div class="actor" :style="positionStyle">
    <div class="head"></div>
    <div class="body"></div>
    <div class="legs"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    required: true,
    default: () => ({ x: 0, y: 0 })
  }
})

const positionStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`
}))
</script>

<style scoped>
.actor {
  position: absolute;
  width: 40px;
  height: 80px;
  cursor: move;
}

.head {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  margin: 0 auto;
}

.body {
  width: 2px;
  height: 30px;
  background: #333;
  margin: 0 auto;
}

.legs {
  width: 30px;
  height: 30px;
  border-bottom: 2px solid #333;
  border-left: 2px solid #333;
  border-right: 2px solid #333;
  margin: 0 auto;
}
</style>
