<template>
  <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
      </div>
      <div :class="iconContainerClass">
        <slot name="icon">
          <!-- Default icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  color?: 'blue' | 'green' | 'purple' | 'indigo' | 'red' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const iconContainerClass = computed(() => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-purple-50 text-purple-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    red: 'bg-red-50 text-red-500',
    yellow: 'bg-yellow-50 text-yellow-500'
  }
  return `p-2 ${colorClasses[props.color]} rounded-lg`
})
</script>