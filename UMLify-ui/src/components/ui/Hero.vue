<template>
  <Section spacing="xxl" custom-class="flex items-center min-h-[calc(100vh-56px)]">
    <Container size="xl">
      <Grid cols="12" colsTablet="12" colsMobile="1" gap="xl" align="center" custom-class="items-stretch">
        
        <!-- Left Column: Content Content -->
        <div class="col-span-12 lg:col-span-5 flex flex-col justify-center">
          <Stack gap="lg" align="start">
            
            <!-- Product Badge -->
            <Badge variant="accent">
              Professional UML Editor
            </Badge>

            <!-- Headline -->
            <h1 class="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] text-left">
              The fastest way to design professional UML diagrams.
            </h1>

            <!-- Supporting Paragraph -->
            <p class="text-base text-text-secondary leading-relaxed max-w-lg text-left">
              Create, edit, and export professional UML diagrams directly in your browser. Umlify combines an intuitive, keyboard-driven workspace with auto-routing layouts to speed up system design.
            </p>

            <!-- CTA Row -->
            <Stack direction="row" gap="md" align="center" wrap class="w-full justify-start">
              <Button variant="primary" @click="handlePrimaryCTA">
                Launch Editor
              </Button>
              <Button variant="secondary" @click="handleSecondaryCTA">
                Explore Features
              </Button>
            </Stack>

            <!-- Trust Row -->
            <div class="pt-md w-full border-t border-border-default/50 text-left">
              <span class="text-xxs font-mono uppercase tracking-widest text-text-muted block mb-xs">
                Engineered for speed, compliance, and workflow integration
              </span>
              <div class="flex flex-wrap items-center gap-sm text-text-muted text-xs font-semibold">
                <span>✓ UML 2.5 Compliance</span>
                <span class="text-border-default/85">•</span>
                <span>✓ Auto-Layout Snapping</span>
                <span class="text-border-default/85">•</span>
                <span>✓ Instant SVG Export</span>
                <span class="text-border-default/85">•</span>
                <span>✓ Keyboard Shortcuts</span>
              </div>
            </div>
            
          </Stack>
        </div>

        <!-- Right Column: Bounding Workspace Editor Placeholder -->
        <div class="col-span-12 lg:col-span-7 flex items-stretch min-h-[350px] md:min-h-[450px] lg:min-h-[500px]">
          <Surface
            depth="1"
            radius="lg"
            class="w-full h-full flex flex-col items-center justify-center border-dashed border-2 border-border-elevated bg-bg-surface/30 p-lg"
          >
            <div class="text-center">
              <!-- Geometric diagram mockup placeholder -->
              <svg class="h-10 w-10 text-text-muted/40 mx-auto mb-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <path d="M7 7h4v4H7zM13 13h4v4h-4zM11 9h2v4h-2z" />
              </svg>
              <span class="text-xxs font-mono uppercase tracking-widest text-text-muted block mb-xxs">
                Interactive Workspace Editor
              </span>
              <span class="text-xs text-text-secondary block max-w-xs mx-auto">
                Reserved for compiling syntax inputs and rendering vector canvases
              </span>
            </div>
          </Surface>
        </div>

      </Grid>
    </Container>
  </Section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Surface from './layout/Surface.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'

const router = useRouter()

const handlePrimaryCTA = () => {
  router.push('/workspace')
}

const handleSecondaryCTA = () => {
  const el = document.getElementById('features')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
