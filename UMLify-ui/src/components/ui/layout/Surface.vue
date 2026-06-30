<template>
  <component
    :is="as"
    class="transition-all duration-250 ease-tactile"
    :class="[
      depthClasses[depth],
      radiusClasses[radius],
      border ? 'border border-border-default' : '',
      hoverable ? 'hover:bg-bg-elevated hover:border-border-elevated hover:translate-y-[-2px] hover:shadow-lg cursor-pointer' : '',
      customClass
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  as: {
    type: String,
    default: 'div'
  },
  depth: {
    type: String,
    default: '1',
    validator: (value) => ['0', '1', '2', '3'].includes(value)
  },
  radius: {
    type: String,
    default: 'none',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  border: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const depthClasses = {
  '0': 'bg-bg-base',
  '1': 'bg-bg-surface',
  '2': 'bg-bg-elevated',
  '3': 'bg-bg-elevated shadow-xl'
}

const radiusClasses = {
  'none': 'rounded-none',
  'sm': 'rounded-interactive',
  'md': 'rounded-card',
  'lg': 'rounded-panel'
}
</script>
