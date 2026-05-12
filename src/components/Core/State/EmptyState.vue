<template>
  <div class="text-center py-12">
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <slot name="icon" />
    </div>
    <h3 class="text-lg font-medium text-gray-700 mb-1">{{ title }}</h3>
    <p class="text-gray-500 mb-4">{{ description }}</p>
    <div class="flex justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No data found',
  description: 'Try adjusting your search or filter to find what you\'re looking for.'
})
</script>