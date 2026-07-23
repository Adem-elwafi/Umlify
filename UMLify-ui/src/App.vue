<template>
  <div class="h-screen w-screen bg-bg-base text-text-primary font-sans antialiased overflow-hidden select-none">
    <router-view v-slot="{ Component }">
      <component :is="Component" class="h-full w-full" />
    </router-view>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(() => route.fullPath, (path) => {
  console.log('[Router] navigated to', path)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
