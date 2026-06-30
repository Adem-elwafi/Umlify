<template>
  <div
    class="grid"
    :class="[
      mobileColsClasses[colsMobile.toString()],
      colsTablet ? tabletColsClasses[colsTablet.toString()] : '',
      desktopColsClasses[cols.toString()],
      gapClasses[gap],
      customClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  cols: {
    type: [Number, String],
    default: 12
  },
  colsTablet: {
    type: [Number, String],
    default: null
  },
  colsMobile: {
    type: [Number, String],
    default: 1
  },
  gap: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].includes(value)
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

const mobileColsClasses = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '12': 'grid-cols-12'
}

const tabletColsClasses = {
  '1': 'md:grid-cols-1',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
  '6': 'md:grid-cols-6',
  '8': 'md:grid-cols-8',
  '12': 'md:grid-cols-12'
}

const desktopColsClasses = {
  '1': 'lg:grid-cols-1',
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
  '5': 'lg:grid-cols-5',
  '6': 'lg:grid-cols-6',
  '7': 'lg:grid-cols-7',
  '8': 'lg:grid-cols-8',
  '9': 'lg:grid-cols-9',
  '10': 'lg:grid-cols-10',
  '11': 'lg:grid-cols-11',
  '12': 'lg:grid-cols-12'
}
</script>
