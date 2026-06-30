<template>
  <div
    class="flex"
    :class="[
      direction === 'row' ? 'flex-row' : 'flex-col',
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      wrap ? 'flex-wrap' : 'flex-nowrap',
      customClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    default: 'column',
    validator: (value) => ['row', 'column'].includes(value)
  },
  gap: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].includes(value)
  },
  align: {
    type: String,
    default: 'stretch',
    validator: (value) => ['start', 'center', 'end', 'stretch', 'baseline'].includes(value)
  },
  justify: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'center', 'end', 'between', 'around'].includes(value)
  },
  wrap: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const gapClasses = {
  none: 'gap-0',
  xxs: 'gap-xxs',
  xs: 'gap-xs',
  sm: 'gap-sm',
  md: 'gap-md',
  lg: 'gap-lg',
  xl: 'gap-xl',
  xxl: 'gap-xxl',
  xxxl: 'gap-xxxl'
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline'
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around'
}
</script>
