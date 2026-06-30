<template>
  <div class="min-h-screen bg-bg-base text-text-primary overflow-y-auto">
    <Navbar />
    
    <div class="p-lg">
    <!-- Navbar / Header -->
    <header class="border-b border-border-default pb-md mb-xl flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Umlify Design System Playground</h1>
        <p class="text-sm text-text-secondary">Visual verification workspace for core UI primitives and layout tokens.</p>
      </div>
      <div class="flex gap-xs">
        <Button variant="secondary" size="sm" @click="toggleTheme">
          Toggle Theme
        </Button>
        <Button variant="primary" size="sm" @click="isDialogOpen = true">
          Open Demo Dialog
        </Button>
      </div>
    </header>

    <Container size="xl">
      <Stack gap="xl">
        
        <!-- Hero Section Layout Demo -->
        <section class="border border-border-default rounded-panel bg-bg-surface/10 overflow-hidden">
          <div class="px-md py-xs border-b border-border-default bg-bg-surface flex items-center justify-between">
            <span class="text-xs font-mono uppercase tracking-widest text-text-muted">Hero Composition Section Layout</span>
            <Badge variant="neutral">Proportional Grid Bounding</Badge>
          </div>
          <Hero />
        </section>

        <!-- 1. Color Surfaces & Depth Section -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">01. Colors & Surface Elevations</h2>
          <Grid cols="4" colsTablet="2" gap="md">
            <Surface depth="0" radius="md" class="p-md text-center">
              <span class="text-xs font-mono block text-text-muted mb-xxs">Depth 0</span>
              <span class="text-sm font-semibold">Base Canvas</span>
            </Surface>
            <Surface depth="1" radius="md" class="p-md text-center">
              <span class="text-xs font-mono block text-text-muted mb-xxs">Depth 1</span>
              <span class="text-sm font-semibold">Standard Surface</span>
            </Surface>
            <Surface depth="2" radius="md" class="p-md text-center">
              <span class="text-xs font-mono block text-text-muted mb-xxs">Depth 2</span>
              <span class="text-sm font-semibold">Elevated Panel</span>
            </Surface>
            <Surface depth="3" radius="md" class="p-md text-center">
              <span class="text-xs font-mono block text-text-muted mb-xxs">Depth 3</span>
              <span class="text-sm font-semibold">Floating Overlay</span>
            </Surface>
          </Grid>
        </section>

        <!-- 2. Typography Hierarchy -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">02. Typography</h2>
          <Surface depth="1" radius="md" class="p-lg">
            <Stack gap="md">
              <div>
                <span class="text-xxs font-mono text-text-muted block mb-xxs">Hero Display (56px, tracking-tight)</span>
                <span class="text-4xl lg:text-5xl font-bold tracking-tight">The fastest way to design diagrams.</span>
              </div>
              <Divider />
              <div>
                <span class="text-xxs font-mono text-text-muted block mb-xxs">Section Heading (36px)</span>
                <h3 class="text-3xl font-semibold tracking-tight">Standard Section Header</h3>
              </div>
              <Divider />
              <div>
                <span class="text-xxs font-mono text-text-muted block mb-xxs">Card Title (20px)</span>
                <h4 class="text-lg font-semibold">Interactive Properties Inspector</h4>
              </div>
              <Divider />
              <div>
                <span class="text-xxs font-mono text-text-muted block mb-xxs">Body Text & Monospace Code (15px / 13px)</span>
                <p class="text-text-secondary leading-relaxed mb-xs">
                  Umlify separates model logic from diagram rendering, offering keyboard layouts.
                </p>
                <code class="font-mono text-xs text-interactive-accent bg-bg-elevated px-xs py-xxs rounded">
                  class OrderController extends BaseController
                </code>
              </div>
            </Stack>
          </Surface>
        </section>

        <!-- 3. Button Component -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">03. Buttons</h2>
          <Surface depth="1" radius="md" class="p-lg">
            <Stack gap="lg">
              <div class="flex flex-wrap gap-md items-center">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="ghost">Ghost Trigger</Button>
              </div>
              <div class="flex flex-wrap gap-md items-center">
                <Button variant="primary" disabled>Primary Disabled</Button>
                <Button variant="secondary" disabled>Secondary Disabled</Button>
                <Button variant="secondary" loading>Loading Action</Button>
              </div>
              <div class="flex flex-wrap gap-md items-center">
                <Button variant="primary" size="sm">Small size</Button>
                <Button variant="primary" size="md">Medium size</Button>
                <Button variant="primary" size="lg">Large size</Button>
              </div>
              <div class="w-full max-w-sm">
                <Button variant="secondary" full>Full Width Block Button</Button>
              </div>
            </Stack>
          </Surface>
        </section>

        <!-- 4. Input & Textarea Elements -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">04. Inputs & Forms</h2>
          <Surface depth="1" radius="md" class="p-lg">
            <Grid cols="2" colsTablet="1" gap="lg">
              <Stack gap="md">
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  v-model="inputDemo1"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  v-model="inputDemo2"
                  error="Password must be at least 8 characters."
                />
                <Input
                  label="Disabled Entry"
                  placeholder="Locked input text"
                  disabled
                />
              </Stack>
              <Stack gap="md">
                <Textarea
                  label="UML Syntax Input"
                  placeholder="class User { ... }"
                  v-model="textareaDemo"
                  rows="4"
                />
                <Textarea
                  label="Textarea Error Validation"
                  placeholder="Syntax errors..."
                  error="Parser compilation failed at Line 3."
                  rows="2"
                />
              </Stack>
            </Grid>
          </Surface>
        </section>

        <!-- 5. Badges & Tags -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">05. Badges & Tags</h2>
          <Surface depth="1" radius="md" class="p-lg">
            <div class="flex flex-wrap gap-md items-center">
              <Badge variant="neutral">Neutral Info</Badge>
              <Badge variant="success">Success Saved</Badge>
              <Badge variant="warning">Warning Overwrite</Badge>
              <Badge variant="error">Error Compilation</Badge>
              <Badge variant="accent">Accent Active</Badge>
            </div>
          </Surface>
        </section>

        <!-- 6. Card & Hover states -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">06. Cards & Containers</h2>
          <Grid cols="3" colsTablet="1" gap="md">
            <Card>
              <template #header>
                <h5 class="text-sm font-semibold">Standard Card Header</h5>
              </template>
              <p class="text-xs text-text-secondary">This card is a static surface containing text.</p>
            </Card>
            <Card hoverable>
              <template #header>
                <h5 class="text-sm font-semibold">Interactive Card</h5>
              </template>
              <p class="text-xs text-text-secondary">Hovering lifts this card and increases border contrast.</p>
            </Card>
            <Card>
              <p class="text-xs text-text-secondary mb-xs">Card without header, containing custom footer.</p>
              <template #footer>
                <span class="text-xxs font-mono text-text-muted">ID: CARD_003</span>
              </template>
            </Card>
          </Grid>
        </section>

        <!-- 7. Collapsible Panels -->
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest text-text-muted mb-md">07. Collapsible Panels</h2>
          <Grid cols="2" colsTablet="1" gap="md">
            <Panel title="Properties Inspector" collapsible>
              <div class="p-md text-xs text-text-secondary">
                This is a collapsible panel container. Click the caret icon in the title bar to collapse or expand it.
              </div>
            </Panel>
            <Panel title="Syntax Panel" collapsible :default-expanded="false">
              <div class="p-md text-xs text-text-secondary">
                This panel starts in a collapsed state.
              </div>
            </Panel>
          </Grid>
        </section>

      </Stack>
    </Container>

    <!-- Dialog / Modal Test component -->
    <Dialog
      :is-open="isDialogOpen"
      title="Design System Demo Dialog"
      @close="isDialogOpen = false"
    >
      <p class="text-sm mb-md text-text-secondary leading-relaxed">
        This modal uses our global overlay and glassmorphism backdrop variables. It scales and fades using standard motion easings.
      </p>
      <template #footer>
        <Button variant="secondary" size="sm" @click="isDialogOpen = false">
          Cancel
        </Button>
        <Button variant="primary" size="sm" @click="isDialogOpen = false">
          Acknowledge
        </Button>
      </template>
    </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/ui/layout/Navbar.vue'
import Hero from '@/components/ui/Hero.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import Panel from '@/components/ui/Panel.vue'
import Dialog from '@/components/ui/Dialog.vue'

// Layout primitives
import Surface from '@/components/ui/layout/Surface.vue'
import Container from '@/components/ui/layout/Container.vue'
import Stack from '@/components/ui/layout/Stack.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Section from '@/components/ui/layout/Section.vue'
import Divider from '@/components/ui/Divider.vue'

const inputDemo1 = ref('')
const inputDemo2 = ref('')
const textareaDemo = ref('')
const isDialogOpen = ref(false)

const toggleTheme = () => {
  document.documentElement.classList.toggle('dark')
}
</script>
