<template>
  <div class="h-screen overflow-y-auto w-screen bg-bg-base text-text-primary select-none scroll-smooth">
    <!-- Sticky Glassmorphic Navbar -->
    <Navbar />

    <main>
      <!-- Hero Section -->
      <Hero />

      <!-- Interactive Walkthrough Tour -->
      <InteractiveShowcase />
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/ui/layout/Navbar.vue'
import Hero from '../components/ui/Hero.vue'
import InteractiveShowcase from '../components/ui/InteractiveShowcase.vue'
</script>
