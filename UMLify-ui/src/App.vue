<template>
  <div class="h-screen w-screen bg-bg-base text-text-primary font-sans antialiased overflow-hidden select-none">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" class="h-full w-full" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// Presentational setup layer maintaining zero tracking overrides
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
