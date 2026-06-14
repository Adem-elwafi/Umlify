<template>
  <div class="h-full w-full bg-canvasBg text-gray-100 flex flex-col overflow-hidden">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" class="h-full w-full" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// Purely layout logic; all state configurations are cleanly distributed to routing paths
</script>

<style scoped>
/* Smooth cross-fade transition animations between auth and canvas pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>