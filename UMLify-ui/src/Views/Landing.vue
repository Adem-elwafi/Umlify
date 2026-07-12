<template>
  <div class="h-screen overflow-y-auto w-screen bg-transparent text-text-primary select-none scroll-smooth relative z-0">
    <!-- Ambient Gradient Background Layer -->
    <div class="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(160%_140%_at_50%_0%,#fff_30%,var(--color-accent-aura)_100%)] dark:[background:radial-gradient(160%_140%_at_50%_0%,#000_30%,var(--color-accent-aura)_100%)]"></div>

    <!-- Sticky Glassmorphic Navbar -->
    <Navbar />

    <main>
      <!-- Hero Section -->
      <Hero />

      <!-- Interactive Walkthrough Tour -->
      <InteractiveShowcase />

      <!-- Core Capabilities Section -->
      <Capabilities />

      <!-- Supported Diagram Types Showcase -->
      <DiagramShowcase />

      <!-- Export & Integrations Section -->
      <ExportIntegrations />

      <!-- Keyboard-First Productivity Section -->
      <ProductivitySection />

      <!-- Open Development Roadmap Section -->
      <RoadmapSection />

      <!-- Engineering FAQ Section -->
      <FAQSection />

      <!-- Engineering Trust & Social Proof Section -->
      <TrustSection />

      <!-- Simple Pricing Section -->
      <PricingSection />

      <!-- Final Conversion CTA Section -->
      <FinalCTASection />

      <!-- Footer Section -->
      <FooterSection />
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/ui/layout/Navbar.vue'
import Hero from '../components/ui/Hero.vue'
import InteractiveShowcase from '../components/ui/InteractiveShowcase.vue'
import Capabilities from '../components/ui/Capabilities.vue'
import DiagramShowcase from '../components/ui/DiagramShowcase.vue'
import ExportIntegrations from '../components/ui/ExportIntegrations.vue'
import ProductivitySection from '../components/ui/ProductivitySection.vue'
import RoadmapSection from '../components/ui/RoadmapSection.vue'
import FAQSection from '../components/ui/FAQSection.vue'
import TrustSection from '../components/ui/TrustSection.vue'
import PricingSection from '../components/ui/PricingSection.vue'
import FinalCTASection from '../components/ui/FinalCTASection.vue'
import FooterSection from '../components/ui/FooterSection.vue'
</script>
