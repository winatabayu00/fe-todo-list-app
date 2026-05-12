<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  gridClass?: string
}

withDefaults(defineProps<Props>(), {
  gridClass: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'
})
</script>